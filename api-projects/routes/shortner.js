import express from 'express'
const router  = express.Router();
let urlDatabase = {};
let id = 1;

router.post('/shorturl', (req, res) => {
    const originalUrl = req.body.url;
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(originalUrl)) {
        return res.json({ error: 'invalid url' });
    }

    urlDatabase[id] = originalUrl;
    res.json({ original_url: originalUrl, short_url: id });
    id++;
})

router.get('/shorturl/all', (req,res) => {
    res.json(urlDatabase);
})

router.get('/shorturl/:shorturl', (req, res) => {
    const shortUrl = req.params.shorturl;
    const originalUrl = urlDatabase[shortUrl];

    if(originalUrl){
        res.redirect(originalUrl);
    } else {
    res.json({
        error: "No URL Found"
        })
    }
})
export default router;