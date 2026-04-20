import React from 'react';

const Cart = ({ slices, slicesData, quantity, totalPrice }) => {
  return (
    <div className="cart">
      <h3>🛒 Cart Summary</h3>
      <div className="cart-items">
        <h4>Burger Configuration:</h4>
        <p>{slices.map(slice => slicesData[slice]?.name || slice).join(' → ')}</p>
        
        <h4>Slice Stack:</h4>
        <ul>
          {slices.map((slice, idx) => (
            <li key={idx}>{slicesData[slice]?.name || slice}</li>
          ))}
        </ul>
        
        <h4>Quantity:</h4>
        <p>{quantity}</p>
        
        <h4>Total Price:</h4>
        <p style={{fontSize: '20px', fontWeight: 'bold', color: '#4CAF50'}}>
          ₹{totalPrice}
        </p>
      </div>
    </div>
  );
};

export default Cart; 
