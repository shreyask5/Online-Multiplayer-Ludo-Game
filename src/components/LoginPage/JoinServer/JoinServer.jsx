// src/components/LoginPage/JoinServer/JoinServer.jsx
import React, { useContext, useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketContext } from '../../../App';
import NameInput from '../NameInput/NameInput';
import Overlay from '../../Overlay/Overlay';
import ServersTable from './ServersTable/ServersTable';
import useSocketData from '../../../hooks/useSocketData';

const JoinServer = () => {
  const socket = useContext(SocketContext);
  const [rooms, setRooms] = useSocketData('room:rooms');
  const [joining, setJoining] = useState(false);
  const [clickedRoom, setClickedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    socket.emit('room:rooms');
    socket.on('room:rooms', () => {
      setIsLoading(false);
      setIsRefreshing(false);
    });
  }, [socket]);

  const getRooms = () => {
    setIsRefreshing(true);
    setRooms([]);
    socket.emit('room:rooms');
  };

  const handleJoinClick = room => {
    setClickedRoom(room);
    setJoining(true);
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 0,
          height: { xs: 'auto', md: 600 },
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Join a Server
          </Typography>
          <Tooltip title="Refresh servers">
            <IconButton
              onClick={getRooms}
              disabled={isRefreshing}
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={{
                  duration: 1,
                  repeat: isRefreshing ? Infinity : 0,
                  ease: 'linear',
                }}
              >
                <RefreshIcon />
              </motion.div>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden', p: 2 }}>
          {isLoading ? (
            <Box>
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  height={60}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                  }}
                />
              ))}
            </Box>
          ) : (
            <ServersTable rooms={rooms} handleJoinClick={handleJoinClick} />
          )}
        </Box>
      </Paper>

      {/* Join Dialog */}
      <AnimatePresence>
        {joining && (
          <Overlay handleOverlayClose={() => setJoining(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <NameInput 
                roomId={clickedRoom._id} 
                isRoomPrivate={clickedRoom.private}
                roomName={clickedRoom.name}
                onClose={() => setJoining(false)}
              />
            </motion.div>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default JoinServer;