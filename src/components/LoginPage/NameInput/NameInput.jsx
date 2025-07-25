// src/components/LoginPage/NameInput/NameInput.jsx
import React, { useState, useContext, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Chip,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';
import { SocketContext } from '../../../App';
import useInput from '../../../hooks/useInput';
import useKeyPress from '../../../hooks/useKeyPress';

const NameInput = ({ isRoomPrivate, roomId, roomName, onClose }) => {
  const socket = useContext(SocketContext);
  const nickname = useInput('');
  const password = useInput('');
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [nicknameError, setNicknameError] = useState(false);

  const handleButtonClick = () => {
    if (!nickname.value.trim()) {
      setNicknameError(true);
      return;
    }

    setIsJoining(true);
    socket.emit('player:login', { 
      name: nickname.value.trim(), 
      password: password.value, 
      roomId: roomId 
    });
  };

  useKeyPress('Enter', handleButtonClick);
  useKeyPress('Escape', onClose);

  useEffect(() => {
    const handleWrongPassword = () => {
      setIsPasswordWrong(true);
      setIsJoining(false);
    };

    const handleChangeRoom = () => {
      setIsJoining(false);
      onClose();
    };

    socket.on('error:wrongPassword', handleWrongPassword);
    socket.on('error:changeRoom', handleChangeRoom);

    return () => {
      socket.off('error:wrongPassword', handleWrongPassword);
      socket.off('error:changeRoom', handleChangeRoom);
    };
  }, [socket, onClose]);

  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        width: { xs: '90vw', sm: 400 },
        maxWidth: 400,
        background: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Join Server
        </Typography>
        <Chip
          label={roomName}
          color="primary"
          variant="outlined"
          sx={{ 
            maxWidth: '100%',
            height: 'auto',
            '& .MuiChip-label': {
              whiteSpace: 'normal',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          fullWidth
          label="Nickname"
          placeholder="Enter your nickname"
          error={nicknameError}
          helperText={nicknameError ? 'Nickname is required' : ''}
          {...nickname}
          onChange={(e) => {
            nickname.onChange(e);
            setNicknameError(false);
          }}
          InputProps={{
            startAdornment: (
              <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />
            ),
            sx: {
              background: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.08)',
              },
              '&.Mui-focused': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            },
          }}
          autoFocus
        />

        {isRoomPrivate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <TextField
              fullWidth
              type="password"
              label="Room Password"
              placeholder="Enter room password"
              error={isPasswordWrong}
              helperText={isPasswordWrong ? 'Incorrect password' : ''}
              {...password}
              onChange={(e) => {
                password.onChange(e);
                setIsPasswordWrong(false);
              }}
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ color: 'text.secondary', mr: 1 }} />
                ),
                sx: {
                  background: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.08)',
                  },
                  '&.Mui-focused': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                },
              }}
            />
          </motion.div>
        )}

        {isPasswordWrong && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Wrong password. Please try again.
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleButtonClick}
          disabled={isJoining}
          startIcon={<LoginIcon />}
          sx={{
            py: 1.5,
            mt: 2,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {isJoining ? 'Joining...' : 'Join Game'}
        </Button>

        <Typography
          variant="caption"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            display: 'block',
          }}
        >
          Press ESC to cancel
        </Typography>
      </Box>
    </Paper>
  );
};

export default NameInput;