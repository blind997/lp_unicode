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
//console.log(getAllOrderTotals());

function calculateTotalRevenue(){
    const orderTotal=getAllOrderTotals();
    return orderTotal.reduce((sum,x)=>sum+x,0);
}
//console.log(calculateTotalRevenue());

function calculateAverageOrderValue(){
    const total= calculateTotalRevenue();
    const orderTotal=getAllOrderTotals();
    const average=total/orderTotal.length;
    return average;
}
//console.log(calculateAverageOrderValue());

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
//console.log(getHighestValueOrder());
function hashighValueOrder(){
   const highValueOrders = orders.filter(order => {
    const total = calculateTotal(calculateSubtotal(order));
    return total > calculateAverageOrderValue();
    });
    const orderId=highValueOrders.map(order=>order.id);
    return orderId;
}
//console.log(hashighValueOrder());

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

//console.log(updated);

function getCustomer(customerId)
{
    const promise= new Promise((resolve,reject)=>{

            setTimeout(()=>{
                    const customer= customers.find(cust=> cust.id==customerId);

                    if(!customer){
                        reject(new Error("not found"));
                        return;
                    }
                    resolve(customer);
            },1000);
    });
    return promise;
}
//with callback
function getCustomerc(customerId,callback){
    setTimeout(()=>{
        const customer= customers.find((cust)=>cust.id==customerId);
        if(!customer){ 
            callback(new Error("Customer not found"),null);
        return;
        }
        callback(null,customer);
    },1000)
}
// getCustomerc(2,(error,customer)=>{
//     if (error) {
//         console.log(error.message);
//         return;
//     }

//     console.log(customer);
// })
// getCustomer(1)
//     .then(customer => {
//         console.log(customer);
//     })
//     .catch(error => {
//         console.log(error.message);
// });
function getProducts(productId){
    const promise= new Promise((resolve, reject)=>{
        setTimeout(()=>{
            const product=products.find((pro)=>pro.id==productId);

            if(!product){
                reject(new Error("product not found"));
            return;
            }
            resolve(product);
        },1500)
    })
    return promise;

}
function getProductsc(productId,callback){
    setTimeout(()=>{
             const product=products.find((pro)=>pro.id==productId);
        if(!product){
                callback(new Error("product not found"),null)
                return;
            }

        callback(null,product)

    },1000)
}
// getProducts(101)
//     .then(product => {
//         console.log(product);
//     })
//     .catch(error => {
//         console.log(error.message);
// });
// getProductsc(101, (error, product) => {
//     if(error){
//         console.log(error.message);
//         return;
//     }

//     console.log(product);
// });
function checkStockc(items, callback) {
    setTimeout(() => {

        for (const item of items) {
            

            const prod = products.find(
                prod => prod.id == item.productId
            );

            if (!prod) {
                callback(new Error("Product not found"), null);
                return;
            }

            if (prod.stock < item.quantity) {
                callback(new Error("Not enough stock"), null);
                return;
            }
        }

        callback(null, true);

    }, 1000);
}
function checkStock(items){
    const promise=new Promise((resolve,reject)=>{
        setTimeout(()=>{
                for(const item of items){
                 
                    const product =products.find((prod)=>prod.id==item.productId)
                    if(!product){
                        reject(new Error("product not found"));
                        return
                    }
                    if(product.stock<item.quantity){
                        reject(new Error("not enough stock"));
                        return
                    }
                }
                resolve(true)

        },1000)
    })
    return promise
}
// const order = orders.find(order => order.id === 1001);

// checkStockc(order.items, (error, result) => {

//     if (error) {
//         console.log("ERROR:", error.message);
//         return;
//     }

//     console.log("SUCCESS:", result);
// });

function processPayment(order){
    const promise = new Promise((resolve,reject)=>
    {
            setTimeout(()=>{

                if(order.paymentStatus==='paid'){
                    resolve(order)
                }
                else{
                    reject(new Error("payment not succesful"))
                }

            },1000)
    });
    return promise;
}
function processPaymentc(order,callback){
    setTimeout(()=>{
        if(order.paymentStatus==='paid'){
            callback(null,order)
            return
        }
        callback(new Error("not succesful"),null)

    },1000)
}
// processPayment(orders[0])
//     .then(order => {
//         console.log("Payment successful:", order);
//     })
//     .catch(error => {
//         console.log("Payment failed:", error.message);
// });
function createordercall(order,callback){
    setTimeout(()=>{


        callback(null,order)
    },1000)
}
const order = orders.find(order => order.id === 1002);

getCustomerc(order.customerId, (error, customer) => {

    if (error) {
        console.log(error.message);
        return;
    }

    console.log("Customer found:", customer);

    let completed = 0;

    for (const item of order.items) {

        getProductsc(item.productId, (error, product) => {

            if (error) {
                console.log(error.message);
                return;
            }

            console.log("Product found:", product);

            completed++;

            if (completed === order.items.length) {

                checkStockc(order.items, (error, stock) => {

                    if (error) {
                        console.log(error.message);
                        return;
                    }

                    console.log("Stock available:", stock);

                    processPaymentc(order, (error, payment) => {

                        if (error) {
                            console.log(error.message);
                            return;
                        }

                        console.log("Payment successful:", payment);

                        createordercall(order, (error, createdOrder) => {

                            if (error) {
                                console.log(error.message);
                                return;
                            }

                            console.log("Order created:", createdOrder);
                        });
                    });
                });
            }
        });
    }
});


function createOrder(order){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(order)
        },1000)
    });
}
