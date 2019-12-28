const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

// APP CONFIG
mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true})
app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))

// MONGOOSE/MODEL CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
const Blog = mongoose.model('Blog', blogSchema)

// RESTFUL ROUTES

app.get('/', (req, res) => res.redirect('/blogs'))

// INDEX ROUTE
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("ERROR")
        } else {
            res.render('index', {blogs: blogs})
        }
    })
})

// NEW ROUTE
app.get('/blogs/new', (req, res) => res.render('new'))

// CREATE ROUTE
app.post('/blogs', (req, res) => {
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render('new')
        } else {
            res.redirect('/blogs')
        }
    })
})

// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.render('show', {blog: foundBlog})
        }
    })
})

// EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.render('edit', {blog: foundBlog})
        }
    })
})

// UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs/' + req.params.id)
        }
    })
})

app.listen(3000, () => console.log('Server is running'))