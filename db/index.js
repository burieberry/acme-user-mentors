const Sequelize = require('sequelize');
const conn = require('./conn'),
      User = require('./user'),
      Award = require('./award'),
      seed = require('./seed');

const sync = () => {
  return conn.sync({ force: true });
}

Award.belongsTo(User, { as: 'mentor' });
Award.belongsTo(User, { as: 'mentees' });
User.hasMany(Award);
// User.belongsTo(Award, { constraints: false });

module.exports = {
  sync,
  seed,
  models: {
    User,
    Award
  }
};
