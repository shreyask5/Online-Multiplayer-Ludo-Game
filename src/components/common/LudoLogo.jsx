// src/components/common/LudoLogo.jsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import CasinoIcon from '@mui/icons-material/Casino';

const LudoLogo = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <CasinoIcon 
          sx={{ 
            fontSize: { xs: 48, md: 64 },
            color: theme.palette.primary.main,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          }} 
        />
      </motion.div>
      <Box>
        <Typography 
          variant="h1" 
          sx={{ 
            fontWeight: 800,
            fontSize: { xs: '2rem', md: '3rem' },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}
        >
          Ludo Online
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'rgba(255,255,255,0.7)',
            fontSize: { xs: '0.875rem', md: '1rem' },
            mt: -0.5,
          }}
        >
          Play with friends in real-time
        </Typography>
      </Box>
    </Box>
  );
};

export default LudoLogo;