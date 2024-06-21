import express from "express";

const app = express();
const port = 3000;

// objects array, to store the posts made
let blogPosts = [];

// flag to toggle when edit button is pressed
let edited = false;

/* flag set to -1 to change the form in ejs, editing the selected 
post, also used as index to select the correct post from the blogs
post array */
let postIdNum = -1;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", { num: postIdNum, posts: blogPosts });
});

app.post("/submit", (req, res) => {
    // capture values from form
    const titleText = req.body.titleText;
    const bodyText = req.body.bodyText;
    const postMade = new Date();

    // make the blogpost object and send to array
    let data = {
        title: titleText,
        content: bodyText,
        postDate: postMade.toUTCString(),
        edit: edited
    }

    blogPosts.push(data);
    res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
    /* get index for post selected from loop in ejs
    use index to remove post from the array */
    const postId = req.params.id;
    blogPosts.splice(postId, 1);
    res.redirect("/");
});

app.post("/edit/:id", (req, res) => {
    const postId = req.params.id;

    /* change the flag/index to the id/index of the 
    post selected */
    postIdNum = postId;

    res.redirect("/");
});

app.post("/editSubmit/:id", (req, res) => {
    // toggle flag to true when edit button pressed 
    edited = true;

    /* get index for post selected from ejs editForm
    use index to overwrite post from the array */
    const postId = req.params.id;
    blogPosts[postId].title = req.body.titleText;
    blogPosts[postId].content = req.body.bodyText;
    blogPosts[postId].postDate = new Date().toUTCString();
    blogPosts[postId].edit = edited;
    res.redirect("/");

    /* change the flag/index to default so 
    editForm is not chosen in ejs */
    postIdNum = -1;
});

app.listen(port, () => {
    console.log("Server is listening at port " + port);
});