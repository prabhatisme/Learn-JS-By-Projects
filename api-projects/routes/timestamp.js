import express from 'express';
const router = express.Router();

router.get('/whoami', (req, res)=> {
    res.json({
        ipAddress : req.ip,
        language: req.headers['accept-language'],
        software: req.headers['user-agent']
    })
})

router.get("/:date?", (req, res) => {
    const dateParam = req.params.date;
    let date;
    
    if (!dateParam) {
        date = new Date();
      } else if (!isNaN(dateParam)) {
        date = new Date(parseInt(dateParam));
      } else {
        date = new Date(dateParam);
    }

    if (date.toString() === "Invalid Date") {
        return res.json({ error: "Invalid Date" });
    }

    function getISTTimeString(){
        let istOffset = 5.5 * 60 * 60 * 100;
        let istTime = new Date(date.getTime() + istOffset);
        return istTime.toUTCString().replace('GMT', 'IST')
    }
    res.json({
        unix: date.getTime(),
        utc: getISTTimeString()
    })
})

export default router;