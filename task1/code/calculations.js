const{customers, orders, products}= require("./start");

function calculateSubtotal(order){
    let subtotal=0;
    for(const item of order.items){
        for(const product of products){
        if (item.productId == product.id) {
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
// for (const order of orders){
// console.log(generateOrderSummary(order));
// }
// orders.forEach(order => {
//     console.log(generateOrderSummary(order));
    
// });
function getAllOrderTotals(){
    const orderTotal=orders.map(order =>{
        const subtotal= calculateSubtotal(order);
        return calculateTotal(subtotal);
    });
    return orderTotal;
}
console.log(getAllOrderTotals());

function calculateTotalRevenue(){
    const orderTotal=getAllOrderTotals();
    return orderTotal.reduce((sum,x)=>sum+x,0);
}
console.log(calculateTotalRevenue());

function calculateAverageOrderValue(){
    const total= calculateTotalRevenue();
    const orderTotal=getAllOrderTotals();
    const average=total/orderTotal.length;
    return average;
}
console.log(calculateAverageOrderValue());

function getHighestValueOrder(){
   const highestOrder=orders.reduce((highest, order)=>
{
    const highestTotal= calculateTotal(calculateSubtotal(highest));
    const orderTotal=calculateTotal(calculateSubtotal(order));
    if(orderTotal>highestTotal){
        return order;
    }
    else {
        return highest;
    }
});
return highestOrder;
    
}
console.log(getHighestValueOrder());
function hashighValueOrder(){
   const highValueOrders = orders.filter(order => {
    const total = calculateTotal(calculateSubtotal(order));
    return total > calculateAverageOrderValue();
    });
    const orderId=highValueOrders.map(order=>order.id);
    return orderId;
}
console.log(hashighValueOrder());

function areAllOrdersValid(){
    const validity=orders.every(order =>{

    const validcustomer= customers.find(custs=>custs.id==order.customerId);
    if(validcustomer==null){
        return false;
    }
    const productValid=order.items.every(item=>products.find(p=>p.id==item.productId)
    );
    if(productValid==false){
        return false;
    }
    const quantityValid=order.items.every(item=>
        item.quantity>0
    );
    if(quantityValid==false){
        return false;
    }
    return true;
});
return validity;

}
function updateOrder(order,updates){
    const newOrder={...order,
        ...updates
    };
   return newOrder;
}
const updated = updateOrder(orders[0], {
    status: "failed",
    paymentStatus:'failed',
    tries:'2'
});

console.log(updated);