const Sequelize = require('sequelize');
const conn = require('./conn');
// const faker = require('faker');

const User = conn.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // awards: {
  //   type: Sequelize.ARRAY(Sequelize.JSON),
  //   defaultValue: [{ content: '', awardId: {
  //     set: function(val) {
  //       return val = Sequelize.INTEGER;
  //     }
  //   }}],
  // },
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

// User.generateAward = function(id) {
//   return this.findById(id)
//     .then(user => {
//       user.awards.push({
//         content: faker.company.catchPhrase(),
//         awardId: Math.round(Math.random() * 1000)
//       });
//       user.update({
//         awards: user.awards
//       })
//       return user;
//     })
//     .then(user => {
//       return user.save();
//     });
// }


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
