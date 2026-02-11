package com.autoflex;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;

@QuarkusTest
public class RawMaterialResourceTest {

    @Test
    public void testCreateAndListMaterial() {
        String payload = "{\"name\": \"Aço\", \"stockQuantity\": 50.0}";

        given()
            .contentType(ContentType.JSON)
            .body(payload)
            .when().post("/api/materials")
            .then()
            .statusCode(201); 

        given()
            .when().get("/api/materials")
            .then()
            .statusCode(200)
            .body("size()", greaterThanOrEqualTo(1)) 
            .body("name.contains(\"Aço\")", is(true));
    }
}