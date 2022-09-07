require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(
  fileupload({
    useTempFiles: true,
  })
);

// Connect to mongodb
const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('Connected to MongoDB');
  }
);

routes(app);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
