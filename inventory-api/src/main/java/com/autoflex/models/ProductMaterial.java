package com.autoflex.models;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class ProductMaterial extends PanacheEntity {
    @ManyToOne @JsonIgnore
    public Product product;

    @ManyToOne
    public RawMaterial rawMaterial;
    
    public Double requiredQuantity;
}