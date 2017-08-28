const Sequelize = require('sequelize');
const conn = require('./conn');

const Award = conn.define('award', {
  content: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Award;
