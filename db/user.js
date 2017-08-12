const Sequelize = require('sequelize');
const conn = require('./conn');

const User = conn.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  has_mentor: {
    type: Sequelize.BOOLEAN
  },
  is_mentor: {
    type: Sequelize.BOOLEAN
  },
  awards: {
    type: Sequelize.INTEGER
  }
});

User.findUsersViewModel = function() {
  return this.findAll()
    .then(users => {
      return users;
    })
    .then(awards => {
      return awards;
    })
    .catch(err => {
      console.log(err);
    });
};

// User.create = function() {}
// User.destroyById = function() {}
// User.updateUserFromRequestBody = function() {}
// User.generateAward = function() {}
// User.removeAward = function() {}

module.exports = User;
