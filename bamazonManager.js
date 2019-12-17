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
  resetData();
  managerPrompt();
});

//GLOBAL VARIABLES
var productToUpdate = {};

//FUNCTIONS
var resetData = function() {
  productToUpdate = {};
};

//display products in database table and then ask user which product they want to purchase
var managerPrompt = function() {
  inquirer
    .prompt({
      name: "managerChoice",
      type: "list",
      message: "\n\nWhat would you like to do today? ",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "End Session"
      ]
    })
    .then(answer => {
      switch (answer.managerChoice) {
        case "View Products for Sale":
          viewProducts();
          break;
        case "View Low Inventory":
          lowInventory();
          break;
        case "Add to Inventory":
          addInventory();
          break;
        case "Add New Product":
          addProduct();
          break;
        case "End Session":
          console.log("Bye!");
          connection.end();
      }
    });

  var viewProducts = function() {
    connection.query("SELECT * FROM products", (err, res) => {
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
      managerPrompt();
    });
  };

  var lowInventory = function() {
    connection.query(
      "SELECT * FROM products WHERE stock_quantity < 5 ORDER BY stock_quantity DESC",
      (err, res) => {
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
        managerPrompt();
      }
    );
  };

  var addInventory = function() {
    requestID();
  };

  var addProduct = function() {
    inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message: "Enter the product name: "
        },
        {
          name: "department",
          type: "input",
          message: "Enter the product department: "
        },
        {
          name: "price",
          type: "input",
          message: "Enter the product price: ",
          validate: value => {
            if (!isNaN(value) && value > 0) {
              return true;
            } else {
              console.log("Please enter a number greater than 0");
              return false;
            }
          }
        },
        {
          name: "quantity",
          type: "input",
          message: "Enter the number of items in stock: ",
          validate: value => {
            if (!isNaN(value) && value > 0) {
              return true;
            } else {
              console.log("Please enter a number greater than 0");
              return false;
            }
          }
        }
      ])
      .then(answers => {
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answers.name,
            department_name: answers.department,
            price: answers.price,
            stock_quantity: answers.quantity
          },
          (err, res) => {
            if (err) throw err;
            console.log("\n\tProduct successfully added");
            viewProducts();
          }
        );
      });
  };

  var requestID = function() {
    inquirer
      .prompt({
        name: "itemID",
        type: "input",
        message: "Enter the ID of the item you'd like to update: ",
        //validate input is number between 1 and 10
        validate: value => {
          if (!isNaN(value) && value <= 10) {
            return true;
          } else {
            console.log("Please enter a number between 1 and 10");
            return false;
          }
        }
        //select all rows where ID = manager's input
      })
      .then(answer => {
        connection.query(
          "SELECT * FROM products WHERE ?",
          { item_id: answer.itemID },
          (err, res) => {
            confirmProduct(res[0].product_name, res);
          }
        );
      });
  };

  var confirmProduct = function(product_name, object) {
    inquirer
      .prompt({
        name: "confirmProduct",
        type: "confirm",
        message: "You chose: " + product_name + "." + " Is this correct?"
      })
      .then(answer => {
        if (answer.confirmProduct) {
          productToUpdate = {
            item_id: object[0].item_id,
            product_name: object[0].product_name,
            department_name: object[0].department_name,
            price: object[0].price,
            stock_quantity: object[0].stock_quantity
          };
          askHowMany();
        } else {
          requestID();
        }
      });
  };

  var askHowMany = function() {
    inquirer
      .prompt({
        name: "howMany",
        type: "input",
        message: "Enter the quantity you would like to add: ",
        validate: value => {
          if (!isNaN(value) && value > 0) {
            return true;
          } else {
            console.log("Please enter a number greater than 0");
            return false;
          }
        }
      })
      .then(answer => {
        productToUpdate.howMany = answer.howMany;
        connection.query(
          "UPDATE product SET ? WHERE ?",
          [
            {
              stock_quantity:
                parseInt(productToUpdate.stock_quantity) +
                parseInt(answer.howMany)
            },
            {
              item_id: productToUpdate.item_id
            }
          ],
          (err, res) => {
            console.log(
              `\n\tInventory has been successfully updated! There are now ${parseInt(
                productToUpdate.stock_quantity
              ) + parseInt(answer.howMany)} in stock.
              `
            );
            managerPrompt();
          }
        );
      });
  };
};
