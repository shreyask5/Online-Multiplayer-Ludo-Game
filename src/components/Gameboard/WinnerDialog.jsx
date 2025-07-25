// src/components/Gameboard/WinnerDialog.jsx
import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const WinnerDialog = ({ winner, onPlayAgain }) => {
  const theme = useTheme();

  React.useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = [theme.palette.game[winner], '#FFD700', '#FFA500'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [winner, theme]);

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
      transition={{ type: 'spring', duration: 0.6 }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: { xs: '90vw', sm: 400 },
          maxWidth: 400,
          textAlign: 'center',
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '2px solid',
          borderColor: theme.palette.game[winner],
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow effect */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            left: -50,
            right: -50,
            bottom: -50,
            background: `radial-gradient(circle, ${theme.palette.game[winner]}40 0%, transparent 70%)`,
            filter: 'blur(40px)',
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
              '50%': { opacity: 0.8, transform: 'scale(1.1)' },
            },
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            animate={{
              y: [-10, 10, -10],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <EmojiEventsIcon
              sx={{
                fontSize: 80,
                color: '#FFD700',
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              }}
            />
          </motion.div>

          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
            Victory!
          </Typography>

          <Box
            sx={{
              display: 'inline-block',
              px: 3,
              py: 1,
              borderRadius: 2,
              backgroundColor: theme.palette.game[winner],
              mb: 3,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {winner} wins!
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Congratulations on your victory! You've conquered the board and emerged victorious.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onPlayAgain}
            startIcon={<RestartAltIcon />}
            sx={{
              py: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.game[winner]} 0%, ${theme.palette.game[winner]}CC 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.game[winner]}CC 0%, ${theme.palette.game[winner]}99 100%)`,
              },
            }}
          >
            Play Again
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default WinnerDialog;