package com.terruno.api.catalog;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Public, read-only catalog used by the marketing site. */
@RestController
@RequestMapping("/api")
public class CatalogController {

    public record PlanResponse(String code, String name, String tagline, String contents,
                               ProductType productType, int priceCents, boolean featured) {
        static PlanResponse from(Plan p) {
            return new PlanResponse(p.getCode(), p.getName(), p.getTagline(), p.getContents(),
                    p.getProductType(), p.getPriceCents(), p.isFeatured());
        }
    }

    public record ProducerResponse(String slug, String name, Producer.Kind kind, String town, String area,
                                   String specialty, String description) {
        static ProducerResponse from(Producer p) {
            return new ProducerResponse(p.getSlug(), p.getName(), p.getKind(), p.getTown(), p.getArea(),
                    p.getSpecialty(), p.getDescription());
        }
    }

    private final PlanRepository plans;
    private final ProducerRepository producers;

    public CatalogController(PlanRepository plans, ProducerRepository producers) {
        this.plans = plans;
        this.producers = producers;
    }

    @GetMapping("/plans")
    public List<PlanResponse> plans() {
        return plans.findAllByOrderBySortOrderAsc().stream().map(PlanResponse::from).toList();
    }

    @GetMapping("/producers")
    public List<ProducerResponse> producers() {
        return producers.findAllByOrderByNameAsc().stream().map(ProducerResponse::from).toList();
    }
}
