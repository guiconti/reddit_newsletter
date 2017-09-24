const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

let PostSchema = new Schema({
    id: {type: String, required: true},
    title: {type: String, required: true},
    url: {type: String, required: true}
});

mongoose.model('Post', PostSchema);