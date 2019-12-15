var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("cli-table");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "",
  database: "bamazon"
});

//start connection to database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id" + connection.threadId);
  //call first function
  displayProducts();
});

//display products in database table and then ask user which product they want to purchase
var displayProducts = function() {
  var selectProducts = "SELECT * FROM products";
  connection.query(selectProducts, function(err, res) {
    if (err) throw err;
    var displayTable = new table({
      head: ["Item ID", "Product Name", "Department", "Price", "Quantity"],
      colWidths: [10, 50, 50, 10, 10]
    });
    for (var i = 0; i < res.length; i++) {
      displayTable.push([
        res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        res[i].price,
        res[i].stock_quantity
      ]);
    }
    console.log(displayTable.toString());
    purchasePrompt();
  });
};

function purchasePrompt() {
  inquirer
    .prompt([
      {
        name: "ID",
        type: "input",
        message: "Please enter ID of the product you would like to buy? ",
        filter: Number
      },
      {
        name: "Quantity",
        type: "input",
        message: "How many units do you wish to purchase?",
        filter: Number
      }
    ])
    .then(function(answers) {
      var unitsNeeded = answers.Quantity;
      var itemID = answers.ID;
      purchaseOrder(itemID, unitsNeeded);
    });
}

function purchaseOrder(ID, numNeeded) {
  connection.query("SELECT * FROM products WHERE item_id =?", ID, function(
    err,
    res
  ) {
    if (err) {
      console.log(err);
    }
    if (numNeeded <= res[0].stock_quantity) {
      var totalCost = res[0].price * numNeeded;
      console.log("Great News - Your order is in stock!");
      console.log(
        "The total cost for " +
          numNeeded +
          " " +
          res[0].product_name +
          "(s) is " +
          "$" +
          totalCost +
          " -  Thank you!"
      );

      connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - " +
          numNeeded +
          " WHERE item_id = " +
          ID
      );
    } else {
      console.log(
        "Insufficient Quantity available of " +
          res[0].product_name +
          " to complete your order."
      );
    }
    displayProducts();
  });
}
