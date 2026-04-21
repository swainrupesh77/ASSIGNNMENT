const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for frontend
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Store orders in memory
let orders = [];
let orderId = 1;

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Backend is working!', 
        status: 'online',
        ordersCount: orders.length 
    });
});

// Get all orders
app.get('/api/orders', (req, res) => {
    console.log('📋 Fetching orders, total:', orders.length);
    res.json(orders);
});

// Create new order
app.post('/api/orders', (req, res) => {
    console.log('📦 Order received:', req.body);
    
    const order = {
        _id: Date.now().toString(),
        id: orderId++,
        ...req.body,
        orderDate: new Date()
    };
    
    orders.push(order);
    console.log('✅ Order saved! Total orders:', orders.length);
    
    res.status(201).json({ 
        success: true, 
        order: order,
        message: 'Order saved successfully!'
    });
});

// Delete all orders (for testing)
app.delete('/api/orders', (req, res) => {
    orders = [];
    orderId = 1;
    res.json({ message: 'All orders deleted', ordersCount: 0 });
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📍 Test URL: http://localhost:${PORT}/api/test`);
    console.log(`📝 Orders will be stored in memory`);
});