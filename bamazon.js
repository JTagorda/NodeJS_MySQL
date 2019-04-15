var inquirer  = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'mysql',
    database: 'bamazon'
});

connection.connect();

start()

function start (){
    connection.query('SELECT * FROM products', function (error, res) {
        if (error) throw error;
        // console.log(res);
        res.forEach(row => {
            console.log(`Id: ${row.item_id} Name: ${row.product_name} Price: ${row.price}\n` )
        });
        askQuestions()

        // connection.end()
    })
}

function askQuestions() {
    inquirer.prompt([
        {
            message: "Please type in the product ID you would like to order.",
            type: "input",
            name: "prodId"
        },
        {
            message: "How many of this item would you like to purchase",
            type: "input",
            name: "prodQty"
        }
    ]).then(function (ans) {
        var prodId = ans.prodId;
        var prodQty = ans.prodQty;
        // var allProd = getAllProd();
        withdrawProd(prodId, prodQty)
    });
}

function withdrawProd(prodId, prodQty) {
  connection.query('SELECT * FROM products', function (error, res) {
    if (error) throw error;
    var prod;
    // console.log(res);
    for(var i = 0; i < res.length; i++){
      if(res[i].item_id == prodId){
        prod = res[i]
      }
    }
    console.log(prod, "prod was found")
      if(prod.stock_quantity >= prodQty){
        orderComplete(prod, prodId, prodQty)
        connection.end()
      }else{
        console.log("Insufficient stock. Your order has been cancelled.")
        connection.end()
      }
  })
};
function orderComplete (prodObj, prodId, prodQty) {
  var newQuantity = prodObj.stock_quantity - prodQty;
  var productSales = prodObj.price * prodQty;
  var queryOne = "UPDATE products SET stock_quantity = ? where ?";
  var queryTwo = "UPDATE products SET product_sales = ? where ?";
  connection.query(queryOne,[newQuantity, {item_id: prodId}], function (error, res) {
  })
  connection.query(queryTwo, [productSales, { item_id: prodId }], function (error, res) {
  })
}