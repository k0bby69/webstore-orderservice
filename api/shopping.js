const ShoppingService = require("../services/shopping-service");
const { SubscribeMessage } = require("../utils");
const  auth = require('./middleware/auth');
const { PublishMessage } = require('../utils')

shoppingRoutes = (app, channel) => {
    
    const service = new ShoppingService();

    SubscribeMessage(channel, service)

    app.post('/order', async (req,res,next) => {

        try {
            console.log(req.body);
            const order = await service.PlaceOrder(req.body);
            res.status(201).json(order);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }

    });

    app.get('/orders/:customerId', async (req,res,next) => {

        // const { _id } = req.user;

        const { data } = await service.GetOrders(req.params.customerId);
        
        res.status(200).json(data);

    });

    app.put('/cart',auth, async (req,res,next) => {

        const { _id } = req.user;
        const {item,amount,isRemove=false}=req.body

        const { data } = await service.ManageCart(_id,item,amount,isRemove);
        
        res.status(200).json(data);

    });
    app.get('/cart', auth, async (req,res,next) => {

        const { _id } = req.user;
        
        const { data } = await service.GetCart({ _id });

        return res.status(200).json(data);
    });

}
module.exports=shoppingRoutes
