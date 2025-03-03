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

app.get('/posts/new', (req, res) => {
    res.render('new');
});

app.post('/posts', (req, res) => {
    const { title, author, content, excerpt } = req.body;


    const newPost = new Post({
        title,
        author,
        content,
        excerpt,
    });

 
    newPost.save()
        .then(savedPost => {
            // alert('New post created:', savedPost);
            console.log('New post created:', savedPost);
            res.redirect('/blog'); 
        })
        .catch(error => {
            console.error('Error saving new post to the database:', error);
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
