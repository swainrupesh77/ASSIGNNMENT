import React from 'react';

const SliceControls = ({ slices, onAddSlice }) => {
  const sliceButtons = Object.keys(slices).filter(slice => slice !== 'bread');

  return (
    <div className="slice-controls">
      {sliceButtons.map(sliceType => (
        <button
          key={sliceType}
          className="slice-btn"
          style={{
            backgroundColor: slices[sliceType].color,
            color: sliceType === 'paneer' ? '#333' : 'white'
          }}
          onClick={() => onAddSlice(sliceType)}
        >
          {slices[sliceType].name} - ₹{slices[sliceType].price}
        </button>
      ))}
    </div>
  );
};

export default SliceControls;
