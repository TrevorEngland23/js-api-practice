import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express(); // use express
const port = 3000; // server port
const API_URL = "http://localhost:4000"; // api url:port

app.use(express.static("public")); // not sure. something about static files being served by the specified path.

app.use(bodyParser.urlencoded({ extended: true })); // enables us to use bodyparser to parse request body
app.use(bodyParser.json()); // Allows us to parse incoming json

// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`); // try to get the home page
    console.log(response);
    res.render("index.ejs", { posts: response.data }); // render the response
  } catch (error) { // if error 
    res.status(500).json({ message: "Error fetching posts" }); // if server error display a user friendly message
  }
});

// Route to render the new post page
app.get("/new", (req, res) => { // get the new post page
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" }); // render modify.ejs based on these specifications
});

app.get("/edit/:id", async (req, res) => { // try to get the edit post page
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`); // at this url
    console.log(response.data); 
    res.render("modify.ejs", { // render modify ejs with these specifications
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) { // unless server error
    res.status(500).json({ message: "Error fetching post" }); // show user friendly message in that case
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body); // when user tries to create new post, follow this path
    console.log(response.data); 
    res.redirect("/"); // if successful, redirect to homepage, post should show up
  } catch (error) { // otherwise
    res.status(500).json({ message: "Error creating post" }); // show error message
  }
});

// Partially update a post
app.post("/api/posts/:id", async (req, res) => { // edit post
  // console.log("called");
  try {
    const response = await axios.patch(
      `${API_URL}/posts/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
