const Sequelize = require('sequelize');
const conn = require('./conn');

const Award = conn.define('award', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Award;
