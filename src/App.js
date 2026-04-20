import React, { useState, useEffect } from 'react';
import './App.css';
import BurgerStack from './components/BurgerStack';
import SliceControls from './components/SliceControls';
import CheckoutForm from './components/CheckoutForm';
import Cart from './components/Cart';
import axios from 'axios';

const SLICES = {
  'bread': { name: 'Bread', price: 0, color: '#F5DEB3' },
  'aloo tikki': { name: 'Aloo Tikki', price: 20, color: '#D2691E' },
  'paneer': { name: 'Paneer', price: 25, color: '#F0E68C' },
  'cheese': { name: 'Cheese', price: 15, color: '#FFD700' },
  'tomato': { name: 'Tomato', price: 10, color: '#FF6347' }
};

const PLATFORM_FEE = 10;

function App() {
  const [slices, setSlices] = useState(['bread', 'bread']);
  const [quantity, setQuantity] = useState(1);
  const [orders, setOrders] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const calculatePrice = (currentSlices, currentQuantity) => {
    let sliceSum = 0;
    let hasCheese = false;
    let hasPaneer = false;
    let consecutiveAlooCount = 0;

    for (let i = 0; i < currentSlices.length; i++) {
      const slice = currentSlices[i];
      if (slice === 'cheese') hasCheese = true;
      if (slice === 'paneer') hasPaneer = true;
      
      if (slice === 'aloo tikki') {
        consecutiveAlooCount++;
        if (consecutiveAlooCount === 2) {
          sliceSum += 2; // Extra charge
          consecutiveAlooCount = 0;
        } else {
          sliceSum += SLICES[slice].price;
        }
      } else {
        consecutiveAlooCount = 0;
        sliceSum += SLICES[slice].price;
      }
    }

    // Cheese and Paneer discount
    if (hasCheese && hasPaneer) {
      sliceSum -= 3;
    }

    const total = (sliceSum * currentQuantity) + PLATFORM_FEE;
    return total;
  };

  const [totalPrice, setTotalPrice] = useState(calculatePrice(slices, quantity));

  useEffect(() => {
    setTotalPrice(calculatePrice(slices, quantity));
  }, [slices, quantity]);

  const addSlice = (sliceType) => {
    if (slices.length >= 10) {
      alert('Maximum 10 slices per burger!');
      return;
    }
    
    if (sliceType === 'bread') {
      alert('Bread can only be at the top and bottom!');
      return;
    }

    const newSlices = [...slices];
    newSlices.splice(newSlices.length - 1, 0, sliceType);
    setSlices(newSlices);
  };

  const removeSlice = (index) => {
    if (index === 0 || index === slices.length - 1) {
      alert('Cannot remove bread layers!');
      return;
    }
    const newSlices = slices.filter((_, i) => i !== index);
    setSlices(newSlices);
  };

  const reorderSlices = (fromIndex, toIndex) => {
    if (fromIndex === 0 || toIndex === 0 || 
        fromIndex === slices.length - 1 || toIndex === slices.length - 1) {
      alert('Cannot move bread layers!');
      return;
    }
    
    const newSlices = [...slices];
    const [removed] = newSlices.splice(fromIndex, 1);
    newSlices.splice(toIndex, 0, removed);
    setSlices(newSlices);
  };

  const handleCheckout = async (orderData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/orders', {
        ...orderData,
        burgerConfig: {
          slices: slices.map(slice => ({
            type: slice,
            name: SLICES[slice].name,
            price: SLICES[slice].price
          })),
          quantity: quantity,
          totalPrice: totalPrice
        }
      });
      
      if (response.data.success) {
        alert('Order placed successfully!');
        setSlices(['bread', 'bread']);
        setQuantity(1);
        setShowCheckout(false);
        fetchOrders();
      }
    } catch (error) {
      alert('Error placing order: ' + error.response?.data?.error || error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const hasMoreThanSixSlices = slices.length - 2 > 6;

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍔 Burger Builder</h1>
      </header>
      
      <div className="main-container">
        <div className="builder-section">
          <BurgerStack 
            slices={slices} 
            slicesData={SLICES}
            onRemoveSlice={removeSlice}
            onReorderSlices={reorderSlices}
          />
          
          {hasMoreThanSixSlices && (
            <div className="warning-message">
              ⚠️ Chef suggests splitting this burger into two burgers!
            </div>
          )}
          
          <SliceControls 
            slices={SLICES}
            onAddSlice={addSlice}
          />
          
          <div className="quantity-control">
            <label>Quantity: </label>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(Math.min(10, quantity + 1))}>+</button>
          </div>
          
          <div className="price-display">
            <h3>Total Price: ₹{totalPrice}</h3>
            <small>(Includes ₹{PLATFORM_FEE} platform fee)</small>
          </div>
          
          <button 
            className="checkout-btn"
            onClick={() => setShowCheckout(true)}
          >
            Proceed to Checkout
          </button>
        </div>
        
        <Cart 
          slices={slices}
          slicesData={SLICES}
          quantity={quantity}
          totalPrice={totalPrice}
        />
      </div>
      
      {showCheckout && (
        <CheckoutForm 
          onSubmit={handleCheckout}
          onClose={() => setShowCheckout(false)}
          totalPrice={totalPrice}
        />
      )}
    </div>
  );
}

export default App;
