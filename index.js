import express from 'express';

import userRoutes from './routes/userRoutes.js';
import manageRoutes from './routes/manageRoutes.js';
import manageApiRoutes from './routes/manageApiRoutes.js';

import {dbConnection} from './database/config.js';
import cookieParser from 'cookie-parser';
import csrf from '@dr.pogodin/csurf';
import * as dotenv from 'dotenv';
dotenv.config();

// Create express application
const app = express();

// Enable form reading
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Enable cookies
app.use(cookieParser());

// Enable csrf protection
app.use(csrf({cookie: true}));

// DB connection
dbConnection();

// Enable static files
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'pug');

// Set application views
app.set('views', './views');

// Routing
app.get('/', (req, res) => {res.redirect('/auth/login')});
app.use('/auth', userRoutes);
app.use('/manage', manageRoutes);
app.use('/api', manageApiRoutes);

// server port
const port = process.env.PORT;

// Listen port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});