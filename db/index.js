const Sequelize = require('sequelize');
const conn = require('./conn'),
      User = require('./user');

const sync = () => {
  return conn.sync({ force: true });
}

const seed = () => {
  return Promise.all([
    // create users
    User.create({ name: 'Curly' }),
    User.create({ name: 'Larry' }),
    User.create({ name: 'Moe' }),
    User.create({ name: 'Shep' })
  ])
  .then(([ curly, larry, moe, shep ]) => {
    // set mentors
    curly.mentorId = moe.id,
    larry.mentorId = moe.id
  })
  .then(() => {
    const options = {
      include: [
        { model: User, as: 'mentee' },
        { model: User, as: 'mentor' }
      ]
    };

    // get the data with associations
    return Promise.all([
      User.findById(curly.id, options),
      User.findById(larry.id, options),
      User.findById(moe.id, options),
      User.findById(shep.id, options)
    ]);
  })
  .then(([ curly, larry, moe, shep ]) => {
    console.log(`moe has ${moe.mentees.length} mentees`);
    console.log(`curly has a mentor named ${curly.mentor.name}`);
    console.log(`larry has a mentor named ${larry.mentor.name}`);
  })
  .catch(console.error);
};

module.exports = {
  sync,
  seed,
  models: {
    User
  }
};
