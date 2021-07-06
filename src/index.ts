/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import logger from './utils/logger';
import connectDB from './models/db';

dotenv.config();

connectDB(process.env.DB_URL || '');

const app = express();
const server = http.createServer(app);

server.listen(process.env.PORT || 8000, (): void => {
  logger.info(`App listening on port ${process.env.PORT}`);
});
