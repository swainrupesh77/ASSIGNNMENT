import React, { useState } from 'react';

const CheckoutForm = ({ onSubmit, onClose, totalPrice }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    address: '',
    paymentMethod: 'cash'
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.mobileNumber.match(/^[0-9]{10}$/)) {
      newErrors.mobileNumber = 'Valid 10-digit mobile number is required';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name *</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
            />
            {errors.customerName && <small style={{color: 'red'}}>{errors.customerName}</small>}
          </div>
          
          <div className="form-group">
            <label>Mobile Number *</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="10-digit number"
            />
            {errors.mobileNumber && <small style={{color: 'red'}}>{errors.mobileNumber}</small>}
          </div>
          
          <div className="form-group">
            <label>Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
            {errors.address && <small style={{color: 'red'}}>{errors.address}</small>}
          </div>
          
          <div className="form-group">
            <label>Payment Method *</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="UPI">UPI</option>
              <option value="cash">Cash</option>
              <option value="COD">COD</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>
          
          <div className="form-group">
            <strong>Total Amount: ₹{totalPrice}</strong>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-btn">Place Order</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
