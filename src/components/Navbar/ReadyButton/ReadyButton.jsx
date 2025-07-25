// src/components/Navbar/ReadyButton/ReadyButton.jsx
import React, { useState, useContext } from 'react';
import { Button, useTheme, useMediaQuery } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { motion } from 'framer-motion';
import { SocketContext } from '../../../App';

const ReadyButton = ({ isReady }) => {
  const theme = useTheme();
  const socket = useContext(SocketContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [checked, setChecked] = useState(isReady);

  const handleClick = () => {
    socket.emit('player:ready');
    setChecked(!checked);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={checked ? 'contained' : 'outlined'}
        onClick={handleClick}
        size={isMobile ? 'small' : 'medium'}
        startIcon={
          checked ? (
            <CheckCircleIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
          )
        }
        sx={{
          minWidth: { xs: 180, sm: 180, md: 180 },
          background: checked
            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
            : 'transparent',
          borderColor: checked ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
          color: 'white',
          '&:hover': {
            background: checked
              ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
              : 'rgba(255, 255, 255, 0.1)',
            borderColor: checked ? 'transparent' : 'rgba(255, 255, 255, 0.5)',
          },
          transition: 'all 0.3s ease',
          fontWeight: 600,
          py: { xs: 0.5, sm: 1 },
          px: { xs: 1.5, sm: 2, md: 3 },
          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
        }}
      >
        {checked ? (isMobile ? 'Ready' : 'Ready!') : (isMobile ? 'Ready?' : 'Not Ready')}
      </Button>
    </motion.div>
  );
};

export default ReadyButton;