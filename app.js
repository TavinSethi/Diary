const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/diary', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1) ,
        day = '' + d.getDate(),
        year = d.getFullYear();



    return [year, month, day].join('-');
};
const postSchema = new mongoose.Schema({
  title: String,
  date: {
    type: String,
      required: true,
      set: date => formatDate(date)
  },
  body: String,
  author: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      posts: posts
    })
  });
});

app.get("/compose", function(req, res) {
  res.render("compose")
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    date: req.body.postDate,
    body: req.body.postBody,
    author: req.body.postAuthor
  });
  post.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/")
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const postId = req.params.postId;

  Post.findById(postId, function(err, post){
    res.render("post", {
      title: post.title,
      date: post.date,
      body: post.body,
      author: post.author
    })
  })
});

app.get("/about", function(req, res) {
  res.render("about")
});

app.listen("3000", function() {
  console.log("server running at port 3000");
});
