const express = require('express')
const { getBlogs, blogSearch } = require('../Controllers/Blogs')
const Router = express.Router()

Router.get('/blog-stats', getBlogs)
Router.get('/blog-search', blogSearch)

module.exports = Router;
