/**
 * Módulo de que contém todas as constantes do app
 * @module utils/constants
 */

module.exports = {
  urls: {
    REDDIT_PREFIX: 'https://www.reddit.com/r/',
    REDDIT_SUFFIX: '.json',
    GIBOT: process.env.GIBOT_URL
  },
  messages: {
    error: {
      INVALID_SUBREDDIT: 'Subreddit informado não é válido.',
      NON_EXISTENT_SUBREDDIT: 'Subreddit informado não existe.',
      ALREADY_SUBSCRIBED: `Você já se inscreveu nesse subreddit.\n
      Se você quiser receber as novidades agora desse subreddit "/reddit news (subreddit)" sem ()`,
      INVALID_CHATID: 'Esse chat id não é válido.',
      UNEXPECTED: 'Um erro que nem a gente previu aconteceu, tente falar com algum admin do projeto.'
    },
    info: {
      NO_NEW_POSTS: 'Não há nenhum novo post na primeira página desse subreddit desde a última atualização enviada.',
      NEW_POSTS: 'Novos posts para o subreddit ',
      NO_SUBSCRIPTIONS: 'Esse chat não está inscrito em nenhum subreddit.',
      SUBSCRIPTIONS: 'Esse chat está inscrito no(s) subreddit(s)\n'
    }
  },
  values: {
    HOURS_TO_UPDATE: 1
  }
};
