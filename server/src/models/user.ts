import mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema( {
    name: { type:String, default: '' },
    password:{ type:String, default: ''}
}));