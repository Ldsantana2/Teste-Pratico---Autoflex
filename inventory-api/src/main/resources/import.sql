
INSERT INTO RawMaterial (id, name, stockQuantity) VALUES (nextval('RawMaterial_SEQ'), 'Steel', 10.0);
INSERT INTO RawMaterial (id, name, stockQuantity) VALUES (nextval('RawMaterial_SEQ'), 'Plastic', 5.0);

INSERT INTO Product (id, name, price) VALUES (nextval('Product_SEQ'), 'Container A', 300.0);
INSERT INTO Product (id, name, price) VALUES (nextval('Product_SEQ'), 'Container B', 200.0);


INSERT INTO ProductMaterial (id, product_id, rawMaterial_id, requiredQuantity) VALUES (nextval('ProductMaterial_SEQ'), 1, 1, 3.0);
INSERT INTO ProductMaterial (id, product_id, rawMaterial_id, requiredQuantity) VALUES (nextval('ProductMaterial_SEQ'), 51, 51, 2.0);