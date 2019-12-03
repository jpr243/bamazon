DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE table products (
item_id INT NOT NULL,
product_name VARCHAR(200),
department_name VARCHAR(200),
price DECIMAL(12, 2) NOT NULL,
stock_quantity INT,
UNIQUE (item_id),
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES  ('Fondant mold', 'kitchen_and_dining', 15.73, 25),
            ('Sheet and pillowcase sets', 'bedding_and_linen', 37.75, 82),
            ('Toilet roll holder', 'bathroom_accessories', 12.00, 6),
            ('Hand towels', 'bathroom_linen', 12.61, 52),
            ('Light bulbs', 'lighting', 8.69, 120),
            ('Canon camera', 'photography', 3569.15, 25),
            ('8 inch cake tin', 'cake_decorating_suppplies', 23.45, 12),
            ('Feather pillow twin pack', 'bedding_and_linen', 39.95, 2),
            ('Wok', 'kitchen_and_dining', 76.63, 18),
            ('Desk lamp', 'lighting', 46.98, 43);