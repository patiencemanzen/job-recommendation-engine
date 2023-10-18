import express from 'express';
import bodyParser from "body-parser";
import router from './Routes/api.js';
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/', router);

app.listen(port, () => console.log(`Server is running on port ${port}`));
