import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import bookRoutes from './routes/books.js';
import dashboardRoutes from './routes/dashboard.js';
import users from './routes/users.js';

import requireHTTPS from './middleware/redirectToSecure.js';

const app = express();
dotenv.config();

app.use(requireHTTPS);
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())

app.use('/books', bookRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/user', users);

app.get('/', (req, res) => {
    res.send('APP ver 1.1.2 IS RUNNING...')
})

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running at port: ${PORT}`)))
    .catch(err => console.error(err))