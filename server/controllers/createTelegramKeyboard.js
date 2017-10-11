/**
 * Module to create an inline telegram keyboard
 * @module controllers/createTelegramKeyboard
 */

module.exports = (subreddit, postId) => {
  /**
   * We have to use poor object name because telegram does not support too manyu characters
   * on keyboards callback_data
   */
  const likeButton = JSON.stringify({
    t: 'reddit',
    s: subreddit,
    p: postId,
    v: 1
  });
  const dislikeButton = JSON.stringify({
    t: 'reddit',
    s: subreddit,
    p: postId,
    v: -1
  });
  const inline_keyboard = [
    [{ text: '\u{1F44D}' , callback_data: likeButton }, { text: '\u{1F44E}' , callback_data: dislikeButton }]
  ];
  const options = {
    reply_markup: {inline_keyboard}
  };
  return options;
};
