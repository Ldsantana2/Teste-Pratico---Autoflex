package com.autoflex.resources;

import com.autoflex.models.*;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.*;

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
        if (entity == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        entity.name = m.name;
        entity.stockQuantity = m.stockQuantity;
        return Response.ok(entity).build(); 
    }

    @DELETE
    @Path("/materials/{id}")
    @Transactional
    public Response deleteMaterial(@PathParam("id") Long id) {
        boolean deleted = RawMaterial.deleteById(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
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
        if (entity == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

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
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}