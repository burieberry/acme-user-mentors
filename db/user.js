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
  },
  awardCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
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
      return conn.models.award.create({ content: faker.company.catchPhrase(), userId: user.id })
        .then(award => {
          user.increment('awardCount', { by: 1 });
          return user.addAward(award);
        });
      });
};

User.removeAward = function(userId, id) {
  return this.findById(userId)
    .then(user => {
      user.decrement('awardCount', { by: 1 });
      return user.removeAward(id);
    })
    .then(() => {
      this.findById(userId, {
        include: [
          { model: User, as: 'mentees' }
        ]
      })
      .then(user => {
        if (user.awardCount < 2 && user.mentees) {
          user.mentees.map((mentee) => {
            mentee.mentorId = null;
            return mentee.save();
          })
        }
      })
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

// TODO:
// write tests
// set Mentor box should only appear if there're mentors available
