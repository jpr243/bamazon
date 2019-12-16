# bamazon

This is an Amazon-like storefront using MySQL, Inquirer and CLI App npm packages.
The app will take orders from customers and deplete stock from the inventory.

There are two views 
### Customer View
The products table the following columns:

1. item_id (unique id for each product)
2. product_name (Name of product)
3. department_name
4. price (cost to customer)
5. stock_quantity (how much of the product is available in stores)

The database is populated with 10 different products.
<img src="images/bamazonCustomer1.gif" height="400" alt="Screenshot"/> 

The user is prompted with two messages.
1.  Asking them the ID of the product they would like to buy.
2.  How many units of the product they would like to buy.

####Successful purchase

<img src="images/bamazonCustomerPurchaseSuccess.gif" height="400" alt="Screenshot"/> 


###Insufficient quantity

<img src="images/bamazonCustomerInsufficientQuantity.gif" height="400" alt="Screenshot"/> 










### Manager View
