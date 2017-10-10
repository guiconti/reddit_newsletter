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
      url: {type: String, required: true},
      redditScore: {type: Number, required: true, default: 0},
      comments: {type: Number, required: true, default: 0},
      crossposts: {type: Number, required: true, default: 0},
      internalScore: {type: Number, required: true, default: 0}
    }]
});

mongoose.model('Subreddit', SubredditSchema);