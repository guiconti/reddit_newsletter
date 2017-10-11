/**
 * Module to create an inline telegram keyboard
 * @module controllers/createTelegramKeyboard
 */

module.exports = (postId) => {
  const likeButton = JSON.stringify({
    type: 'reddit',
    postId: postId, 
    value: 1
  });
  const dislikeButton = JSON.stringify({
    type: 'reddit',
    postId: postId,
    value: -1
  });
  const inline_keyboard = [
    [{ text: '\u{1F44D}' , callback_data: likeButton }, { text: '\u{1F44E}' , callback_data: dislikeButton }]
  ];
  const options = {
    reply_markup: {inline_keyboard}
  };
  return options;
};
