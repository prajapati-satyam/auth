require('dotenv').config();
const express = require('express');
const connectDB = require('./utils/db.connect');
const router = require('./routes/user.route');
const app = express()
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const cors = require('cors');

connectDB();

app.use(cors({
  origin: ['http://localhost:5173','http://localhost:5174'],  // your frontend URL
  credentials: true                 // allow sending cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/v2', router)

try {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
} catch (err) {

    throw new Error("Unable to start server")
}