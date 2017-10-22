/** // Arbitrary log messages. 'critical' is most severe; 'debug' is least. 
Rollbar.critical("Connection error from remote Payments API");
Rollbar.error("Some unexpected condition");
Rollbar.warning("Connection error from Twitter API");
Rollbar.info("User opened the purchase dialog");
Rollbar.debug("Purchase dialog finished rendering");
 
// Can include custom data with any of the above. 
Rollbar.info("Post published", {postId: 123});
 */

const Rollbar = require('rollbar');
console.log(process.env.ROLLBAR_KEY);
const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_KEY,
  handleUncaughtExceptions: true,
  handleUnhandledRejections: true,
  payload: {
    environment: process.env.NODE_ENV,
    name: 'Reddit Newsletter'
  }
});

module.exports = rollbar;
