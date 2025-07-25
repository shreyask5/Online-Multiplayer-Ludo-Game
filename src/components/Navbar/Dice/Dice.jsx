// src/components/Navbar/Dice/Dice.jsx
import React, { useContext, useState } from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketContext } from '../../../App';
import CasinoIcon from '@mui/icons-material/Casino';

const DiceFace = ({ value, color, size = 60 }) => {
  const theme = useTheme();
  const dotSize = size / 5;
  const dotPositions = {
    1: [[50, 50]],
    2: [[30, 30], [70, 70]],
    3: [[30, 30], [50, 50], [70, 70]],
    4: [[30, 30], [70, 30], [30, 70], [70, 70]],
    5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
    6: [[30, 30], [70, 30], [30, 50], [70, 50], [30, 70], [70, 70]],
  };

  const positions = dotPositions[value] || [];

  return (
    <Box
      sx={{
        width: size,
        height: size,
        background: 'white',
        borderRadius: 2,
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        border: `3px solid ${theme.palette.game[color]}`,
      }}
    >
      {positions.map((pos, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: theme.palette.game[color],
            left: `${pos[0]}%`,
            top: `${pos[1]}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </Box>
  );
};

const Dice = ({ rolledNumber, nowMoving, playerColor, movingPlayer }) => {
  const theme = useTheme();
  const socket = useContext(SocketContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isRolling, setIsRolling] = useState(false);
  
  const diceSize = isMobile ? 48 : 60;

  const handleClick = () => {
    if (!isRolling && nowMoving) {
      setIsRolling(true);
      socket.emit('game:roll');
      
      // Reset rolling state after animation
      setTimeout(() => {
        setIsRolling(false);
      }, 1000);
    }
  };

  const isCurrentPlayer = movingPlayer === playerColor;
  const hasRolledNumber = rolledNumber !== null && rolledNumber !== undefined;

  if (!isCurrentPlayer) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <AnimatePresence mode="wait">
        {hasRolledNumber ? (
          <motion.div
            key="result"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <DiceFace value={rolledNumber} color={playerColor} size={diceSize} />
          </motion.div>
        ) : nowMoving ? (
          <motion.div
            key="roll"
            animate={isRolling ? {
              rotate: [0, 360, 720, 1080],
              scale: [1, 0.8, 0.8, 1],
            } : {}}
            transition={{ duration: 1 }}
          >
            <IconButton
              onClick={handleClick}
              disabled={isRolling}
              sx={{
                width: diceSize,
                height: diceSize,
                background: `linear-gradient(135deg, ${theme.palette.game[playerColor]} 0%, ${theme.palette.game[playerColor]}CC 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.game[playerColor]}CC 0%, ${theme.palette.game[playerColor]} 100%)`,
                  transform: 'scale(1.1)',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <CasinoIcon 
                sx={{ 
                  fontSize: diceSize * 0.6, 
                  color: 'white',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                }} 
              />
            </IconButton>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Roll hint animation */}
      {nowMoving && !hasRolledNumber && !isRolling && (
        <motion.div
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: theme.palette.warning.main,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      )}
    </Box>
  );
};

export default Dice;