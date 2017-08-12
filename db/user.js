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

module.exports = User;
