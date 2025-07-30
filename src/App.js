// src/App.js
import React, { useEffect, useState, createContext } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import theme, { animations } from './theme/theme';
import Gameboard from './components/Gameboard/Gameboard';
import LoginPage from './components/LoginPage/LoginPage';

export const PlayerDataContext = createContext();
export const SocketContext = createContext();

const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      background: theme.palette.background.gradient,
      flexDirection: 'column',
      gap: 3,
    }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CircularProgress size={60} thickness={4} />
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      style={{ color: 'white', fontFamily: theme.typography.fontFamily }}
    >
      Loading Ludo Online...
    </motion.h2>
  </Box>
);

function App() {
  const [playerData, setPlayerData] = useState();
  const [playerSocket, setPlayerSocket] = useState();
  const [redirect, setRedirect] = useState();

  useEffect(() => {
    const backendUrl = `https://shreyask.in/ludo/api`;
    const socket = io(backendUrl, { 
      withCredentials: true,
      transports: ['websocket'],
    });
    
    socket.on('player:data', data => {
      data = JSON.parse(data);
      setPlayerData(data);
      if (data.roomId != null) {
        setRedirect(true);
      }
    });
    
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    
    setPlayerSocket(socket);
    
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SocketContext.Provider value={playerSocket}>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                exact
                path='/'
                element={
                  redirect ? (
                    <Navigate to='/game' replace />
                  ) : playerSocket ? (
                    <motion.div
                      key="login"
                      initial={animations.fadeIn.initial}
                      animate={animations.fadeIn.animate}
                      exit={animations.fadeIn.exit}
                      transition={{ duration: 0.3 }}
                      style={{ width: '100%', height: '100vh' }}
                    >
                      <LoginPage />
                    </motion.div>
                  ) : (
                    <LoadingScreen />
                  )
                }
              />
              <Route
                path='/login'
                element={
                  redirect ? (
                    <Navigate to='/game' replace />
                  ) : playerSocket ? (
                    <motion.div
                      key="login"
                      initial={animations.fadeIn.initial}
                      animate={animations.fadeIn.animate}
                      exit={animations.fadeIn.exit}
                      transition={{ duration: 0.3 }}
                      style={{ width: '100%', height: '100vh' }}
                    >
                      <LoginPage />
                    </motion.div>
                  ) : (
                    <LoadingScreen />
                  )
                }
              />
              <Route
                path='/game'
                element={
                  playerData ? (
                    <PlayerDataContext.Provider value={playerData}>
                      <motion.div
                        key="game"
                        initial={animations.fadeIn.initial}
                        animate={animations.fadeIn.animate}
                        exit={animations.fadeIn.exit}
                        transition={{ duration: 0.3 }}
                        style={{ width: '100%', height: '100vh' }}
                      >
                        <Gameboard />
                      </motion.div>
                    </PlayerDataContext.Provider>
                  ) : (
                    <Navigate to='/login' replace />
                  )
                }
              />
            </Routes>
          </AnimatePresence>
        </Router>
      </SocketContext.Provider>
    </ThemeProvider>
  );
}

export default App;