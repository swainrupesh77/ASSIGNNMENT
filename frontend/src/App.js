import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const SLICES = {
  'bread': { name: 'Bread', price: 0, color: '#F5DEB3' },
  'aloo tikki': { name: 'Aloo Tikki', price: 20, color: '#D2691E' },
  'paneer': { name: 'Paneer', price: 25, color: '#F0E68C' },
  'cheese': { name: 'Cheese', price: 15, color: '#FFD700' },
  'tomato': { name: 'Tomato', price: 10, color: '#FF6347' }
};

const PLATFORM_FEE = 10;
const API_URL = 'https://burger-backend-aj4g.onrender.com';

function App() {
  const [slices, setSlices] = useState(['bread', 'bread']);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [savedOrders, setSavedOrders] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    address: '',
    paymentMethod: 'cash'
  });

  const calculatePrice = () => {
    let sum = 0;
    let hasCheese = false;
    let hasPaneer = false;
    let alooCount = 0;
    
    for (let slice of slices) {
      if (slice === 'cheese') hasCheese = true;
      if (slice === 'paneer') hasPaneer = true;
      if (slice === 'aloo tikki') {
        alooCount++;
        if (alooCount === 2) {
          sum += 2;
          alooCount = 0;
        } else {
          sum += SLICES[slice].price;
        }
      } else {
        alooCount = 0;
        sum += SLICES[slice].price;
      }
    }
    
    if (hasCheese && hasPaneer) sum -= 3;
    return (sum * quantity) + PLATFORM_FEE;
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`);
      const data = await response.json();
      setSavedOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showOrderDetails = (order) => {
    const burgerStack = order.burgerConfig?.slices.map(slice => 
      `<div style="background: ${SLICES[slice.type]?.color || '#ccc'}; padding: 5px; margin: 3px 0; border-radius: 5px;">
        ${slice.name}
       </div>`
    ).join('');

    Swal.fire({
      title: `📋 Order #${order.id || order._id.slice(-6)}`,
      html: `
        <div style="text-align: left; max-height: 500px; overflow-y: auto;">
          <div style="background: #f0f0f0; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0;">👤 Customer Details</h3>
            <p><strong>Name:</strong> ${order.customerName}</p>
            <p><strong>Mobile:</strong> ${order.mobileNumber}</p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod}</p>
          </div>
          
          <div style="background: #fff3e0; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0;">🍔 Burger Details</h3>
            <p><strong>Quantity:</strong> ${order.burgerConfig?.quantity}</p>
            <p><strong>Total Slices:</strong> ${order.burgerConfig?.slices?.length}</p>
            <p><strong>Burger Stack:</strong></p>
            <div style="margin-left: 20px;">
              ${burgerStack}
            </div>
          </div>
          
          <div style="background: #e8f5e9; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0;">💰 Price Breakdown</h3>
            <p><strong>Subtotal:</strong> ₹${(order.burgerConfig?.totalPrice - PLATFORM_FEE)}</p>
            <p><strong>Platform Fee:</strong> ₹${PLATFORM_FEE}</p>
            <p style="font-size: 18px; font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px;">
              <strong>Total Amount:</strong> ₹${order.burgerConfig?.totalPrice}
            </p>
          </div>
          
          <div style="background: #e3f2fd; padding: 10px; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0;">📅 Order Information</h3>
            <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
            <p><strong>Order ID:</strong> ${order._id}</p>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#4CAF50',
      confirmButtonText: 'Close',
      width: '600px',
      backdrop: true
    });
  };

  const addSlice = (type) => {
    if (slices.length >= 10) {
      Swal.fire({
        title: 'Maximum Slices Reached!',
        text: 'You cannot add more than 10 slices per burger.',
        icon: 'warning',
        confirmButtonColor: '#ff9800',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (type === 'bread') {
      Swal.fire({
        title: 'Cannot Add Bread!',
        text: 'Bread can only be at the top and bottom of the burger.',
        icon: 'info',
        confirmButtonColor: '#2196F3',
        confirmButtonText: 'Got it'
      });
      return;
    }
    const newSlices = [...slices];
    newSlices.splice(newSlices.length - 1, 0, type);
    setSlices(newSlices);
    
    Swal.fire({
      title: 'Added!',
      text: `${SLICES[type].name} added to your burger`,
      icon: 'success',
      timer: 1000,
      showConfirmButton: false,
      position: 'top-end',
      toast: true
    });
  };

  const removeSlice = (index) => {
    if (index === 0 || index === slices.length - 1) {
      Swal.fire({
        title: 'Cannot Remove Bread!',
        text: 'The bread layers are essential for your burger.',
        icon: 'info',
        confirmButtonColor: '#2196F3',
        confirmButtonText: 'OK'
      });
      return;
    }
    const removedSlice = slices[index];
    setSlices(slices.filter((_, i) => i !== index));
    
    Swal.fire({
      title: 'Removed!',
      text: `${SLICES[removedSlice].name} removed from your burger`,
      icon: 'info',
      timer: 1000,
      showConfirmButton: false,
      position: 'top-end',
      toast: true
    });
  };

  const placeOrder = async () => {
    if (!formData.customerName.trim()) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please enter your name',
        icon: 'error',
        confirmButtonColor: '#f44336',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (!formData.mobileNumber.match(/^[0-9]{10}$/)) {
      Swal.fire({
        title: 'Invalid Mobile Number',
        text: 'Please enter a valid 10-digit mobile number',
        icon: 'error',
        confirmButtonColor: '#f44336',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (!formData.address.trim()) {
      Swal.fire({
        title: 'Missing Address',
        text: 'Please enter your delivery address',
        icon: 'error',
        confirmButtonColor: '#f44336',
        confirmButtonText: 'OK'
      });
      return;
    }

    const totalPrice = calculatePrice();
    
    const orderData = {
      customerName: formData.customerName,
      mobileNumber: formData.mobileNumber,
      address: formData.address,
      paymentMethod: formData.paymentMethod,
      burgerConfig: {
        slices: slices.map(slice => ({
          type: slice,
          name: SLICES[slice].name,
          price: SLICES[slice].price
        })),
        quantity: quantity,
        totalPrice: totalPrice
      }
    };

    Swal.fire({
      title: 'Placing Your Order...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Swal.fire({
          title: '🎉 Order Placed Successfully!',
          html: `
            <div style="text-align: left;">
              <p><strong>Customer:</strong> ${formData.customerName}</p>
              <p><strong>Total Amount:</strong> ₹${totalPrice}</p>
              <p><strong>Payment Method:</strong> ${formData.paymentMethod}</p>
              <p><strong>Delivery Address:</strong> ${formData.address}</p>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#4CAF50',
          confirmButtonText: 'Great!',
          timer: 5000
        });
        
        setSlices(['bread', 'bread']);
        setQuantity(1);
        setShowCheckout(false);
        setFormData({
          customerName: '',
          mobileNumber: '',
          address: '',
          paymentMethod: 'cash'
        });
        
        fetchOrders();
      } else {
        throw new Error(result.error || 'Failed to place order');
      }
    } catch (error) {
      Swal.fire({
        title: '❌ Order Failed',
        text: error.message || 'Could not connect to backend. Make sure backend is running on port 5000',
        icon: 'error',
        confirmButtonColor: '#f44336',
        confirmButtonText: 'Try Again'
      });
    }
  };

  const totalPrice = calculatePrice();
  const hasMoreThanSixSlices = slices.length - 2 > 6;

  useEffect(() => {
    if (hasMoreThanSixSlices) {
      Swal.fire({
        title: 'Chef Suggestion!',
        text: 'Your burger has more than 6 slices. Consider splitting it into two burgers for better taste!',
        icon: 'info',
        confirmButtonColor: '#ff9800',
        confirmButtonText: 'Thanks for the tip!',
        timer: 4000,
        position: 'top',
        toast: true,
        showConfirmButton: false
      });
    }
  }, [hasMoreThanSixSlices]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🍔 Burger Builder</h1>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
          <h2>Your Burger</h2>
          <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', minHeight: '300px' }}>
            {slices.map((slice, i) => (
              <div 
                key={i} 
                onClick={() => removeSlice(i)}
                style={{
                  background: SLICES[slice].color,
                  padding: '12px',
                  margin: '5px 0',
                  borderRadius: '5px',
                  cursor: i !== 0 && i !== slices.length-1 ? 'pointer' : 'default',
                  textAlign: 'center',
                  fontWeight: i === 0 || i === slices.length-1 ? 'bold' : 'normal'
                }}
              >
                {SLICES[slice].name}
                {i !== 0 && i !== slices.length-1 && <span style={{ marginLeft: '10px' }}>❌</span>}
              </div>
            ))}
          </div>
          
          {hasMoreThanSixSlices && (
            <div style={{ background: '#ff9800', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px', textAlign: 'center' }}>
              ⚠️ Chef suggests splitting this burger into two burgers!
            </div>
          )}
          
          <div style={{ marginTop: '20px' }}>
            <h3>Add Slices:</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {Object.keys(SLICES).filter(s => s !== 'bread').map(slice => (
                <button 
                  key={slice} 
                  onClick={() => addSlice(slice)}
                  style={{
                    padding: '10px 15px',
                    background: SLICES[slice].color,
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {SLICES[slice].name} - ₹{SLICES[slice].price}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label>Quantity: </label>
            <button onClick={() => setQuantity(Math.max(1, quantity-1))}>-</button>
            <span style={{ margin: '0 10px', fontSize: '20px' }}>{quantity}</span>
            <button onClick={() => setQuantity(Math.min(10, quantity+1))}>+</button>
          </div>
          
          <div style={{ marginTop: '20px', padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Total: ₹{totalPrice}</div>
            <div style={{ fontSize: '12px' }}>(Includes ₹{PLATFORM_FEE} platform fee)</div>
          </div>
          
          <button 
            onClick={() => setShowCheckout(true)}
            style={{
              marginTop: '20px',
              padding: '15px',
              width: '100%',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '18px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Proceed to Checkout
          </button>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '20px' }}>
            <h3>🛒 Cart Summary</h3>
            <p><strong>Burger:</strong> {slices.map(s => SLICES[s].name).join(' → ')}</p>
            <p><strong>Quantity:</strong> {quantity}</p>
            <p><strong>Total:</strong> ₹{totalPrice}</p>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #ddd' }}>
            <h3>📋 Saved Orders ({savedOrders.length})</h3>
            {savedOrders.length === 0 ? (
              <p>No orders yet. Place your first order!</p>
            ) : (
              savedOrders.map(order => (
                <div 
                  key={order._id} 
                  onClick={() => showOrderDetails(order)}
                  style={{ 
                    borderBottom: '1px solid #eee', 
                    padding: '10px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    borderRadius: '5px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{order.customerName}</strong> - ₹{order.burgerConfig?.totalPrice}
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {new Date(order.orderDate).toLocaleString()}
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: '#4CAF50' }}>Click to view →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {showCheckout && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '10px', width: '400px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2>Checkout</h2>
            <input 
              type="text" 
              placeholder="Customer Name" 
              style={{ width: '100%', padding: '8px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '4px' }}
              value={formData.customerName}
              onChange={e => setFormData({...formData, customerName: e.target.value})} 
            />
            <input 
              type="tel" 
              placeholder="Mobile Number (10 digits)" 
              style={{ width: '100%', padding: '8px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '4px' }}
              value={formData.mobileNumber}
              onChange={e => setFormData({...formData, mobileNumber: e.target.value})} 
            />
            <textarea 
              placeholder="Address" 
              style={{ width: '100%', padding: '8px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '4px' }}
              rows="3"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})} 
            />
            <select 
              style={{ width: '100%', padding: '8px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '4px' }}
              value={formData.paymentMethod}
              onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
            >
              <option value="cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="COD">COD</option>
              <option value="Net Banking">Net Banking</option>
            </select>
            
            <div style={{ margin: '20px 0', padding: '10px', background: '#f0f0f0', borderRadius: '5px', textAlign: 'center' }}>
              <strong>Total Amount: ₹{totalPrice}</strong>
            </div>
            
            <button 
              onClick={placeOrder} 
              style={{ width: '100%', padding: '12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginBottom: '10px' }}
            >
              Place Order
            </button>
            <button 
              onClick={() => setShowCheckout(false)} 
              style={{ width: '100%', padding: '12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;