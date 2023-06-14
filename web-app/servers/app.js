require('dotenv').config();
const authRouter = require('express').Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
// const apiResponse = require('./utils/apiResponse.js');
const network = require('./fabric/network.js');
const router = require('./routes/index.js');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

async function main() {
    await network.enrollAdmin(true, false, false, false, false);
    await network.enrollAdmin(false, true, false, false, false);
    await network.enrollAdmin(false, false, true, false, false);
    await network.enrollAdmin(false, false, false, true, false);
    await network.enrollAdmin(false, false, false, false, true);
    const app = express();
    app.use(morgan('combined'));
    app.use(bodyParser.json());
    app.use(cors());

    app.use('/', router);
    // app.use((_req, res) => {
    //     return apiResponse.notFound(res);
    // });
    app.listen(process.env.PORT);
}

main();