package com.autoflex.resources;

import com.autoflex.models.*;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.*;
import java.util.stream.Collectors;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class InventoryResource {

    @GET
    @Path("/materials")
    public List<RawMaterial> listMaterials() {
        return RawMaterial.listAll();
    }

    @POST
    @Path("/materials")
    @Transactional
    public Response createMaterial(RawMaterial m) {
        m.persist();
        return Response.status(Response.Status.CREATED).entity(m).build();
    }

    @PUT
    @Path("/materials/{id}")
    @Transactional
    public Response updateMaterial(@PathParam("id") Long id, RawMaterial m) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) return Response.status(Response.Status.NOT_FOUND).build();
        entity.name = m.name;
        entity.stockQuantity = m.stockQuantity;
        return Response.ok(entity).build(); 
    }

    @DELETE
    @Path("/materials/{id}")
    @Transactional
    public Response deleteMaterial(@PathParam("id") Long id) {
        boolean deleted = RawMaterial.deleteById(id);
        return deleted ? Response.noContent().build() : Response.status(Response.Status.NOT_FOUND).build();
    }

    @GET
    @Path("/products")
    public List<Product> listProducts() {
        return Product.listAll();
    }

    @POST
    @Path("/products")
    @Transactional
    public Response createProduct(Product p) {
        if (p.materials != null) {
            for (ProductMaterial pm : p.materials) {
                pm.product = p;
                pm.rawMaterial = RawMaterial.findById(pm.rawMaterial.id);
            }
        }
        p.persist();
        return Response.status(Response.Status.CREATED).entity(p).build();
    }

    @PUT
    @Path("/products/{id}")
    @Transactional
    public Response updateProduct(@PathParam("id") Long id, Product p) {
        Product entity = Product.findById(id);
        if (entity == null) return Response.status(Response.Status.NOT_FOUND).build();

        entity.name = p.name;
        entity.price = p.price;
        entity.materials.clear();

        if (p.materials != null) {
            for (ProductMaterial pm : p.materials) {
                ProductMaterial newPm = new ProductMaterial();
                newPm.product = entity;
                newPm.rawMaterial = RawMaterial.findById(pm.rawMaterial.id);
                newPm.requiredQuantity = pm.requiredQuantity;
                entity.materials.add(newPm);
            }
        }
        return Response.ok(entity).build(); 
    }

    @DELETE
    @Path("/products/{id}")
    @Transactional
    public Response deleteProduct(@PathParam("id") Long id) {
        boolean deleted = Product.deleteById(id);
        return deleted ? Response.noContent().build() : Response.status(Response.Status.NOT_FOUND).build();
    }

    @GET
    @Path("/production/suggested")
    public Response getSuggestedProduction() {
        List<Product> allProducts = Product.listAll();
        List<RawMaterial> allMaterials = RawMaterial.listAll();

        Map<Long, Double> tempStock = allMaterials.stream()
            .collect(Collectors.toMap(m -> m.id, m -> m.stockQuantity));

        List<Product> sortedProducts = allProducts.stream()
            .sorted(Comparator.comparing((Product p) -> p.price).reversed())
            .collect(Collectors.toList());

        List<Map<String, Object>> productionPlan = new ArrayList<>();
        double totalRevenue = 0;

        for (Product p : sortedProducts) {
            long unitsProduced = 0;
            boolean canProduce = true;

            if (p.materials == null || p.materials.isEmpty()) canProduce = false;

            while (canProduce) {
                for (ProductMaterial pm : p.materials) {
                    Double available = tempStock.get(pm.rawMaterial.id);
                    if (available == null || available < pm.requiredQuantity) {
                        canProduce = false;
                        break;
                    }
                }

                if (canProduce) {
                    for (ProductMaterial pm : p.materials) {
                        tempStock.put(pm.rawMaterial.id, tempStock.get(pm.rawMaterial.id) - pm.requiredQuantity);
                    }
                    unitsProduced++;
                }
            }

            Map<String, Object> item = new HashMap<>();
            item.put("id", p.id);
            item.put("name", p.name);
            item.put("price", p.price);
            item.put("suggestedQuantity", unitsProduced);
            productionPlan.add(item);
            
            totalRevenue += (unitsProduced * p.price);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("productionPlan", productionPlan);
        response.put("totalRevenue", totalRevenue);

        return Response.ok(response).build();
    }
}