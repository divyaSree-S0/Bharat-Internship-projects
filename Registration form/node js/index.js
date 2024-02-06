const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app=express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type:String,
        unique:true,
        minlength:5,
        maxlength:50
    },
    password: String,
    email: String,
    dob: Date
  });

const User = mongoose.model('User', userSchema);

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.render('registration', { success: false });
// res.render('registration')
});

app.get('/favicon.ico', (req, res) => res.status(204));

app.post('/', async(req,res)=>{
    try{
        // if (!req.body.name || !req.body.username || !req.body.password || !req.body.email || !req.body.dob) {
        //     console.log('Please fill in all required fields.');
        //     // alert('Please fill in all required fields.');
        //     return res.json({ success: false });
        // }
        // const saltRounds = 10;
        // const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const hashedPassword = await hashPassword(req.body.password);
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
            // password: req.body.password,
            email: req.body.email,
            dob: req.body.dob
        });
        const validationResult = newUser.validateSync();
        if (validationResult && validationResult.errors && validationResult.errors.username) {
            return res.render('registration', {
                success: false,
                usernameError: "Username should be unique and have a length of 5-50 characters."
            });
        }
        // const validationResult = newUser.validateSync();
        // if (validationResult) {
        //     return res.render('registration', { isSuccess: false, errorMessage: 'Username already exists.' });
        // }

        await newUser.save();
        res.render('registration', { success: true });
        // res.redirect('/');
        // res.json({ success: true });
        // res.send('Thank you for registering');
        // res.render('registration');

        console.log(newUser,'saved');
    }
    catch(err){
        console.log(err);
        res.render('registration', { success: false });
        // res.redirect('/');
        // res.json({ success: false });
        // res.render('registration');
        
        // res.send('Sorry! Something went wrong.Please register again.');
    }
});

// app.post('/', async (req, res) => {
//     try {
//         console.log('Received data:', req.body);

//         if (!req.body.name || !req.body.username || !req.body.password || !req.body.email || !req.body.dob) {
//             console.log('Please fill in all required fields.');
//             return res.json({ success: false });
//         }

//         const hashedPassword = await hashPassword(req.body.password);

//         const newUser = new User({
//             name: req.body.name,
//             username: req.body.username,
//             password: hashedPassword,
//             email: req.body.email,
//             dob: req.body.dob
//         });

//         const validationResult = newUser.validateSync();

//         if (validationResult && validationResult.errors && validationResult.errors.username) {
//             return res.render('registration', {
//                 success: false,
//                 usernameError: "Username should be unique and have a length of 5-50 characters."
//             });
//         }

        
//         if (req.xhr || req.headers.accept.indexOf('json') > -1) {
//             return res.json({ isSuccess: true });
//         }
//         res.render('registration', { success: true });
//         await newUser.save();
//         console.log(newUser, 'saved');
//     } catch (err) {
//         console.error('Error:', err);
//         if (req.xhr || req.headers.accept.indexOf('json') > -1) {
//             return res.json({ success: false });
//         }
//         res.render('registration', { success: false });
//     }
// });

async function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

app.listen(port,()=> {
    console.log(`Server is running at http://localhost:${port}`);
})




// const express = require('express');
// const mongoose = require('mongoose');
// const app=express();
// const port = 3000;

// mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });

// const userSchema = new mongoose.Schema({
//     name: String,
//     username: {
//         type:String,
//         unique:true,
//         minlength:5,
//         maxlength:50
//     },
//     password: String,
//     email: String,
//     dob: Date
//   });

// const User = mongoose.model('User', userSchema);

// app.set('view engine','ejs');
// app.use(express.static('public'));
// app.use(express.urlencoded({ extended: true }));

// app.get('/',(req,res)=>{
//     res.render('registration', { isSuccess: false });
// // res.render('registration')
// });

// app.get('/favicon.ico', (req, res) => res.status(204));

// app.post('/', async(req,res)=>{
//     try{
//         if (!req.body.name || !req.body.username || !req.body.password || !req.body.email || !req.body.dob) {
//             console.log('Please fill in all required fields.');
//             return res.json({ success: false });
//         }
//         const newUser = new User({
//             name: req.body.name,
//             username: req.body.username,
//             password: req.body.password,
//             email: req.body.email,
//             dob: req.body.dob
//         });
//         const validationResult = newUser.validateSync();
//         if (validationResult && validationResult.errors.username) {
//             return res.render('registration', {
//                 isSuccess: false,
//                 success: false,
//                 usernameError: "Username should be unique and have a length of 5-50 characters."
//                 // usernameError: validationResult.errors.username.message
//             });
//         }
//         // const validationResult = newUser.validateSync();
//         // if (validationResult) {
//         //     return res.render('registration', { isSuccess: false, errorMessage: 'Username already exists.' });
//         // }

//         await newUser.save();
//         res.render('registration', { success: true });
//         // res.redirect('/');
//         // res.json({ success: true });
//         // res.send('Thank you for registering');
//         // res.render('registration');

//         console.log(newUser,'saved');
//     }
//     catch(err){
//         console.log(err);
//         res.render('registration', { success: false });
//         // res.redirect('/');
//         // res.json({ success: false });
//         // res.render('registration');
        
//         // res.send('Sorry! Something went wrong.Please register again.');
//     }
// });

// app.listen(port,()=> {
//     console.log(`Server is running at http://localhost:${port}`);
// })