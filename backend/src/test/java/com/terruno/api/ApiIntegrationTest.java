package com.terruno.api;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import com.jayway.jsonpath.JsonPath;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiIntegrationTest {

    private static final String PASSWORD = "olive-oil-123";

    @Autowired
    MockMvc mvc;

    @Test
    void catalogIsPublicAndOnlyListsActiveWinePlans() throws Exception {
        mvc.perform(get("/api/plans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[*].code", contains("VINO", "BODEGA", "RESERVA")))
                .andExpect(jsonPath("$[0].name").value("Descubre"));
        mvc.perform(get("/api/producers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(6)))
                .andExpect(jsonPath("$[*].slug", hasItem("lomas-de-rome")))
                .andExpect(jsonPath("$[*].slug", not(hasItem("finca-las-encinas"))));
    }

    @Test
    void protectedEndpointsRequireAToken() throws Exception {
        mvc.perform(get("/api/me")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/taste-profile")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/me").header("Authorization", "Bearer not-a-jwt")).andExpect(status().isUnauthorized());
    }

    @Test
    void registerThenLogIn() throws Exception {
        String email = uniqueEmail();
        String token = register(email);

        mvc.perform(get("/api/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.firstName").value("Lucía"));

        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email": "%s", "password": "%s"}
                                """.formatted(email.toUpperCase(), PASSWORD)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value(email));
    }

    @Test
    void rejectsWrongPasswordAndUnknownUser() throws Exception {
        String email = uniqueEmail();
        register(email);
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email": "%s", "password": "wrong-password"}
                                """.formatted(email)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.detail").value("Correo o contraseña incorrectos"));
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email": "nobody@example.com", "password": "whatever-123"}
                                """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsDuplicateEmailAndInvalidSignups() throws Exception {
        String email = uniqueEmail();
        register(email);
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content(registration(email, true)))
                .andExpect(status().isConflict());
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content(registration(uniqueEmail(), false)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.adultConfirmed").value("Debes ser mayor de 18 años para suscribirte"));
        mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email": "%s", "password": "%s", "firstName": "", "adultConfirmed": true}
                                """.formatted(uniqueEmail(), PASSWORD)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.firstName").value("no debe estar vacío"));
    }

    @Test
    void savesAndUpdatesTasteProfile() throws Exception {
        String auth = "Bearer " + register(uniqueEmail());
        mvc.perform(get("/api/taste-profile").header("Authorization", auth)).andExpect(status().isNotFound());

        mvc.perform(put("/api/taste-profile").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content(tasteProfile("[\"RED\", \"SWEET\"]")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.wineStyles", containsInAnyOrder("RED", "SWEET")))
                .andExpect(jsonPath("$.updatedAt").isNotEmpty());

        mvc.perform(put("/api/taste-profile").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content(tasteProfile("[\"WHITE\"]")))
                .andExpect(status().isOk());

        mvc.perform(get("/api/taste-profile").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.wineStyles", containsInAnyOrder("WHITE")))
                .andExpect(jsonPath("$.notes").value("Nada de blancos con madera, por favor"))
                .andExpect(jsonPath("$.oliveVarieties").doesNotExist());

        mvc.perform(put("/api/taste-profile").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content(tasteProfile("[\"FORTIFIED\"]")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void subscribesSwitchesPlanAndCancels() throws Exception {
        String auth = "Bearer " + register(uniqueEmail());
        mvc.perform(get("/api/subscription").header("Authorization", auth)).andExpect(status().isNotFound());

        mvc.perform(put("/api/subscription").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"planCode\": \"VINO\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.planCode").value("VINO"))
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.nextBoxDate").isNotEmpty());

        mvc.perform(put("/api/subscription").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"planCode\": \"BODEGA\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.planCode").value("BODEGA"))
                .andExpect(jsonPath("$.planName").value("Bodega"));

        // Unknown and retired (olive oil) plans can't be chosen.
        for (String code : new String[] {"NOPE", "MESA", "ACEITE"}) {
            mvc.perform(put("/api/subscription").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                            .content("{\"planCode\": \"%s\"}".formatted(code)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.detail").value("Este plan no está disponible"));
        }

        mvc.perform(delete("/api/subscription").header("Authorization", auth)).andExpect(status().isNoContent());
        mvc.perform(get("/api/subscription").header("Authorization", auth)).andExpect(status().isNotFound());
    }

    private String register(String email) throws Exception {
        String body = mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content(registration(email, true)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.token");
    }

    private static String registration(String email, boolean adult) {
        return """
                {"email": "%s", "password": "%s", "firstName": "Lucía", "lastName": "García", "adultConfirmed": %s}
                """.formatted(email, PASSWORD, adult);
    }

    private static String tasteProfile(String wineStyles) {
        return """
                {
                  "wineStyles": %s,
                  "wineBody": 3,
                  "wineSweetness": "DRY",
                  "adventurousness": 4,
                  "bottlesPerBox": 2,
                  "deliveryFrequency": "MONTHLY",
                  "monthlyBudgetEur": 50,
                  "notes": "Nada de blancos con madera, por favor"
                }
                """.formatted(wineStyles);
    }

    private static String uniqueEmail() {
        return "user-" + UUID.randomUUID() + "@example.com";
    }
}
