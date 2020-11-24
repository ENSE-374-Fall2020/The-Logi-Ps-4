// PURPOSE: clear and initialize list of sample posts

const dbObjects = require(__dirname + "/dbObjects.js");
const Post = dbObjects.Post;

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/progressDB",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

console.log("connected to progressDB");

async function destroyPostCollection() {
    // destroy existing collection of posts

    await Post.deleteMany({}, function (err) {
        if (err) console.log("Error in deleting existing collection");
        else console.log("Collection 'posts' destroyed");
    });
}

async function generatePostCollection() {
    const post1 = new Post({
        _id: 1,
        creator: "Farquaad",
        content: "This is a post by Lord Farquaad",
        title: "Best Post in the World"
    });
    await post1.save();

    const post2 = new Post({
        _id: 2,
        creator: "abcMan",
        content: "Wow by golly this workout changed my life",
        title: "#LifeChanger"
    });
    await post2.save();

    await mongoose.connection.close();



    console.log("Post list created successfully");
}



destroyPostCollection();
generatePostCollection();

exports.destroyPostCollection = destroyPostCollection;
exports.generatePostCollection = generatePostCollection;
