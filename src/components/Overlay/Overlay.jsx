// src/components/Overlay/Overlay.jsx
import React from 'react';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import useKeyPress from '../../hooks/useKeyPress';

const Overlay = ({ children, handleOverlayClose }) => {
  const theme = useTheme();
  
  useKeyPress('Escape', handleOverlayClose);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && handleOverlayClose) {
      handleOverlayClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: theme.zIndex.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        onClick={handleBackdropClick}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          cursor: 'pointer',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </motion.div>
  );
};

export default Overlay;