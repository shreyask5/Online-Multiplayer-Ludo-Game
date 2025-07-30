
# Online Multiplayer Ludo Game - Modern UI/UX Edition

<p align="center">
  <img src="https://raw.githubusercontent.com/shreyask5/Online-Multiplayer-Ludo-Game/refs/heads/main/src/images/Ludo%20Logo.gif" alt="Ludo Logo" width="400"/>
</p>

## **🎮 Play Ludo Online Live**: [https://shreyask.in/projects/ludo-online/demo/](https://shreyask.in/projects/ludo-online/demo/)
## **📹 Watch Demo Video**: [View Demo Here](https://shreyas-s-k-s3-bucket.s3.ap-south-1.amazonaws.com/assets/ludo_online_demo+video.mp4)

Ludo Online is a modern, fully‑responsive multiplayer web implementation of the classic board game Ludo. Built with the MERN stack and powered by Socket.IO for real‑time gameplay, this version features a completely redesigned UI/UX with Material‑UI v5, smooth animations, and mobile‑first design principles.

## Table of Contents

- [Introduction](#introduction)
- [Project Overview](#project-overview)
- [Features and Functionalities](#features-and-functionalities)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [UI/UX Improvements](#uiux-improvements)
- [Installation Guide](#installation-guide)
- [Screenshots](#screenshots)
- [Known Issues](#known-issues)
- [Future Enhancements](#future-enhancements)
- [Changelog](#changelog)

## Introduction

Ludo Online brings the beloved board game into the digital age with a stunning modern interface, real‑time multiplayer capabilities, and seamless cross‑device compatibility. Whether you're on a desktop or mobile device, enjoy smooth gameplay with friends from anywhere in the world.

## Project Overview

This project is a complete reimagining of the classic Ludo game, featuring:
- **Real‑time multiplayer gameplay** using Socket.IO
- **Modern, responsive UI** built with Material‑UI v5 and Framer Motion
- **Cross‑platform compatibility** (Desktop, Tablet, Mobile)
- **Secure session management** with Express Session and MongoDB
- **Scalable architecture** with Docker and cloud deployment

Players can create or join game rooms, play with 2–4 players, and experience the classic Ludo gameplay with modern visual enhancements and smooth animations.

## Features and Functionalities

### Core Gameplay
- **Real‑time Multiplayer**: Play with 2–4 players in real time  
- **Room Management**: Create private/public rooms with passwords  
- **Turn‑based System**: Automatic turn management with 15‑second timer  
- **Dice Rolling**: Animated 3D dice with physics‑based rolling  
- **Pawn Movement**: Smooth animations with visual hints for valid moves  
- **Victory Celebrations**: Confetti animations and winner showcase  

### User Experience
- **Modern UI/UX**: Dark theme with glassmorphic effects  
- **Responsive Design**: Optimized layouts for all screen sizes  
- **Touch‑Friendly**: Large touch targets on mobile devices  
- **Visual Feedback**: Hover effects, animations, and status indicators  
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation  

### Technical Features
- **Session Persistence**: Reconnect to games after disconnection  
- **Auto‑save**: Game state saved automatically  
- **Spectator Mode**: Watch ongoing games (coming soon)  
- **Chat System**: In‑game communication (coming soon)  

## Technology Stack

### Frontend
![React](https://img.shields.io/badge/React_18.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Material-UI](https://img.shields.io/badge/Material--UI_5.14-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Socket.io Client](https://img.shields.io/badge/Socket.io_Client-010101?style=for-the-badge&logo=socket.io&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js_14+-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js_4.17-404d59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io_4.7-010101?style=for-the-badge&logo=socket.io&logoColor=white)

### Testing
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)
![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white)

### DevOps & Cloud
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![CircleCI](https://img.shields.io/badge/CircleCI-343434?style=for-the-badge&logo=circleci&logoColor=white)
![Oracle Cloud](https://img.shields.io/badge/Oracle_Cloud-F80000?style=for-the-badge&logo=oracle&logoColor=white)


## Architecture

<p align="center">
  <img src="https://github.com/Wenszel/mern-ludo/blob/main/src/images/architecture.png?raw=true" alt="Architecture Diagram" width="800"/>
</p>

### System Architecture
- **Frontend**: React SPA with Material‑UI components  
- **Backend**: Express.js REST API with Socket.IO  
- **Database**: MongoDB for game state and sessions  
- **Real‑time**: Socket.IO for bidirectional communication  
- **Deployment**: Docker containers on cloud platforms  

## UI/UX Improvements

### 🎨 Design System
- **Modern Dark Theme**: Navy backgrounds with vibrant accents  
- **Glassmorphism**: Backdrop blur effects for depth  
- **Accessible Color Palette**  

### 📱 Mobile Optimizations
- **Responsive Breakpoints**: Mobile ≤480px, Tablet 481–768px, Desktop ≥769px  
- **Touch‑Optimized**: 50×50px touch targets  
- **Adaptive Layouts** and 60fps animations  

### ✨ Visual Enhancements
- **SVG Game Board** for crisp graphics  
- **3D Pawns**, **Animated Dice**, **Confetti Effects**, **Skeleton Screens**  

### ♿ Accessibility
- **WCAG 2.1 AA** compliance  
- **Keyboard Navigation**, **Screen Reader Support**, **Focus Indicators**  

## Installation Guide

### Prerequisites
- Node.js 14+  
- MongoDB (local or Atlas)  
- npm or yarn  

### Quick Start

1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/ludo-online.git
   cd ludo-online
   ```

2. **Install dependencies**

   ```bash
   npm install        # frontend
   cd backend
   npm install        # backend
   ```

3. **Configure environment**
   Create `/backend/.env`:

   ```env
   PORT=8080
   CONNECTION_URI=mongodb://localhost:27017/ludo-game
   NODE_ENV=development
   ```

4. **Start the application**

   ```bash
   # Terminal 1 (backend)
   cd backend && node server.js

   # Terminal 2 (frontend)
   npm start
   ```

5. **Access the game**

   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend:  [http://localhost:8080](http://localhost:8080)

### Docker Deployment

```bash
docker build -t ludo-online .
docker run -p 8080:8080 ludo-online
```

## Screenshots

### Desktop Experience

<p align="center">
  <img src="https://github.com/Wenszel/mern-ludo/blob/main/src/images/modern-desktop.png?raw=true" alt="Desktop Game View" width="800"/>
</p>

### Mobile Experience

<p align="center">
  <img src="https://github.com/Wenszel/mern-ludo/blob/main/src/images/modern-mobile.png?raw=true" alt="Mobile Game View" width="300"/>
</p>

## Known Issues

1. **MongoDB Connection**: Ensure your IP is whitelisted in MongoDB Atlas
2. **WebSocket CORS**: Configure proper CORS settings for production
3. **Mobile Safari**: Some animations may need optimization
4. **Performance**: Large rooms may experience slight delays

## Future Enhancements

* In‑game Chat
* Sound Effects
* Player Profiles & Statistics
* Tournament Mode
* Spectator Mode
* AI Players
* Board Themes & Customization
* Achievements & Leaderboards
* Game Replay

## Changelog

### Version 1.0 – Initial & Modern UI/UX Release

* Complete UI redesign with Material‑UI v5 & dark theme
* Full mobile responsiveness & touch‑optimized controls
* Framer Motion animations & glassmorphic effects
* SVG game board, 3D dice & pawn animations
* Real‑time multiplayer (Socket.IO), rooms & turn‑based system
* Session persistence, auto‑save & accessibility improvements

---

Credit to [https://github.com/Wenszel/mern-ludo](https://github.com/Wenszel/mern-ludo)


