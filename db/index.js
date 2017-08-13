const Sequelize = require('sequelize');
const conn = require('./conn'),
      User = require('./user'),
      Award = require('./award'),
      seed = require('./seed');

const sync = () => {
  return conn.sync({ force: true });
}

// associations:
User.belongsTo(User, { as: 'mentor' });
User.hasMany(User, { as: 'mentees', foreignKey: 'mentorId' });
User.hasMany(Award);
Award.belongsTo(User, { as: 'mentor' });
Award.belongsTo(User, { as: 'mentees' });

module.exports = {
  sync,
  seed,
  models: {
    User,
    Award
  }
};
