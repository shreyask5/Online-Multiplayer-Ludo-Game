// src/components/Navbar/PlayerCard/PlayerCard.jsx
import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Avatar,
  useTheme,
  Chip,
  useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import Dice from '../Dice/Dice';
import ReadyButton from '../ReadyButton/ReadyButton';

// Inline TimerOverlay component
const TimerOverlay = ({ time, color }) => {
  const theme = useTheme();
  const animationDelay = React.useMemo(() => {
    const delay = 15 - Math.ceil((time - Date.now()) / 1000);
    return delay > 15 ? 0 : delay < 0 ? 0 : delay;
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

const PlayerCard = ({
  player,
  playerColor,
  started,
  time,
  isReady,
  rolledNumber,
  nowMoving,
  movingPlayer,
  ended,
  isCurrentPlayer,
  playerIndex,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isPlayerActive = player._id && player.ready;
  const isMoving = player.nowMoving;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: playerIndex * 0.1 }}
      style={{ width: '100%', height: '100%' }} // Added height: '100%' for equal height cards
    >
      <Paper
        elevation={isMoving ? 8 : 2}
        sx={{
          p: { xs: 1, sm: 1.5, md: 2 },
          background: isPlayerActive
            ? `linear-gradient(135deg, ${theme.palette.game[playerColor]}20 0%, ${theme.palette.game[playerColor]}10 100%)`
            : 'rgba(30, 41, 59, 0.6)',
          border: '2px solid',
          borderColor: isMoving
            ? theme.palette.game[playerColor]
            : isPlayerActive
            ? `${theme.palette.game[playerColor]}40`
            : 'rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          transform: isMoving ? 'scale(1.02)' : 'scale(1)',
          '&:hover': {
            transform: isPlayerActive ? 'scale(1.01)' : 'scale(1)',
          },
          minHeight: { xs: 135, sm: 70, md: 70 }, // Ensures all cards have the same min height
          height: { xs: 135, sm: 70, md: 70 },    // Ensures all cards have the same height
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Timer Overlay */}
        {isMoving && <TimerOverlay time={time} color={playerColor} />}

        {/* Glow effect for moving player */}
        {isMoving && (
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              left: -50,
              right: -50,
              bottom: -50,
              background: `radial-gradient(circle, ${theme.palette.game[playerColor]}30 0%, transparent 70%)`,
              filter: 'blur(30px)',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.3 },
                '50%': { opacity: 0.6 },
              },
            }}
          />
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: { xs: 0.25, sm: 0.5 },
            position: 'relative',
            zIndex: 1,
            width: '100%',
            minWidth: 0,
            height: '100%',
          }}
        >
          {/* Avatar */}
          <Avatar
            sx={{
              width: { xs: 32, sm: 40, md: 56 },
              height: { xs: 32, sm: 40, md: 56 },
              bgcolor: isPlayerActive ? theme.palette.game[playerColor] : 'rgba(255, 255, 255, 0.1)',
              border: '2px solid',
              borderColor: isPlayerActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              alignSelf: 'center',
              flexShrink: 0,
              mb: { xs: 0.5, sm: 0 },
            }}
          >
            {player._id ? (
              <Typography variant={isMobile ? 'body2' : 'h6'} sx={{ fontWeight: 700 }}>
                {player.name?.charAt(0).toUpperCase()}
              </Typography>
            ) : (
              <PersonIcon sx={{ fontSize: { xs: 16, sm: 20, md: 28 } }} />
            )}
          </Avatar>

          {/* Player Info */}
          <Box sx={{ flex: 1, minWidth: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center', ml: { xs: 0, sm: 1 }, mb: { xs: 0.5, sm: 0 }, flexShrink: 1 }}>
            <Typography
              variant={isMobile ? 'body2' : 'body1'}
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                // allow wrapping
                color: isPlayerActive ? 'text.primary' : 'text.secondary',
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                lineHeight: 1.2,
              }}
            >
              {player.name || 'Waiting...'}
            </Typography>
            {isPlayerActive && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 0.25, 
                  flexWrap: 'wrap', 
                  alignItems: 'center', 
                  mt: 0.25,
                  justifyContent: { xs: 'center', sm: 'flex-start' }, // Center on mobile, left on desktop
                  width: '100%', // Ensures centering works
                }}
              >
                <Chip
                  label={playerColor}
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.game[playerColor],
                    color: 'white',
                    fontWeight: 600,
                    height: { xs: 16, sm: 20 },
                    '& .MuiChip-label': {
                      px: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '0.625rem', sm: '0.75rem' },
                    },
                  }}
                />
                {isMoving && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Chip
                        label={isMobile ? "TURN" : "YOUR TURN"}
                        size="small"
                        color="warning"
                        sx={{
                          fontWeight: 700,
                          height: { xs: 16, sm: 20 },
                          animation: 'blink 1s ease-in-out infinite',
                          '@keyframes blink': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                          },
                          '& .MuiChip-label': {
                            px: { xs: 0.5, sm: 1 },
                            fontSize: { xs: '0.625rem', sm: '0.75rem' },
                          },
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                )}
              </Box>
            )}
          </Box>

          {/* Action Area: Dice/ReadyButton, always right-aligned, never wraps */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
              minWidth: 90,
              maxWidth: 120,
              ml: { xs: 0, sm: 1 },
              flexShrink: 0,
            }}
          >
            {started && !ended && isPlayerActive && (
              <Dice
                rolledNumber={rolledNumber}
                nowMoving={nowMoving}
                playerColor={playerColor}
                movingPlayer={movingPlayer}
              />
            )}
            {isCurrentPlayer && !started && !ended && (
              <ReadyButton isReady={isReady} />
            )}
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default PlayerCard;