require('dotenv').config();
var express = require('express');
var app = express();
var cors = require('cors');
const bodyParser = require('body-parser');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 

app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// http://expressjs.com/en/starter/static-files.html
app.use('/public', express.static(`${process.cwd()}/public`));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api/shorturl/3', function(req, res) {
  res.send("https://forum.freecodecamp.org/");
});

/*
app.get("/api/:dateParam", function(req, res) {

  let dateParam = req.params.dateParam;

  if (/^\d{5,}$/.test(dateParam))
    dateParam = parseInt(dateParam);
    
  const date = new Date(dateParam);

  if (date.toString() == "Invalid Date") {

    res.json({
      "error": "Invalid Date"
    });

  } else {

    res.json({
      "unix": date.valueOf(),
      "utc": date.toUTCString()
    });

  }
}); */

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

  // Return JSON response
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString(),
  });
});



//whoami api
app.get("/api/whoami", (req, res) => {
  const ip = req.socket.localAddress;
  const language = req.headers['accept-language'];
  const software = req.headers['user-agent'];
  console.log(ip);
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


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
