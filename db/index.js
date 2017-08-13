const Sequelize = require('sequelize');
const conn = require('./conn'),
      User = require('./user'),
      Award = require('./award'),
      seed = require('./seed');

const sync = () => {
  return conn.sync({ force: true });
}

module.exports = {
  sync,
  seed,
  models: {
    User,
    Award
  }
};
