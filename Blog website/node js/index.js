const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/Bharat-internship', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected successfully to MongoDB");
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
    });


const postSchema = new mongoose.Schema({
    id : Number,
    title: String,
    author: String,
    date: { type: Date, default: Date.now },
    content: String,
    excerpt: String,
});


const Post = mongoose.model('Post', postSchema);


const samplePosts = [
    {
        // id: 1,
        title: 'Sample Post 1',
        author: 'John Doe',
        date: new Date(),
        content: 'This is the content of the first blog post...',
        excerpt: 'A short excerpt of the first blog post...',
    },
    {
        // id: 2,
        title: 'Sample Post 2',
        author: 'Jane Doe',
        date: new Date(),
        content: 'This is the content of the second blog post...',
        excerpt: 'A short excerpt of the second blog post...',
    },
];


Post.insertMany(samplePosts)
    .then(() => {
        console.log('Sample posts inserted into the database');
    })
    .catch(error => {
        console.error('Error inserting sample posts:', error);
    });

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/blog', (req, res) => {
    
    Post.find()
        .then(posts => {
            res.render('blog', { posts });
        })
        .catch(error => {
            console.error('Error retrieving posts from the database:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.get('/post/:postId', (req, res) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                res.status(404).render('404');
            } else {
                res.render('post', { post });
            }
        })
        .catch(error => {
            console.error('Error retrieving post from the database:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.get('/posts/:postId/edit', (req, res) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                res.status(404).render('404');
            } else {
                res.render('edit', { post });
            }
        })
        .catch(error => {
            console.error('Error retrieving post for edit from the database:', error);
            res.status(500).send('Internal Server Error');
        });
});


app.post('/posts/:postId', (req, res) => {
    const postId = req.params.postId;
    
    Post.findByIdAndUpdate(postId, {
        title: req.body.title,
        content: req.body.content,
    }, { new: true })
        .then(updatedPost => {
            if (!updatedPost) {
                res.status(404).render('404');
            } else {
                res.redirect(`/post/${updatedPost._id}`);
            }
        })
        .catch(error => {
            console.error('Error updating post in the database:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.get('/about', (req, res) => {
    res.render('about');
});

// 404 route
app.use((req, res) => {
    res.status(404).render('404');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});





// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();
// const port = process.env.PORT || 3000;

// app.set('view engine','ejs');
// app.use(express.static('public'));
// app.use(express.urlencoded({ extended: true }));

// // mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

// async function createDbAndCollection() {
//     const dbName = 'Bharat-internship';
//     const collectionName = 'Posts';
//     const url = `mongodb://localhost:27017/${dbName}`;

//     try {
//         await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log("Connected successfully to server");

//         const postSchema = new mongoose.Schema({
//             title: String,
//             author: String,
//             date: { type: Date, default: Date.now },
//             content: String,
//             excerpt: String,
//         });
           
//         const MyModel = mongoose.model(collectionName, postSchema); 
        
//         const samplePosts = new MyModel([
//             {
//                 title: 'Sample Post 1',
//                 author: 'John Doe',
//                 date: new Date(),
//                 content: 'This is the content of the first blog post...',
//                 excerpt: 'A short excerpt of the first blog post...',
//             },
//             {
//                 title: 'Sample Post 2',
//                 author: 'Jane Doe',
//                 date: new Date(),
//                 content: 'This is the content of the second blog post...',
//                 excerpt: 'A short excerpt of the second blog post...',
//             },
//         ]);
//         samplePosts.save();   


//         console.log(`Collection ${collectionName} created in database ${dbName}`);
//     } catch (err) {
//         console.error(err.stack);
//     } finally {
//         await mongoose.connection.close();
//     }
// }

// createDbAndCollection();
  

// // Create the Post model
// // const Post = mongoose.model('Post', postSchema);

// // Sample data (you can replace this with actual data from your database)


// app.use(express.static('public'));

// app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//     res.render('blog', { posts: samplePosts });
// });

// app.get('/post/:postId', (req, res) => {
//     const postId = req.params.postId;
//     const post = samplePosts.find(post => post._id === postId);

//     if (!post) {
//         res.status(404).render('404');
//     } else {
//         res.render('post', { post });
//     }
// });
// app.get('/blog/:postId', async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.postId);
//         res.render('blog', { post });
//     } catch (error) {
//         // Handle errors
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });


// app.use((req, res) => {
//     res.status(404).render('404');
// });

// app.listen(port, () =>{
//     console.log(`Server is running on http://localhost:${port}`)
// })
