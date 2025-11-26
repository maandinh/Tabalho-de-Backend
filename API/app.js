require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const swaggerRoutes = require('./src/routes/apiDocs.js');
const tarefasRouter = require('./src/routes/tarefasRouter');
const userRouter = require('./src/routes/userRouter');
const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DBNAME}`

mongoose
    .connect(url)
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((err) => console.log("Erro ao conectar no MongoDB", err.message));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api-docs', swaggerRoutes);
app.use('/tarefas', tarefasRouter);
app.use('/auth', userRouter);

module.exports = app;
