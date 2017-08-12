const Sequelize = require('sequelize');
const conn = require('./conn');

const User = conn.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mentorId: {
    type: Sequelize.INTEGER
  }
});

// associations:
User.belongsTo(User, { as: 'mentor' });
User.hasMany(User, { as: 'mentees', foreignKey: 'mentorId' });

User.findUsersViewModel = function() {
  let viewModel = {};
  return this.findAll()
    .then(users => {
      viewModel.users = users;
      return viewModel;
    })
};

User.destroyById = function(id) {
  return this.findById(id)
    .then(user => {
      return user.destroy();
    })
}

// User.updateUserFromRequestBody = function() {}
// User.generateAward = function() {}
// User.removeAward = function() {}

module.exports = User;
