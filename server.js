const express = require('express')
const axios = require('axios')
require('dotenv').config()

const blogRoutes = require('./Routes/Blogs')
const app = express()

app.use(express.json())

app.use('/api', blogRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server started at port number ${PORT}`)
})





