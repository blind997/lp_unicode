const{customers, orders, products}= require("./start");

function calculateSubtotal(order){
    let subtotal=0;
    for(const item of order.items){
        for(const product of products){
        if (item.productId === product.id) {
                subtotal += product.price * item.quantity;

             }
        }
    }
    return subtotal;
}
function calculateDiscount(subtotal){
    if(subtotal<2000){
        return 0;
    }
    else if(subtotal>=2000 &&subtotal<5000){
        return subtotal*0.05;
    }
    else 
    {
        return subtotal*0.10
    }

}
function calculateTax(discountedSubtotal){
    const taxpercent=0.18;
    return discountedSubtotal*taxpercent;


}
function calculateTotal(subtotal){
    const discount = calculateDiscount(subtotal);
    const discountedSubtotal=subtotal-discount;
    const tax=calculateTax(discountedSubtotal);
    const total= discountedSubtotal+tax;
    return total;
}
function generateOrderSummary(order) {
    const subtotal = calculateSubtotal(order);
    const discount = calculateDiscount(subtotal);
    const discountedSubtotal = subtotal - discount;
    const tax = calculateTax(discountedSubtotal);
    const total = calculateTotal(subtotal); 
    return{ subtotal, discount, discountedSubtotal, tax, total};
}
function getOrderById(id) {
    return orders.find(order => order.id == id);
}
function getOrdersByCustomer(customerId){
    const customerorders=[];
    for (const order of orders){
        if(order.customerId==customerId){
            customerorders.push(order);
        }
    }
    return customerorders;

}
for (const order of orders){
console.log(generateOrderSummary(order));
}
orders.forEach(order => {
    console.log(generateOrderSummary(order));
    
});
