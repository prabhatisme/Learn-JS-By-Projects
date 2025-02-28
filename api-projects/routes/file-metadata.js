import express from 'express'
const router  = express.Router();
import multer from 'multer';
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5*1024*1024 }
});

router.post('/fileanalyse', upload.single('upfile'), (req, res) => {
    if(!req.file) {
        return res.status(400).json({error: "no file uploaded"})
    }
    res.json({
        name:req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
    })
})
export default router;