const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs');
require('dotenv').config();
const { sessionMiddleware } = require('./config/session');

const HTTP_PORT = process.env.HTTP_PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;
const HOST = process.env.HOST || '0.0.0.0';
const DOMAIN = process.env.DOMAIN || 'ludo.shreyask.in';

const app = express();

// Create separate apps for HTTP and HTTPS
const httpApp = express();
const httpsApp = express();

// HTTP app - only for redirects to HTTPS
httpApp.use((req, res) => {
    const httpsUrl = `https://${req.get('host').replace(/:\d+$/, '')}${req.url}`;
    console.log(`Redirecting HTTP to HTTPS: ${req.url} -> ${httpsUrl}`);
    res.redirect(301, httpsUrl);
});

// HTTPS app - main application
httpsApp.use(cookieParser());
httpsApp.use(
    express.urlencoded({
        extended: true,
    })
);
httpsApp.use(express.json());
httpsApp.set('trust proxy', 1);

// Update CORS for HTTPS app
httpsApp.use(
    cors({
        origin: [
            'http://localhost:3000',
            'https://shreyask.in',
            `https://${DOMAIN}`,
            `http://${DOMAIN}`,
            'http://80.225.238.29:8080'
        ],
        credentials: true,
    })
);

httpsApp.use(sessionMiddleware);

// Static files and routes for HTTPS app
if (process.env.NODE_ENV === 'production') {
    httpsApp.use(express.static('./build'));
    httpsApp.get('*', (req, res) => {
        const indexPath = path.join(__dirname, '/build/index.html');
        res.sendFile(indexPath);
    });
}



let server;
let httpsServer;

// Function to start servers
function startServers() {
    // Always start HTTP server on port 80 for redirects and Let's Encrypt challenges
    server = http.createServer(httpApp);
    server.listen(HTTP_PORT, HOST, () => {
        console.log(`HTTP Server (redirect only) running on http://${HOST}:${HTTP_PORT}`);
    });

    // Start HTTPS server if certificates exist
    if (process.env.NODE_ENV === 'production') {
        try {
            const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/privkey.pem`, 'utf8');
            const certificate = fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/cert.pem`, 'utf8');
            const ca = fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/chain.pem`, 'utf8');

            const credentials = {
                key: privateKey,
                cert: certificate,
                ca: ca
            };

            httpsServer = https.createServer(credentials, httpsApp);
            httpsServer.listen(HTTPS_PORT, HOST, () => {
                console.log(`HTTPS Server (main app) running on https://${HOST}:${HTTPS_PORT}`);
            });

            // Setup Socket.IO with HTTPS server
            require('./config/socket')(httpsServer);
            
        } catch (error) {
            console.warn('SSL certificates not found. Running HTTP only.');
            console.warn('Run the SSL setup commands to enable HTTPS.');
            
            // Fallback: serve main app on HTTP server as well
            server.close();
            server = http.createServer(httpsApp); // Use main app for development
            server.listen(HTTP_PORT, HOST, () => {
                console.log(`HTTP Server (fallback mode) running on http://${HOST}:${HTTP_PORT}`);
            });
            require('./config/socket')(server);
        }
    } else {
        // Development mode - serve main app on HTTP
        server.close();
        server = http.createServer(httpsApp);
        server.listen(HTTP_PORT, HOST, () => {
            console.log(`HTTP Server (development) running on http://${HOST}:${HTTP_PORT}`);
        });
        require('./config/socket')(server);
    }
}

// Function to reload SSL certificates (for renewal)
function reloadSSLCertificates() {
    if (process.env.NODE_ENV === 'production' && httpsServer) {
        try {
            const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/privkey.pem`, 'utf8');
            const certificate = fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/cert.pem`, 'utf8');
            const ca = fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/chain.pem`, 'utf8');

            const credentials = {
                key: privateKey,
                cert: certificate,
                ca: ca
            };

            // Close existing HTTPS server
            httpsServer.close(() => {
                // Create new HTTPS server with updated certificates
                httpsServer = https.createServer(credentials, httpsApp);
                httpsServer.listen(HTTPS_PORT, HOST, () => {
                    console.log(`HTTPS Server reloaded with new certificates on https://${HOST}:${HTTPS_PORT}`);
                });
                require('./config/socket')(httpsServer);
            });
        } catch (error) {
            console.error('Failed to reload SSL certificates:', error);
        }
    }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    if (server) server.close();
    if (httpsServer) httpsServer.close();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    if (server) server.close();
    if (httpsServer) httpsServer.close();
    process.exit(0);
});

// Initialize database and start servers
require('./config/database')(mongoose);
startServers();

module.exports = { 
    server, 
    httpsServer, 
    reloadSSLCertificates 
};