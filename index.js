const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const authRoutes = require('./routes/auth')
const bookRoutes = require('./routes/book')
const app = express();
const port = 3000;


// Middleware
app.use(cors())
app.use(bodyParser.json());
app.use('/auth',authRoutes)
app.use('/api',bookRoutes)



mongoose.connect('mongodb+srv://S_das:Sudipto123@cluster0.c1sttyl.mongodb.net/Library', {dbName:'Library'})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

app.listen(port, () => console.log(`Server started on port ${port}`));