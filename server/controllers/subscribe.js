/**
 * Módulo para observar um subreddit para um canal
 * @module bot/reddit/subscribeToSubreddit
 */
const _ = require('underscore');
const constants = require('../utils/constants');
const validation = require('../utils/validation');
const getPosts = require('./getPosts');

//  TODO: Send this to a database
let savedPosts = [];

/**
 * Subscribe an endpoint to a new subreddit
 *
 * @param {string} req.body.subreddit - Subreddit name
 * @param {integer} req.body.chatId - Telegram chat id TODO: Encapsulate this in an api key
 * @return {Promise.NULL} - Uma promise que resolve caso o timer seja inserido
 * @throws {Error} - Rejeita a promise com o erro ocorrido
 */
module.exports = (req, res) => {

  let body = _.pick(req.body, 'subreddit', 'chatId');
  if(!validation.isValidString(body.subreddit)) return res.status(400).json({
    error: constants.messages.error.INVALID_SUBREDDIT
  });
  if(!validator.isValidNumber(body.chatId)) return res.status(400).json({
    error: constants.messages.error.INVALID_CHATID
  });

  try {
    if (savedPosts[body.subreddit]){
      if (savedPosts[body.subreddit].subscriptions.includes(body.chatId)){
        return res.status(400).json({
          error: constants.messages.error.ALREADY_SUBSCRIBED
        });
      }
      //  In case we have the subreddit in our data base we only subscribe this chat id to it
      savedPosts[body.subreddit].subscriptions.push(body.chatId);
    } else {
      //  If we don`t have this subreddit yet in our database we create a new subreddit subscription
      savedPosts[body.subreddit] = {
        name: body.subreddit,
        posts: [],
        subscriptions: [body.chatId]
      };
    }
    getPosts(body.subreddit).then((formattedPosts) => {
      savedPosts[body.subreddit].posts = formattedPosts;
      return res.status(200).json(formattedPosts);
    }, (err) => {
      return res.status(400).json(err);
    });
  } catch (err) {
    return res.status(500).json({
      error: constants.messages.error.UNEXPECTED
    });
  }
  
};

function getNewsFromSubreddit(subreddit, chatId) {
  return new Promise((resolve, reject) => {
    if (!savedPosts[subreddit]){
      let message = {
        fail: 'Você não está inscrito nesse subreddit'
      }
      return resolve(message);
    }
    getPostsFromSubreddit(subreddit).then((formattedPosts) => {
      let newPosts = getNewPosts(subreddit, formattedPosts);
      savedPosts[subreddit].posts = formattedPosts;
      return resolve(newPosts);
    }, (err) => {
      return reject(err);
    });
  });
};

function getNewPosts(subreddit, newPosts) {
  if (!savedPosts[subreddit].posts){
    return newPosts;
  }
  let postsToSend = [];
  newPosts.forEach((post) => {
    if (savedPosts[subreddit].posts.findIndex((savedPost) => {
      return savedPost.id == post.id;
    }) == -1){
      postsToSend.push(post);
    }
  });
  return postsToSend;
}

function getSubscriptions(chatId) {
  return new Promise((resolve, reject) => {
    try {
      let subscriptions = [];
      for (let key in savedPosts){
        if (savedPosts[key].subscriptions.includes(chatId)){
          subscriptions.push(key);
        }
      }
      return resolve(subscriptions);
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
}

module.exports = {
  subscribeToSubreddit: subscribeToSubreddit,
  getNewsFromSubreddit: getNewsFromSubreddit,
  getSubscriptions: getSubscriptions
};
