// src/components/Navbar/Navbar.jsx
import React, { useContext } from 'react';
import { Box, useTheme } from '@mui/material';
import { PlayerDataContext } from '../../App';
import PlayerCard from './PlayerCard/PlayerCard';

const Navbar = ({ 
  player, 
  playerIndex, 
  started, 
  time, 
  isReady, 
  rolledNumber, 
  nowMoving, 
  movingPlayer, 
  ended,
  position 
}) => {
  const theme = useTheme();
  const context = useContext(PlayerDataContext);
  const playerColor = ['red', 'blue', 'green', 'yellow'][playerIndex];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: position === 'top' && playerIndex === 3 ? 'flex-end' : 'flex-start',
        mb: position === 'top' ? 2 : 0,
        mt: position === 'bottom' ? 2 : 0,
      }}
    >
      <PlayerCard
        player={player}
        playerColor={playerColor}
        started={started}
        time={time}
        isReady={isReady}
        rolledNumber={rolledNumber}
        nowMoving={nowMoving}
        movingPlayer={movingPlayer}
        ended={ended}
        isCurrentPlayer={context.color === playerColor}
        playerIndex={playerIndex}
      />
    </Box>
  );
};

export default Navbar;