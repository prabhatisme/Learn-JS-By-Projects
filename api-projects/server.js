import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './mongo.js';
import timestampRouter from './routes/timestamp.js';
import shortnerRouter from './routes/shortner.js';
import exerciseRouter from './routes/exercise-tracker.js';
import fileMetadataRouter from './routes/file-metadata.js';

let app = express();
//middlewares
connectDB();
app.use(cors());
app.use(cors({optionsSuccessStatus:200}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/public/index.html')
});

app.use('/api/hello', (req, res)=>{
    res.json({greeting: 'hello api'});
})

// API endpoints
app.use('/api', timestampRouter);
app.use('/api', shortnerRouter);
app.use('/api', exerciseRouter);
app.use('/api-project/api', fileMetadataRouter);

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});