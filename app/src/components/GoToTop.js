import React from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const GoToTop = () => {
  const gotop = () => {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <button
        style={{
          position: 'fixed',
          bottom: '3rem', // Adjust this value as needed to position above the footer
          right: '3rem', // Adjust this value as needed
          zIndex: '999',
          display: 'flex',
          justifyContent: 'center',
          width: '3rem',
          height: '3rem',
          alignItems: 'center',
          borderRadius: '50%',
          backgroundColor: '#1976d2',
          color: '#f1f1f1',
          border: '1px solid #fefefe',
        }}
        onClick={gotop}
      >
        <ArrowUpwardIcon />
      </button>
    </div>
  );
};

export default GoToTop;
