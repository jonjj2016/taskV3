const express = require('express');
const usersRouter = require('./routs/users');
const tasksRouter = require('./routs/tasks');
const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
// //
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   console.log('Hello from the midleware');

//   next();
// });
// express.urlencoded({ extended: false });
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/tasks', tasksRouter);
module.exports = app;