const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const redis = require('redis');
const util = require('util');

const Blog = mongoose.model('Blog');
const redisUrl = 'redis://127.0.0.1:6379';

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const userId = req.user.id;
    const client = redis.createClient(redisUrl);
    // Using util.promisify to promisify client.get function so that we can handle this function like promise and not callbacks
    // assigning promisified function to current client.get, makes the function to return a promise 
    client.get = util.promisify(client.get);
    // Do we have any cached data in redis related to this query?
    const cachedBlogs = await client.get(userId);
    // If yes, then respond to the request right away and return
    if (cachedBlogs) {
      console.log('SERVING FROM CACHE');
      return res.send(JSON.parse(cachedBlogs));
    }
    // If no, we need to respond to request and update our cache to store the data
    console.log('SERVING FROM MONGODB');
    const blogs = await Blog.find({ _user: req.user.id });
    res.send(blogs);
    client.set(userId, JSON.stringify(blogs));
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
