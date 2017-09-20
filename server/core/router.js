const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());

const subscribe = require('../controllers/subscribe');
const subscriptions = require('../controllers/subscriptions');

//  TODO: This will be a database
savedPosts = [];

//  Placeholder API
router.get('/', (req, res) => {
  res.status(200).json({msg: 'Hi!'});
});
router.post('/subscribe', subscribe);
router.get('/subscriptions/:chatId', subscriptions);

module.exports = router;