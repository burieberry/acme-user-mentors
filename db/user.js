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
}, {
  timestamps: false
});

User.findUsersViewModel = function() {
  let viewModel = {};
  return Promise.all([
    this.findAll({
      include: [
        { model: User, as: 'mentor' },
        { model: User, as: 'mentees' }
      ]
    }),
    conn.models.award.findAll()
  ])
    .then(([ users, awards ]) => {
      viewModel.users = users;
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
    });
};

User.generateAward = function(id) {
  return this.findById(id)
    .then(user => {
      return conn.models.award.create({
          content: faker.company.catchPhrase(),
          userId: user.id
        })
      })
};

User.removeAward = function(userId, awardId) {
  return conn.models.award.destroy({ where: { id: awardId }})
    .then(() => {
      return User.findById(userId, {
        include: [ conn.models.award ]
      })
    })
    .then(user => {
      if (user.awards.length < 2) {
        return User.update(
          { mentorId: null },
          { where: { mentorId: userId }}
        )
      }
    })
};

User.updateUserFromRequestBody = function(id, requestBody) {
  return this.findById(id)
    .then(user => {
      user.mentorId = user.mentorId ? null : requestBody.id;
      return user.save();
    });
};

module.exports = User;
