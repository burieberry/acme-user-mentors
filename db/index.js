const Sequelize = require('sequelize');
const conn = require('./conn'),
      User = require('./user'),
      Award = require('./award');

const sync = () => {
  return conn.sync({ force: true });
}

Award.belongsTo(User);

const seed = () => {
  return Promise.all([
    User.create({ name: 'Curly', has_mentor: true, is_mentor: false, awards: 0 }),
    User.create({ name: 'Larry', has_mentor: true, is_mentor: false, awards: 2 }),
    User.create({ name: 'Moe', has_mentor: false, is_mentor: true, awards: 3 }),
    User.create({ name: 'Shep', has_mentor: false, is_mentor: false, awards: 1 })
  ])
  .then(([ curly, larry, moe, shep ]) => {
    return Promise.all([
      Award.create({ title: 'Excellence', userId: larry.id }),
      Award.create({ title: 'Greatness', userId: larry.id }),
      Award.create({ title: 'Punctual', userId: moe.id }),
      Award.create({ title: 'Amazing', userId: moe.id }),
      Award.create({ title: 'The Best', userId: moe.id }),
      Award.create({ title: 'Persistent', userId: shep.id })
    ])
  })
  .catch(err => {
    console.log(err);
  });
};

module.exports = {
  sync,
  seed,
  models: {
    User,
    Award
  }
};
