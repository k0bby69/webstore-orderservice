const Order = require('../models/Order');

const Cart = require('../models/Cart');
const { v4: uuidv4 } = require('uuid');

class ShoppingRepository {

    async Orders(customerId){

        const orders = await Order.find({customerId });
        
        return orders;

    }

    async Cart(customerId){

        const cartItems = await Cart.find({ customerId});

        if(cartItems){
            return cartItems;
        }

        return []
    }

    async AddCartItem(customerId,item,amount,isRemove){
 

            const cart = await Cart.findOne({ customerId: customerId })

            const { _id } = item;

            if(cart){
                
                let isExist = false;

                let cartItems = cart.items;

                if(cartItems.length > 0){

                    cartItems.map(item => {
                                                
                        if(item.product._id.toString() === _id.toString()){
                            if(isRemove){
                                cartItems.splice(cartItems.indexOf(item), 1);
                             }else{
                               item.amount = amount;
                            }
                             isExist = true;
                        }
                    });
                } 
                
                if(!isExist && !isRemove){
                    cartItems.push({product: { ...item}, amount });
                }

                cart.items = cartItems;
                console.log('IN MANAGE CART FUNCTION',cart.items)

                return await cart.save()
 
            }else{

               return await Cart.create({
                    customerId,
                    items:[{product: { ...item}, stock: amount }]
                })
            }

        
    }
 
    async CreateNewOrder(orderData) {
        const order = new Order(orderData);
        return await order.save();
}
}

module.exports = ShoppingRepository;
