// src/components/LoginPage/LoginPage.jsx
import React from 'react';
import { Box, Container, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import AddServer from './AddServer/AddServer';
import JoinServer from './JoinServer/JoinServer';

const LoginPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.5,
            }}
            initial={{
              width: 200 + i * 50,
              height: 200 + i * 50,
              left: `${20 * i}%`,
              top: `${10 * i}%`,
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            {/* Logo section - inline implementation */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: { xs: 48, md: 64 },
                    color: theme.palette.primary.main,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                    display: 'inline-block',
                  }}
                >
                  🎲
                </Box>
              </motion.div>
              <Box>
                <Box
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '3rem' },
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                    margin: 0,
                  }}
                >
                  Ludo Online
                </Box>
                <Box
                  component="p"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    mt: -0.5,
                    margin: 0,
                  }}
                >
                  Play with friends in real-time
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6} lg={5}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <JoinServer />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AddServer />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;