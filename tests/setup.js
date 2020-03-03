require('../models/User');
const mongoose = require('mongoose');
const keys = require('../config/keys');

// We are telling mongoose to make use of the NodeJS global Promise Object
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });