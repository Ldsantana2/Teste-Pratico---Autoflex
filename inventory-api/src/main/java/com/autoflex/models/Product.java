package com.autoflex.models;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.util.*;

@Entity
public class Product extends PanacheEntity {
    public String name;
    public Double price;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<ProductMaterial> materials = new ArrayList<>();
}