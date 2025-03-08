require('dotenv').config();
var express = require('express');
var app = express();
var cors = require('cors');
const bodyParser = require('body-parser');

const multer = require("multer"); //for file-metdate-services
const path = require("path"); //for file-metdate-services

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 

app.use(cors())
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// http://expressjs.com/en/starter/static-files.html
// app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.static('public')) //can do this way too 

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
  // res.sendFile(process.cwd() + '/views/index.html'); //also can do this way
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api/shorturl/3', function(req, res) {
  res.send("https://forum.freecodecamp.org/");
});

app.get("/api/:date?", (req, res) => {
  const dateParam = req.params.date;

  let date;

  // Handle empty date parameter
  if (!dateParam) {
    date = new Date();
  } else {
    // Handle numeric timestamp
    if (!isNaN(dateParam)) {
      date = new Date(parseInt(dateParam));
    } else {
      // Handle string date
      date = new Date(dateParam);
    }
  }

  // Check if the date is valid
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  function getISTTimeString() {
    // let now = new Date(); // Get current UTC time
    let istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30 in milliseconds
    let istTime = new Date(date.getTime() + istOffset); // Convert to IST
    return istTime.toUTCString().replace("GMT", "IST"); // Format similar to UTCString
  }

  // Return JSON response
  res.json({
    unix: date.getTime(),
    utc: getISTTimeString()
  });
});



//whoami api
app.get("/api/whoami", (req, res) => {
  const ip = req.socket.localAddress;
  const ip2 = req.ip; // client’s public IP
  const language = req.headers['accept-language'];
  const software = req.headers['user-agent'];
  console.log(ip2);
  res.json({
    ipaddress: ip,
    language: language,
    software: software
  })
});

//url shortener
let urlDatabase = {};
let id = 1;

// POST endpoint to create a shortened URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Basic validation for URL format
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Store the URL in the database with a unique ID
  urlDatabase[id] = originalUrl;
  console.log('Updated urlDatabase:', urlDatabase);

  res.json({
    original_url: originalUrl,
    short_url: id
  });

  id++;
});

//to show all the database
app.get('/api/shorturl/all', (req, res) => {
  // Log the database to the console
  console.log('Current urlDatabase:', urlDatabase);
  // Send the database as a response (optional)
  res.json(urlDatabase);
});

// GET endpoint to redirect to the original URL
app.get('/api/shorturl/:shorturl', (req, res) => {
  const shortUrl = req.params.shorturl;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});
//url shortener


/* ADD EXERCISE */
// In-memory database to store users and exercises
let users = [];
let exercises = [];

// POST endpoint to create a shortened URL
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists', _id: existingUser._id });
  }  
  const newUser = {
    username,
    _id: Math.random().toString(36).substring(7) // Generate a random ID
  };
  users.push(newUser);
  res.json(newUser);
});

// Endpoint to add exercises for a user
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  const user = users.find(user => user._id === _id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!description || !duration) {
    return res.status(400).json({ error: 'Description and duration are required' });
  }

  const exercise = {
    _id,
    username: user.username,
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString()
  };

  exercises.push(exercise);
  res.json(exercise);
});


// Endpoint to retrieve user exercise logs
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = users.find(user => user._id === _id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  let userExercises = exercises.filter(ex => ex._id === _id);

  if (from) {
    const fromDate = new Date(from);
    userExercises = userExercises.filter(ex => new Date(ex.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    userExercises = userExercises.filter(ex => new Date(ex.date) <= toDate);
  }

  if (limit) {
    userExercises = userExercises.slice(0, parseInt(limit));
  }

  res.json({
    username: user.username,
    count: userExercises.length,
    _id: user._id,
    log: userExercises.map(({ description, duration, date }) => ({
      description,
      duration,
      date
    }))
  });
});

// Endpoint to get a list of all users
app.get('/api/users', (req, res) => {
  const userList = users.map(user => ({
    username: user.username,
    _id: user._id
  }));
  res.json(userList);
});
/* ADD EXERCISE */

/* File Metadata Service */
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory buffer
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit (5MB)
});

// Handle file upload
app.post("/api-project/api/fileanalyse", upload.single("upfile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileMetadata = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  };

  res.json(fileMetadata);
});



// Listen on port set in environment variable or default to 3000
let PORT = process.env.PORT || 3000;
var listener = app.listen(PORT, function () {
  console.log(`Your app is listening on port + ${PORT}`);
});