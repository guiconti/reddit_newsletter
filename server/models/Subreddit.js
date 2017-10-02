const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

let SubredditSchema = new Schema({
    name: {type: String, required: true},
    subscriptions: [{
      type: Number,
      required: true
    }],
    posts: [{
      id: {type: String, required: true},
      title: {type: String, required: true},
      url: {type: String, required: true}
    }]
});

mongoose.model('Subreddit', SubredditSchema);