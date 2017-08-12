const Sequelize = require('sequelize');
const conn = require('./conn'),
      User = require('./user');

const sync = () => {
  return conn.sync({ force: true });
}

const seed = () => {
  let curly, larry, moe, shep;

  return Promise.all([
    // create users
    User.create({ name: 'Curly', awards: ['Excellence'] }),
    User.create({ name: 'Larry', awards: [] }),
    User.create({ name: 'Moe', awards: [] }),
    User.create({ name: 'Shep', awards: [] })
  ])
  .then(result => {
    return [ curly, larry, moe, shep ] = result;
  })
  .then(() => {
    // set mentors
    curly.mentorId = moe.id;
    larry.mentorId = moe.id;

    return Promise.all([
      curly.save(),
      larry.save()
    ]);
  })
  .then(() => {
    const options = {
      include: [
        { model: User, as: 'mentor' },
        { model: User, as: 'mentees' }
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
    console.log(`Moe has ${moe.mentees.length} mentees.`);
    console.log(`Curly has a mentor named ${curly.mentor.name}.`);
    console.log(`Larry has a mentor named ${larry.mentor.name}.`);
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
