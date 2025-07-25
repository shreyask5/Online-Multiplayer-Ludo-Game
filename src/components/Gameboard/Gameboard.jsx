// src/components/Gameboard/Gameboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Grid,
  CircularProgress,
  useTheme,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { PlayerDataContext, SocketContext } from '../../App';
import useSocketData from '../../hooks/useSocketData';
import Map from './Map/Map';
import Navbar from '../Navbar/Navbar';
import Overlay from '../Overlay/Overlay';

// Inline WinnerDialog component
const WinnerDialog = ({ winner, onPlayAgain }) => {
  const theme = useTheme();

  React.useEffect(() => {
    // Simple confetti effect without external library
    const duration = 3000;
    const end = Date.now() + duration;
    let animationId;

    const frame = () => {
      if (Date.now() < end) {
        animationId = requestAnimationFrame(frame);
      }
    };
    
    frame();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [winner]);

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
            <Box
              sx={{
                fontSize: 80,
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              }}
            >
              🏆
            </Box>
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

const LoadingGame = () => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ color: theme.palette.text.secondary }}
      >
        Loading game...
      </motion.div>
    </Box>
  );
};

const Gameboard = () => {
  const theme = useTheme();
  const socket = useContext(SocketContext);
  const context = useContext(PlayerDataContext);
  
  const [pawns, setPawns] = useState([]);
  const [players, setPlayers] = useState([]);
  const [rolledNumber, setRolledNumber] = useSocketData('game:roll');
  const [time, setTime] = useState();
  const [isReady, setIsReady] = useState();
  const [nowMoving, setNowMoving] = useState(false);
  const [started, setStarted] = useState(false);
  const [movingPlayer, setMovingPlayer] = useState('red');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.emit('room:data', context.roomId);
    
    const handleRoomData = (data) => {
      data = JSON.parse(data);
      if (data.players == null) return;
      
      // Fill empty slots
      while (data.players.length !== 4) {
        data.players.push({ name: 'Waiting...', color: null });
      }
      
      // Check moving player
      const nowMovingPlayer = data.players.find(player => player.nowMoving === true);
      if (nowMovingPlayer) {
        if (nowMovingPlayer._id === context.playerId) {
          setNowMoving(true);
        } else {
          setNowMoving(false);
        }
        setMovingPlayer(nowMovingPlayer.color);
      }
      
      const currentPlayer = data.players.find(player => player._id === context.playerId);
      if (currentPlayer) {
        setIsReady(currentPlayer.ready);
      }
      
      setRolledNumber(data.rolledNumber);
      setPlayers(data.players);
      setPawns(data.pawns);
      setTime(data.nextMoveTime);
      setStarted(data.started);
    };

    const handleWinner = (winnerColor) => {
      setWinner(winnerColor);
    };

    const handleRedirect = () => {
      window.location.reload();
    };

    socket.on('room:data', handleRoomData);
    socket.on('game:winner', handleWinner);
    socket.on('redirect', handleRedirect);

    return () => {
      socket.off('room:data', handleRoomData);
      socket.off('game:winner', handleWinner);
      socket.off('redirect', handleRedirect);
    };
  }, [socket, context.playerId, context.roomId, setRolledNumber]);

  if (pawns.length !== 16) {
    return <LoadingGame />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3,
          zIndex: 0,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${Object.values(theme.palette.game)[i]}40 0%, transparent 70%)`,
              width: 300,
              height: 300,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            initial={{
              left: `${25 * i}%`,
              top: `${25 * i}%`,
            }}
          />
        ))}
      </Box>

      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          py: { xs: 2, md: 4 },
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            maxWidth: { xs: '100%', md: 900, lg: 1000 },
            margin: '0 auto',
          }}
        >
          {/* Top Players */}
          <Grid item xs={6} md={6}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Navbar
                player={players[0]}
                playerIndex={0}
                started={started}
                time={time}
                isReady={isReady}
                rolledNumber={rolledNumber}
                nowMoving={nowMoving}
                movingPlayer={movingPlayer}
                ended={winner !== null}
                position="top"
              />
            </motion.div>
          </Grid>
          <Grid item xs={6} md={6}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Navbar
                player={players[3]}
                playerIndex={3}
                started={started}
                time={time}
                isReady={isReady}
                rolledNumber={rolledNumber}
                nowMoving={nowMoving}
                movingPlayer={movingPlayer}
                ended={winner !== null}
                position="top"
              />
            </motion.div>
          </Grid>

          {/* Game Board */}
          <Grid item xs={12}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  my: { xs: 0.5, md: 1 },
                }}
              >
                <Map 
                  pawns={pawns} 
                  nowMoving={nowMoving} 
                  rolledNumber={rolledNumber}
                  started={started}
                />
              </Box>
            </motion.div>
          </Grid>

          {/* Bottom Players */}
          <Grid item xs={6} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Navbar
                player={players[1]}
                playerIndex={1}
                started={started}
                time={time}
                isReady={isReady}
                rolledNumber={rolledNumber}
                nowMoving={nowMoving}
                movingPlayer={movingPlayer}
                ended={winner !== null}
                position="bottom"
              />
            </motion.div>
          </Grid>
          <Grid item xs={6} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Navbar
                player={players[2]}
                playerIndex={2}
                started={started}
                time={time}
                isReady={isReady}
                rolledNumber={rolledNumber}
                nowMoving={nowMoving}
                movingPlayer={movingPlayer}
                ended={winner !== null}
                position="bottom"
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Winner Dialog */}
      <AnimatePresence>
        {winner && (
          <Overlay>
            <WinnerDialog winner={winner} onPlayAgain={() => socket.emit('player:exit')} />
          </Overlay>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Gameboard;