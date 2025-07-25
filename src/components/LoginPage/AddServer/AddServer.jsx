// src/components/LoginPage/AddServer/AddServer.jsx
import React, { useState, useContext } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Collapse,
  useTheme,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { motion } from 'framer-motion';
import { SocketContext } from '../../../App';
import useInput from '../../../hooks/useInput';

const AddServer = () => {
  const theme = useTheme();
  const socket = useContext(SocketContext);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const serverName = useInput('');
  const password = useInput('');

  const handleButtonClick = async (e) => {
    e.preventDefault();
    
    if (!serverName.value.trim()) {
      setIsIncorrect(true);
      return;
    }
    
    setIsCreating(true);
    socket.emit('room:create', {
      name: serverName.value.trim(),
      password: password.value,
      private: isPrivate,
    });
    
    // Reset form after creation
    setTimeout(() => {
      setIsCreating(false);
      serverName.onChange({ target: { value: '' } });
      password.onChange({ target: { value: '' } });
      setIsPrivate(false);
      setIsIncorrect(false);
    }, 1000);
  };

  return (
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
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Host a Server
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Create your own game room and invite friends to play
          </Typography>
        </Box>

        <form onSubmit={handleButtonClick} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <TextField
            fullWidth
            label="Server Name"
            placeholder="Enter a unique server name"
            {...serverName}
            error={isIncorrect}
            helperText={isIncorrect ? 'Server name is required' : ''}
            onChange={(e) => {
              serverName.onChange(e);
              setIsIncorrect(false);
            }}
            InputProps={{
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

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: 1,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VpnKeyIcon sx={{ color: 'warning.main' }} />
              <Typography variant="body1">Private Server</Typography>
            </Box>
            <Switch
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
              color="primary"
            />
          </Box>

          <Collapse in={isPrivate}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TextField
                fullWidth
                type="password"
                label="Server Password"
                placeholder="Set a password for your server"
                {...password}
                InputProps={{
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
              <Alert severity="info" sx={{ mt: 2 }}>
                Share this password with friends to let them join your private server
              </Alert>
            </motion.div>
          </Collapse>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isCreating}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              py: 1.5,
              mt: 2,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {isCreating ? 'Creating Server...' : 'Create Server'}
          </Button>
        </form>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Alert severity="success" icon={false} sx={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <Typography variant="body2">
              <strong>Tip:</strong> You can start playing with 2 players minimum, or wait for 4 players to join!
            </Typography>
          </Alert>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddServer;