require('dotenv').config();
const express = require('express');
const connectDB = require('./utils/db.connect');
const app = express()
const port = process.env.PORT || 3000;


connectDB();


app.get('/', (req, res) => {
    res.send('Hello World!')
})


try {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
} catch (err) {

    throw new Error("Unable to start express")
}