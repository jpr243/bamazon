var mysql = require ('mysql');
var inquirer = require ('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "",
    database: ""
  });

  //start connection to database
  connection.connect(function(err) {
    if (err) throw err;
    console.log('connected as id' + connection.threadId);
  //call first function
    purchaseProduct();
  });

  
//display products in database table and then ask user which product they want to purchase
  function purchaseProduct() {
    connection.query('SELECT * FROM products', function(err, res){
      if (err) throw err;
      console.log(res);

      //display products and price to user
     for (var i = 0; i < res.length; i++) {
       console.log('Product Id: ' + res[i].item_id + 'Item: ' + res[i].product_name +  ' | Department Name: ' + res.[i].department_name + ' | Price: ' + res[i].Price + ' | Stock: ' + res[i].stock_quantity);
      };
        inquirer.prompt({
        name: "item_id",
        type: "rawlist",
        message: "Which item would you like to buy: ",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < res.length; i++){
            choiceArray.push(res[i].product_name);
          }
            return choiceArray;
          }
        }
        });
      
          
