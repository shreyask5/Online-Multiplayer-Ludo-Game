// src/components/Gameboard/Map/Map.jsx
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { PlayerDataContext, SocketContext } from '../../../App';
import positionMapCoords from '../positions';
import canPawnMove from './canPawnMove';
import getPositionAfterMove from './getPositionAfterMove';

// Modern Ludo Board Design
const ModernLudoBoard = ({ size }) => {
  const theme = useTheme();
  
  return (
    <svg width={size} height={size} viewBox="0 0 460 460" style={{ width: '100%', height: '100%' }}>
      {/* Background */}
      <rect width="460" height="460" fill={theme.palette.background.paper} rx="16" />
      
      {/* Grid Pattern Background */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={theme.palette.divider} strokeWidth="0.5" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="460" height="460" fill="url(#grid)" rx="16" />
      
      {/* Home Bases */}
      {/* Red Home - Top Left */}
      <g>
        <rect x="20" y="20" width="180" height="180" fill={theme.palette.game.red} opacity="0.9" rx="12" />
        <rect x="40" y="40" width="140" height="140" fill={theme.palette.background.paper} rx="8" />
        {/* Home positions */}
        <circle cx="67" cy="67" r="20" fill={theme.palette.game.red} opacity="0.3" stroke={theme.palette.game.red} strokeWidth="2" />
        <circle cx="117" cy="67" r="20" fill={theme.palette.game.red} opacity="0.3" stroke={theme.palette.game.red} strokeWidth="2" />
        <circle cx="67" cy="116" r="20" fill={theme.palette.game.red} opacity="0.3" stroke={theme.palette.game.red} strokeWidth="2" />
        <circle cx="117" cy="116" r="20" fill={theme.palette.game.red} opacity="0.3" stroke={theme.palette.game.red} strokeWidth="2" />
      </g>
      
      {/* Yellow Home - Top Right */}
      <g>
        <rect x="260" y="20" width="180" height="180" fill={theme.palette.game.yellow} opacity="0.9" rx="12" />
        <rect x="280" y="40" width="140" height="140" fill={theme.palette.background.paper} rx="8" />
        <circle cx="343" cy="67" r="20" fill={theme.palette.game.yellow} opacity="0.3" stroke={theme.palette.game.yellow} strokeWidth="2" />
        <circle cx="393" cy="67" r="20" fill={theme.palette.game.yellow} opacity="0.3" stroke={theme.palette.game.yellow} strokeWidth="2" />
        <circle cx="343" cy="116" r="20" fill={theme.palette.game.yellow} opacity="0.3" stroke={theme.palette.game.yellow} strokeWidth="2" />
        <circle cx="393" cy="116" r="20" fill={theme.palette.game.yellow} opacity="0.3" stroke={theme.palette.game.yellow} strokeWidth="2" />
      </g>
      
      {/* Blue Home - Bottom Left */}
      <g>
        <rect x="20" y="260" width="180" height="180" fill={theme.palette.game.blue} opacity="0.9" rx="12" />
        <rect x="40" y="280" width="140" height="140" fill={theme.palette.background.paper} rx="8" />
        <circle cx="67" cy="343" r="20" fill={theme.palette.game.blue} opacity="0.3" stroke={theme.palette.game.blue} strokeWidth="2" />
        <circle cx="117" cy="343" r="20" fill={theme.palette.game.blue} opacity="0.3" stroke={theme.palette.game.blue} strokeWidth="2" />
        <circle cx="67" cy="393" r="20" fill={theme.palette.game.blue} opacity="0.3" stroke={theme.palette.game.blue} strokeWidth="2" />
        <circle cx="117" cy="393" r="20" fill={theme.palette.game.blue} opacity="0.3" stroke={theme.palette.game.blue} strokeWidth="2" />
      </g>
      
      {/* Green Home - Bottom Right */}
      <g>
        <rect x="260" y="260" width="180" height="180" fill={theme.palette.game.green} opacity="0.9" rx="12" />
        <rect x="280" y="280" width="140" height="140" fill={theme.palette.background.paper} rx="8" />
        <circle cx="343" cy="343" r="20" fill={theme.palette.game.green} opacity="0.3" stroke={theme.palette.game.green} strokeWidth="2" />
        <circle cx="393" cy="343" r="20" fill={theme.palette.game.green} opacity="0.3" stroke={theme.palette.game.green} strokeWidth="2" />
        <circle cx="343" cy="393" r="20" fill={theme.palette.game.green} opacity="0.3" stroke={theme.palette.game.green} strokeWidth="2" />
        <circle cx="393" cy="393" r="20" fill={theme.palette.game.green} opacity="0.3" stroke={theme.palette.game.green} strokeWidth="2" />
      </g>
      
      {/* Center Star */}
      <g transform="translate(230, 230)">
        <path
          d="M 0,-30 L 8.8,-9.3 L 28.5,-9.3 L 11.3,7.5 L 17.6,28.5 L 0,11.7 L -17.6,28.5 L -11.3,7.5 L -28.5,-9.3 L -8.8,-9.3 Z"
          fill={theme.palette.primary.main}
          opacity="0.9"
          stroke={theme.palette.primary.dark}
          strokeWidth="2"
        />
      </g>
      
      {/* Paths */}
      {/* Horizontal paths */}
      <rect x="200" y="20" width="60" height="180" fill="rgba(255,255,255,0.1)" />
      <rect x="200" y="260" width="60" height="180" fill="rgba(255,255,255,0.1)" />
      
      {/* Vertical paths */}
      <rect x="20" y="200" width="180" height="60" fill="rgba(255,255,255,0.1)" />
      <rect x="260" y="200" width="180" height="60" fill="rgba(255,255,255,0.1)" />
      
      {/* Path squares */}
      {/* Top path */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <rect
          key={`top-${i}`}
          x={200}
          y={20 + i * 30}
          width="30"
          height="30"
          fill="none"
          stroke={theme.palette.divider}
          strokeWidth="1"
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <rect
          key={`top-right-${i}`}
          x={230}
          y={20 + i * 30}
          width="30"
          height="30"
          fill={i === 0 ? theme.palette.game.yellow : i < 5 ? `${theme.palette.game.yellow}20` : 'none'}
          stroke={theme.palette.divider}
          strokeWidth="1"
        />
      ))}
      
      {/* Similar path squares for other directions... */}
      
      {/* Safe zones - marked with stars */}
      <g>
        <path d="M 215,110 l 2,6 h 6 l -5,4 l 2,6 l -5,-4 l -5,4 l 2,-6 l -5,-4 h 6 z" fill={theme.palette.warning.main} />
        <path d="M 110,245 l 2,6 h 6 l -5,4 l 2,6 l -5,-4 l -5,4 l 2,-6 l -5,-4 h 6 z" fill={theme.palette.warning.main} />
        <path d="M 245,350 l 2,6 h 6 l -5,4 l 2,6 l -5,-4 l -5,4 l 2,-6 l -5,-4 h 6 z" fill={theme.palette.warning.main} />
        <path d="M 350,215 l 2,6 h 6 l -5,4 l 2,6 l -5,-4 l -5,4 l 2,-6 l -5,-4 h 6 z" fill={theme.palette.warning.main} />
      </g>
    </svg>
  );
};

// Pawn Component
const Pawn = ({ x, y, color, isHint, isHovered, onClick, scale = 1 }) => {
  const theme = useTheme();
  
  return (
    <motion.g
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Shadow */}
      <ellipse
        cx={x}
        cy={y + 2}
        rx={12 * scale}
        ry={6 * scale}
        fill="rgba(0,0,0,0.3)"
        filter="blur(2px)"
      />
      
      {/* Pawn body */}
      <circle
        cx={x}
        cy={y - 5}
        r={15 * scale}
        fill={isHint ? 'rgba(128,128,128,0.6)' : theme.palette.game[color]}
        stroke={isHovered ? 'white' : theme.palette.game[color]}
        strokeWidth={isHovered ? 3 : 2}
      />
      
      {/* Pawn top */}
      <circle
        cx={x}
        cy={y - 8}
        r={8 * scale}
        fill={isHint ? 'rgba(100,100,100,0.6)' : `${theme.palette.game[color]}CC`}
      />
      
      {/* Highlight */}
      <ellipse
        cx={x - 3}
        cy={y - 12}
        rx={4 * scale}
        ry={6 * scale}
        fill="rgba(255,255,255,0.4)"
      />
      
      {/* Hover ring */}
      {isHovered && (
        <motion.circle
          cx={x}
          cy={y}
          r={20 * scale}
          fill="none"
          stroke={theme.palette.game[color]}
          strokeWidth="2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.g>
  );
};

const Map = ({ pawns, nowMoving, rolledNumber, started }) => {
  const theme = useTheme();
  const player = useContext(PlayerDataContext);
  const socket = useContext(SocketContext);
  const containerRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [hintPawn, setHintPawn] = useState(null);
  const [hoveredPawn, setHoveredPawn] = useState(null);
  const [boardSize, setBoardSize] = useState(460);

  // Responsive board sizing
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = window.innerHeight - 300; // Account for player cards
      const maxSize = Math.min(containerWidth, containerHeight, 600);
      const minSize = 300;
      
      setBoardSize(Math.max(Math.min(maxSize, 600), minSize));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handlePawnClick = (pawn) => {
    if (!started || !nowMoving || !rolledNumber) return;
    if (pawn.color === player.color && canPawnMove(pawn, rolledNumber)) {
      socket.emit('game:move', pawn._id);
      setHintPawn(null);
    }
  };

  const handlePawnHover = (pawn) => {
    if (!started || !nowMoving || !rolledNumber) return;
    
    if (pawn.color === player.color && canPawnMove(pawn, rolledNumber)) {
      setHoveredPawn(pawn._id);
      const pawnPosition = getPositionAfterMove(pawn, rolledNumber);
      if (pawnPosition && (!hintPawn || hintPawn.id !== pawn._id)) {
        setHintPawn({ id: pawn._id, position: pawnPosition, color: 'grey' });
      }
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        maxWidth: 600,
        margin: '0 auto',
        p: { xs: 1, sm: 2 },
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: boardSize,
          height: boardSize,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            background: theme.palette.background.paper,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* SVG Board */}
          <ModernLudoBoard size={boardSize} />
          
          {/* Pawns Layer */}
          <svg
            width={boardSize}
            height={boardSize}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
            }}
            viewBox="0 0 460 460"
          >
            {/* Hint Pawn */}
            {hintPawn && (
              <Pawn
                x={positionMapCoords[hintPawn.position].x}
                y={positionMapCoords[hintPawn.position].y}
                color="grey"
                isHint={true}
                scale={isMobile ? 0.8 : 1}
              />
            )}
            
            {/* Actual Pawns */}
            {pawns.map((pawn) => {
              const pos = positionMapCoords[pawn.position];
              return (
                <g key={pawn._id} style={{ pointerEvents: 'auto' }}>
                  <Pawn
                    x={pos.x}
                    y={pos.y}
                    color={pawn.color}
                    isHovered={hoveredPawn === pawn._id}
                    onClick={() => handlePawnClick(pawn)}
                    scale={isMobile ? 0.8 : 1}
                  />
                  {/* Touch target for mobile */}
                  {isMobile && (
                    <rect
                      x={pos.x - 25}
                      y={pos.y - 25}
                      width="50"
                      height="50"
                      fill="transparent"
                      onClick={() => handlePawnClick(pawn)}
                      onMouseEnter={() => handlePawnHover(pawn)}
                      onMouseLeave={() => {
                        setHoveredPawn(null);
                        setHintPawn(null);
                      }}
                    />
                  )}
                </g>
              );
            })}
          </svg>
          
          {/* Game Status Overlay */}
          {!started && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                borderRadius: 3,
              }}
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  textAlign: 'center',
                  color: 'white',
                  padding: theme.spacing(3),
                }}
              >
                <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
                  Waiting for players
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  Players need to ready up to start the game
                </Typography>
              </motion.div>
            </Box>
          )}
          
          {/* Turn Indicator for Mobile */}
          {started && isMobile && nowMoving && rolledNumber && (
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                background: theme.palette.game[player.color],
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 2,
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              Tap your pawn to move!
            </Box>
          )}
        </Box>
      </motion.div>
    </Box>
  );
};

export default Map;