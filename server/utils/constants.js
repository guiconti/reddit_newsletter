/**
 * Módulo de que contém todas as constantes do app
 * @module utils/constants
 */

module.exports = {
  urls: {
    REDDIT_PREFIX: 'https://www.reddit.com/r/',
    REDDIT_SUFFIX: '.json'
  },
  messages: {
    error: {
      INVALID_SUBREDDIT: 'Subreddit informado não é válido.',
      NON_EXISTENT_SUBREDDIT: 'Subreddit informado não existe.',
      ALREADY_SUBSCRIBED: `Você já se inscreveu nesse subreddit.\n
      Se você quiser receber as novidades agora desse subreddit "/reddit news (subreddit)" sem ()`,
      INVALID_CHATID: 'Esse chat id não é válido.'
    }
  }
};
