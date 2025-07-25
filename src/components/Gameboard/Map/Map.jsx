// src/components/Gameboard/Map/Map.jsx
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { PlayerDataContext, SocketContext } from '../../../App';
import mapImage from '../../../images/map.jpg';
import positionMapCoords from '../positions';
import pawnImages from '../../../constants/pawnImages';
import canPawnMove from './canPawnMove';
import getPositionAfterMove from './getPositionAfterMove';

const Map = ({ pawns, nowMoving, rolledNumber, started }) => {
  const theme = useTheme();
  const player = useContext(PlayerDataContext);
  const socket = useContext(SocketContext);
  const canvasRef = useRef(null);
  const [hintPawn, setHintPawn] = useState();
  const [hoveredPawn, setHoveredPawn] = useState(null);
  const [canvasSize, setCanvasSize] = useState(460);

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      const maxSize = Math.min(window.innerWidth - 40, window.innerHeight - 300, 600);
      setCanvasSize(Math.max(maxSize, 320));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const scale = canvasSize / 460;

  const paintPawn = (context, pawn, isHint = false) => {
    const originalPos = positionMapCoords[pawn.position];
    const { x, y } = {
      x: originalPos.x * scale,
      y: originalPos.y * scale,
    };
    
    const touchableArea = new Path2D();
    touchableArea.arc(x, y, 12 * scale, 0, 2 * Math.PI);
    
    const image = new Image();
    image.src = isHint ? pawnImages.grey : pawnImages[pawn.color];
    image.onload = function () {
      // Add shadow for depth
      context.shadowColor = 'rgba(0, 0, 0, 0.3)';
      context.shadowBlur = 4 * scale;
      context.shadowOffsetX = 2 * scale;
      context.shadowOffsetY = 2 * scale;
      
      context.drawImage(
        image, 
        x - (17 * scale), 
        y - (15 * scale), 
        35 * scale, 
        30 * scale
      );
      
      // Reset shadow
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;

      // Draw hover effect
      if (hoveredPawn === pawn._id && !isHint) {
        context.strokeStyle = theme.palette.game[pawn.color];
        context.lineWidth = 3 * scale;
        context.beginPath();
        context.arc(x, y, 16 * scale, 0, 2 * Math.PI);
        context.stroke();
      }
    };
    
    return touchableArea;
  };

  const handleCanvasClick = event => {
    if (!started || !nowMoving || !rolledNumber) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const cursorX = (event.clientX - rect.left) * (canvas.width / rect.width);
    const cursorY = (event.clientY - rect.top) * (canvas.height / rect.height);
    
    for (const pawn of pawns) {
      if (ctx.isPointInPath(pawn.touchableArea, cursorX, cursorY)) {
        if (pawn.color === player.color && canPawnMove(pawn, rolledNumber)) {
          socket.emit('game:move', pawn._id);
          break;
        }
      }
    }
    setHintPawn(null);
  };

  const handleMouseMove = event => {
    if (!started || !nowMoving || !rolledNumber) {
      setHoveredPawn(null);
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    
    canvas.style.cursor = 'default';
    let foundHover = false;
    
    for (const pawn of pawns) {
      if (ctx.isPointInPath(pawn.touchableArea, x, y)) {
        if (pawn.color === player.color && canPawnMove(pawn, rolledNumber)) {
          canvas.style.cursor = 'pointer';
          setHoveredPawn(pawn._id);
          foundHover = true;
          
          const pawnPosition = getPositionAfterMove(pawn, rolledNumber);
          if (pawnPosition && (!hintPawn || hintPawn.id !== pawn._id)) {
            setHintPawn({ id: pawn._id, position: pawnPosition, color: 'grey' });
          }
          break;
        }
      }
    }
    
    if (!foundHover) {
      setHoveredPawn(null);
      setHintPawn(null);
    }
  };

  useEffect(() => {
    const rerenderCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const image = new Image();
      image.src = mapImage;
      image.onload = function () {
        // Draw board with slight opacity for modern look
        ctx.globalAlpha = 0.95;
        ctx.drawImage(image, 0, 0, canvasSize, canvasSize);
        ctx.globalAlpha = 1;
        
        // Paint pawns
        pawns.forEach((pawn, index) => {
          pawns[index].touchableArea = paintPawn(ctx, pawn);
        });
        
        // Paint hint pawn
        if (hintPawn) {
          ctx.globalAlpha = 0.6;
          paintPawn(ctx, hintPawn, true);
          ctx.globalAlpha = 1;
        }
      };
    };
    
    rerenderCanvas();
  }, [hintPawn, pawns, hoveredPawn, canvasSize, scale, theme]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHoveredPawn(null);
            setHintPawn(null);
          }}
          style={{
            borderRadius: 16,
            border: `3px solid ${theme.palette.primary.dark}`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            backgroundColor: theme.palette.background.paper,
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </motion.div>
      
      {/* Game start indicator */}
      {!started && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
            background: 'rgba(0, 0, 0, 0.8)',
            padding: 3,
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
          }}
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Waiting for players to ready up...
          </motion.div>
        </Box>
      )}
    </Box>
  );
};

export default Map;