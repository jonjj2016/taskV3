const app = require('./app');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
//const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
const DB = process.env.DATABASE_LOCAL;

dotEnv.config({
  path: './config.env'
});
mongoose
  .connect('mongodb://localhost:27017/tasksv3', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(res => console.log('connected to DB'));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));