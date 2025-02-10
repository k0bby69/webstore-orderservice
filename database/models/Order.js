const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
    amount: Number,
    dateTime: { type: Date, default: Date.now },
    customerId: String,
    products: [
      {
        id: String,
        title: String,
        quantity: Number,
        price: Number,
      },
    ],
  },
  {
      toJSON: {
          transform(doc, ret){
              delete ret.__v;
          }
      },
      timestamps: true
  });

module.exports =  mongoose.model('order', OrderSchema);
