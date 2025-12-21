#!/usr/bin/env node

/**
 * cPanel Compatible Server for ZIVAH International Next.js App
 * This file acts as the entry point for cPanel Node.js hosting
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Configuration
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Import database utilities for health monitoring
let startHealthMonitoring, stopHealthMonitoring, disconnectDatabase;
try {
  ({ startHealthMonitoring, stopHealthMonitoring, disconnectDatabase } = require('./src/lib/db'));
} catch (error) {
  console.error('Warning: Could not load database module for health monitoring:', error.message);
}

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      // Parse request URL
      const parsedUrl = parse(req.url, true);

      // Handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Start the server
  server.listen(port, err => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://${hostname}:${port}`);
    // eslint-disable-next-line no-console
    console.log(`> Environment: ${process.env.NODE_ENV}`);
    // eslint-disable-next-line no-console
    console.log(`> Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);

    // Start database health monitoring (check every 30 seconds)
    if (startHealthMonitoring && process.env.DATABASE_URL) {
      startHealthMonitoring(30000);
      // eslint-disable-next-line no-console
      console.log('> Database health monitoring: Active');
    }
  });

  // Graceful shutdown
  const gracefulShutdown = async signal => {
    // eslint-disable-next-line no-console
    console.log(`${signal} received, shutting down gracefully`);

    // Stop health monitoring
    if (stopHealthMonitoring) {
      stopHealthMonitoring();
    }

    // Close server
    server.close(async () => {
      // eslint-disable-next-line no-console
      console.log('HTTP server closed');

      // Disconnect database
      if (disconnectDatabase) {
        try {
          await disconnectDatabase();
          // eslint-disable-next-line no-console
          console.log('Database connection closed');
        } catch (error) {
          console.error('Error closing database connection:', error);
        }
      }

      // eslint-disable-next-line no-console
      console.log('Process terminated');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
});
