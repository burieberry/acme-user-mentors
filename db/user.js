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
});

User.findUsersViewModel = function() {
  let viewModel = {};
  return this.findAll()
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
    });
}

User.generateAward = function(id) {
  return this.findById(id)
    .then(user => {
      conn.models.award.create({ content: faker.company.catchPhrase(), userId: user.id })
        .then(award => {
          return user.addAwards(award);
        });
      });
}


// User.removeAward = function(userId, id) {
//   return this.findById(userId)
//     .then(user => {
//       const index = user.awards.findIndex((award) => {
//         if (award.awardId === id * 1) {
//           return award;
//         }
//       });
//       user.awards.splice(index, 1);
//       user.update({
//         awards: user.awards
//       });
//       return user;
//     })
//     .then(user => {
//       return user.save();
//     });
// }

// User.updateUserFromRequestBody = function() {}

module.exports = User;
