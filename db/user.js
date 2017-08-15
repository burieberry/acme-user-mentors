const Sequelize = require('sequelize');
const conn = require('./conn'),
      faker = require('faker');

const User = conn.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: [ true ],
        msg: 'Name is required!'
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
    .catch(err => {
      throw new Error('Not allowed to delete current mentors.');
    });
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

User.updateUserFromRequestBody = function(id, requestBody) {
  return this.findById(id)
    .then(user => {
      user.mentorId = user.mentorId ? null : requestBody.id;
      return user.save();
    });
};

module.exports = User;
