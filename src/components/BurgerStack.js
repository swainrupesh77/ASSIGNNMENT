import React from 'react';

const BurgerStack = ({ slices, slicesData, onRemoveSlice, onReorderSlices }) => {
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, toIndex) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (!isNaN(fromIndex) && fromIndex !== toIndex) {
      onReorderSlices(fromIndex, toIndex);
    }
  };

  return (
    <div className="burger-stack">
      <h3>Your Burger</h3>
      {slices.map((slice, index) => (
        <div
          key={index}
          className={`burger-slice ${slice === 'bread' ? 'bread-top' : ''}`}
          style={{
            backgroundColor: slicesData[slice]?.color || '#ccc',
            cursor: index !== 0 && index !== slices.length - 1 ? 'pointer' : 'default'
          }}
          draggable={index !== 0 && index !== slices.length - 1}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          onClick={() => {
            if (index !== 0 && index !== slices.length - 1) {
              if (window.confirm('Remove this slice?')) {
                onRemoveSlice(index);
              }
            }
          }}
        >
          <span>{slicesData[slice]?.name || slice}</span>
          {index !== 0 && index !== slices.length - 1 && (
            <span style={{ fontSize: '12px', color: '#666' }}>
              (Click to remove, drag to reorder)
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default BurgerStack;
