const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Vis');
// mongoose.connect('mongodb://localhost:27017/test');

module.exports = {mongoose};
