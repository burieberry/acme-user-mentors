const Sequelize = require('sequelize');
const conn = require('./conn'),
      faker = require('faker');

const User = conn.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mentorId: {
    type: Sequelize.INTEGER
  }
}, {
  validate: {
    noName() {
      if (!this.name.length) {
        throw new Error('Name is required!');
      }
    }
  }
});


User.findUsersViewModel = function() {
  let viewModel = {};
  return this.findAll({
    include: [
      { model: User, as: 'mentor' },
      { model: User, as: 'mentees' }
    ]
  })
    .then(users => {
      viewModel.users = users;
      return conn.models.award.findAll()
    })
    .then(awards => {
      viewModel.awards = awards;
      return viewModel;
    });
};

User.destroyById = function(id) {
  return this.findById(id)
    .then(user => {
      return user.destroy();
    })
    .then(() => {
      return conn.models.award.destroy({
        where: {
          userId: null
        }
      })
    })
};

User.generateAward = function(id) {
  return this.findById(id)
    .then(user => {
      return conn.models.award.create({ content: faker.company.catchPhrase(), userId: user.id })
        .then(award => {
          return user.addAward(award);
        });
      });
};

User.removeAward = function(userId, id) {
  return this.findById(userId)
    .then(user => {
      return user.removeAward(id);
    })
    .then(() => {
      return conn.models.award.findById(id)
        .then(award => {
          return award.destroy();
        });
    });
};

// User.updateUserFromRequestBody = function() {}

module.exports = User;
