var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("cli-table");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "OliverHank6",
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
      colWidths: [, 50, 50, 10, 10]
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
        name: "item_id",
        type: "input",
        message: "Please enter ID of the product you would like to buy? ",
        filter: Number
      },
      {
        name: "stock_quantity",
        type: "input",
        message: "How many units do you wish to purchase?",
        filter: Number
      }
    ])
    .then(function(answers) {
      var unitsNeeded = answers.stock_quantity;
      var itemID = answers.item_id;
      purchaseOrder(itemID, unitsNeeded);
    });
}
