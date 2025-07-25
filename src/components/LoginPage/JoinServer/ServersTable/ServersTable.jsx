// src/components/LoginPage/JoinServer/ServersTable/ServersTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  useTheme,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion, AnimatePresence } from 'framer-motion';

const ServersTable = ({ rooms, handleJoinClick }) => {
  const theme = useTheme();
  const filteredRooms = rooms?.filter(room => !room.started) || [];

  if (filteredRooms.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 2,
        }}
      >
        <GroupIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)' }} />
        <Typography variant="h6" color="text.secondary">
          No servers available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your own server to start playing!
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      sx={{
        maxHeight: '100%',
        '&::-webkit-scrollbar': {
          width: 8,
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 4,
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.3)',
          },
        },
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ background: 'rgba(30, 41, 59, 0.95)' }}>Server Name</TableCell>
            <TableCell align="center" sx={{ background: 'rgba(30, 41, 59, 0.95)' }}>Players</TableCell>
            <TableCell align="center" sx={{ background: 'rgba(30, 41, 59, 0.95)' }}>Status</TableCell>
            <TableCell align="right" sx={{ background: 'rgba(30, 41, 59, 0.95)' }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <AnimatePresence>
            {filteredRooms.map((room, index) => (
              <motion.tr
                key={room._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                component={TableRow}
                style={{ position: 'relative' }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {room.private && (
                      <LockIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                    )}
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {room.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 } }}>
                      {[...Array(room.players.length)].map((_, i) => (
                        <Avatar
                          key={i}
                          sx={{
                            bgcolor: Object.values(theme.palette.game)[i],
                            width: 24,
                            height: 24,
                          }}
                        >
                          {i + 1}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    <Typography variant="body2" color="text.secondary">
                      {room.players.length}/4
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label="Waiting"
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{
                      borderColor: 'success.main',
                      color: 'success.main',
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleJoinClick(room)}
                    disabled={room.players.length >= 4}
                    startIcon={<PlayArrowIcon />}
                    sx={{
                      minWidth: 80,
                      background: room.players.length >= 4 
                        ? 'rgba(255,255,255,0.1)' 
                        : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                      '&:hover': {
                        background: room.players.length >= 4
                          ? 'rgba(255,255,255,0.1)'
                          : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                      },
                    }}
                  >
                    {room.players.length >= 4 ? 'Full' : 'Join'}
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ServersTable;