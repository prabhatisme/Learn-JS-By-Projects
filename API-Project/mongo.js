//bash: npm install mongoose
const mongoose = require('mongoose');

// Connect to MongoDB (replace 'your_connection_string' with your MongoDB URI)
mongoose.connect('your_connection_string', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, required: true, unique: true }
});

const Url = mongoose.model('Url', urlSchema);  


//start
let currentId = 1; // To generate short URLs sequentially

app.post('/api/shorturl', async (req, res) => {
  const originalUrl = req.body.url;

  // Validate the URL format
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  try {
    // Check if the URL already exists in the database
    let existingUrl = await Url.findOne({ original_url: originalUrl });
    if (existingUrl) {
      return res.json({
        original_url: existingUrl.original_url,
        short_url: existingUrl.short_url
      });
    }

    // If not, save a new entry
    const newUrl = new Url({
      original_url: originalUrl,
      short_url: currentId++
    });

    await newUrl.save();

    res.json({
      original_url: newUrl.original_url,
      short_url: newUrl.short_url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/shorturl/all', async (req, res) => {
    try {
      const allUrls = await Url.find();
      res.json(allUrls);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });


app.get('/api/shorturl/:shorturl', async (req, res) => {
    const shortUrl = req.params.shorturl;
  
    try {
      // Find the original URL using the short_url
      const urlEntry = await Url.findOne({ short_url: shortUrl });
  
      if (urlEntry) {
        return res.redirect(urlEntry.original_url);
      } else {
        res.json({ error: 'No short URL found for the given input' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  //sample-data 
  /*
  {
    "_id": "64b8e6c3e199cc001f0c8a41",
    "original_url": "https://www.google.com",
    "short_url": 1,
    "__v": 0
  }*/