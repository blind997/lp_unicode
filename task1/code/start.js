const fs =require("fs");
const customersData= fs.readFileSync("../data/customers.json","utf-8");
const customers =JSON.parse(customersData);

const ordersData= fs.readFileSync("../data/orders.json","utf-8");
const orders =JSON.parse(ordersData);

const productData= fs.readFileSync("../data/products.json","utf-8");
const products =JSON.parse(productData);

module.exports={ customers, orders, products};