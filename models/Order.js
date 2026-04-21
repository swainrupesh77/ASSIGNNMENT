const mongoose = require('mongoose');

const sliceSchema = new mongoose.Schema({
  type: String,
  name: String,
  price: Number
});

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['UPI', 'cash', 'COD', 'Net Banking']
  },
  burgerConfig: {
    slices: [sliceSchema],
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    totalPrice: Number
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
