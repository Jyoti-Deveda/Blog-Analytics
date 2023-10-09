const axios = require('axios')
const lodash = require('lodash')

//Creating an axios instance
const axiosInstance = axios.create({})

const apiCall = async () => {
    try{  
        //headers with secret key
        const headers = {
            'x-hasura-admin-secret': process.env.ADMIN_SECRET
        }

        const res = await axiosInstance({
            url: process.env.API_URL,
            method: 'GET',
            headers: headers,
        })

        //returning the response
        const blogs = res.data
        // console.log("response ", blogs)
        return blogs;
    }
    catch(err){
        console.log("Could not make a successfull API call!!")
        console.log("Error ", err);
    }
}

exports.getBlogs = async (req, res) => {
    try{
        //step 1: fetching blogs
        const data = await apiCall();
        // console.log("length ", blogs.blogs.length);

        //step 2: getting the blog size
        const blogs = data.blogs
        // console.log(typeof(blogs))

        const totalNoOfBlogs = lodash.size(blogs)
        // console.log("total blogs: ", totalNoOfBlogs)

        //step 3: getting the longest title
        let maxLenTitleBlog = blogs[0]
        // console.log(maxLenTitleBlog)
        lodash.forEach(blogs, element => {
            let currLen = element.title.length
            maxLenTitleBlog = currLen > maxLenTitleBlog.title.length ? element : maxLenTitleBlog 
        });

        //step 4: finding the blogs whose title contains 'privacy'
        const blogsWithSpecificTitle = lodash.filter(blogs,  (blog) => {
            const title = lodash.toLower(blog.title)
            return lodash.includes(title, 'privacy')
        })
        // console.log("Blogs with title containing privacy ", blogsWithSpecificTitle.length);

        //step 5: creating an array of unique blogs
        const uniqueBlogTitles = [] 
        lodash.forEach(blogs, (blog) => {
            if(!lodash.includes(uniqueBlogTitles, lodash.capitalize(blog.title)))
                uniqueBlogTitles.push(lodash.capitalize(blog.title))
        })
        // console.log("Unique Title blogs ", uniqueBlogTitles.length)

        res.status(200).json({
            success: true,
            totalNoOfBlogs, 
            longestTitle: maxLenTitleBlog.title,
            noOfBlogsWithPrivacyInTitle: blogsWithSpecificTitle.length,
            uniqueBlogTitles
        })

        
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message,
            message: "Could not fetch the blogs"
        })
    }
}

exports.blogSearch = async(req, res) => {
    try{
        //fetching all the blogs
        const data = await apiCall()
        const blogs = data.blogs

        //step 1: getting the search query from request
        const query = req.query.query
        console.log("Query ", query)
        const searchQuery = lodash.toLower(query)

        //step 2: filtering out the blogs as per the query
        const filteredBlogs = lodash.filter(blogs, (blog) => {
            const title = lodash.toLower(blog.title)
            return lodash.includes(title, searchQuery)
        })

        res.status(200).json({
            success: true,
            filteredBlogs,
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            error: err.message,
            message: "Could not search the blog"
        })
    }

}