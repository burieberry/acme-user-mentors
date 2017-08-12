const Sequelize = require('sequelize');
const conn = require('./conn');
const faker = require('faker');

const User = conn.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  awards: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: []
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
    });
};

User.destroyById = function(id) {
  return this.findById(id)
    .then(user => {
      return user.destroy();
    });
}

User.generateAward = function(id) {
  return this.findById(id)
    .then(user => {
      console.log(user.awards);
      user.awards.push(faker.company.catchPhrase());
      user.update({
        awards: user.awards
      })
      return user;
    })
    .then(user => {
      return user.save();
    })
    .catch(console.error)
}

// User.updateUserFromRequestBody = function() {}
// User.removeAward = function() {}

module.exports = User;
