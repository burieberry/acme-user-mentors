const Sequelize = require('sequelize');
const conn = require('./conn'),
      User = require('./user'),
      Award = require('./award');

const seed = () => {
  let moe, larry, susan, jane;
  let genAward = require('faker').company.catchPhrase;

  return Promise.all([
    // create users
    User.create({ name: 'Moe' }),
    User.create({ name: 'Larry' }),
    User.create({ name: 'Susan' }),
    User.create({ name: 'Jane' })
  ])
  .then(result => {
    return [ moe, larry, susan, jane ] = result;
  })
  .then(() => {
    // set mentors
    larry.mentorId = moe.id;
    susan.mentorId = moe.id;

    return Promise.all([
      larry.save(),
      susan.save()
    ]);
  })
  .then(() => {
    return Promise.all([
      Award.create({ content: genAward() }),
      Award.create({ content: genAward() }),
      Award.create({ content: genAward() }),
      Award.create({ content: genAward() }),
      Award.create({ content: genAward() })
    ])
    .then(awards => {
      console.log(awards[0].dataValues);
    })
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
      User.findById(moe.id, options),
      User.findById(larry.id, options),
      User.findById(susan.id, options),
      User.findById(jane.id, options)
    ]);
  })
  .then(([ moe, larry, susan, jane ]) => {
    console.log(`Moe has ${moe.mentees.length} mentees.`);
    console.log(`Larry has a mentor named ${larry.mentor.name}.`);
    console.log(`Susan has a mentor named ${susan.mentor.name}.`);
  })
  .catch(console.error);
};

module.exports = seed;
