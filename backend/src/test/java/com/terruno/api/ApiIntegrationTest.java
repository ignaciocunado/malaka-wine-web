package com.terruno.api;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasSize;
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
    void catalogIsPublic() throws Exception {
        mvc.perform(get("/api/plans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[*].code", containsInAnyOrder("VINO", "MESA", "ACEITE")));
        mvc.perform(get("/api/producers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(6)));
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
                .andExpect(jsonPath("$.detail").value("Incorrect email or password"));
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
                .andExpect(jsonPath("$.errors.adultConfirmed").exists());
    }

    @Test
    void savesAndUpdatesTasteProfile() throws Exception {
        String auth = "Bearer " + register(uniqueEmail());
        mvc.perform(get("/api/taste-profile").header("Authorization", auth)).andExpect(status().isNotFound());

        mvc.perform(put("/api/taste-profile").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content(tasteProfile("BOTH", "[\"RED\", \"SWEET\"]")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.wineStyles", containsInAnyOrder("RED", "SWEET")))
                .andExpect(jsonPath("$.updatedAt").isNotEmpty());

        mvc.perform(put("/api/taste-profile").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content(tasteProfile("WINE", "[\"WHITE\"]")))
                .andExpect(status().isOk());

        mvc.perform(get("/api/taste-profile").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productPreference").value("WINE"))
                .andExpect(jsonPath("$.wineStyles", containsInAnyOrder("WHITE")))
                .andExpect(jsonPath("$.oliveVarieties", containsInAnyOrder("VERDIAL")));

        mvc.perform(put("/api/taste-profile").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content(tasteProfile("WINE", "[\"FORTIFIED\"]")))
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
                        .content("{\"planCode\": \"MESA\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.planCode").value("MESA"));

        mvc.perform(put("/api/subscription").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"planCode\": \"NOPE\"}"))
                .andExpect(status().isBadRequest());

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

    private static String tasteProfile(String preference, String wineStyles) {
        return """
                {
                  "productPreference": "%s",
                  "wineStyles": %s,
                  "wineBody": 3,
                  "wineSweetness": "DRY",
                  "adventurousness": 4,
                  "oilIntensity": "MEDIUM",
                  "oliveVarieties": ["VERDIAL"],
                  "oilUses": ["DRESSING", "BREAD"],
                  "bottlesPerBox": 2,
                  "deliveryFrequency": "MONTHLY",
                  "monthlyBudgetEur": 50,
                  "notes": "No oaky whites, please"
                }
                """.formatted(preference, wineStyles);
    }

    private static String uniqueEmail() {
        return "user-" + UUID.randomUUID() + "@example.com";
    }
}
