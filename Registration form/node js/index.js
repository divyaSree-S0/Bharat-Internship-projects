const express = require('express');
const mongoose = require('mongoose');
const app=express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    dob: Date
  });

const User = mongoose.model('User', userSchema);

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.render('registration', { isSuccess: false });
// res.render('registration')
});

app.post('/', async(req,res)=>{
    try{
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            dob: req.body.dob
        });
        await newUser.save();
        // res.render('registration', { isSuccess: true });
        res.redirect('/');
        res.json({ success: true });
        // res.send('Thank you for registering');
        console.log(newUser,'saved');
    }
    catch(err){
        console.log(err);
        // res.render('registration', { isSuccess: false });
        res.redirect('/');
        res.json({ success: false });
        
        // res.send('Sorry! Something went wrong.Please register again.');
    }
});

app.listen(port,()=> {
    console.log(`Server is running at http://localhost:${port}`);
})