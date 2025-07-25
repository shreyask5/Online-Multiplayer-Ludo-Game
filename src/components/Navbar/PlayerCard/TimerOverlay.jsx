// src/components/Navbar/PlayerCard/TimerOverlay.jsx
import React, { useMemo } from 'react';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const TimerOverlay = ({ time, color }) => {
  const theme = useTheme();
  const animationDelay = useMemo(() => {
    const delay = 15 - Math.ceil((time - Date.now()) / 1000);
    return delay > 15 ? 0 : delay < 0 ? 0 : delay;
  }, [time]);

  const progress = useMemo(() => {
    const remaining = (time - Date.now()) / 1000;
    const percentage = (remaining / 15) * 100;
    return percentage < 0 ? 0 : percentage > 100 ? 100 : percentage;
  }, [time]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{
          duration: 15 - animationDelay,
          ease: 'linear',
        }}
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${theme.palette.game[color]} 0%, ${theme.palette.game[color]}CC 100%)`,
          boxShadow: `0 0 10px ${theme.palette.game[color]}`,
        }}
      />
    </Box>
  );
};

export default TimerOverlay;