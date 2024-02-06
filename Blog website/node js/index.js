const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}`)
})