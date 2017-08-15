const Sequelize = require('sequelize');
const conn = require('./conn'),
      User = require('./user'),
      Award = require('./award');

const seed = () => {
  let moe, larry, susan, jane;
  let genAward = require('faker').company.catchPhrase;

  return Promise.all([
    // create users
    User.create({ name: 'Moe', awardCount: 2 }),
    User.create({ name: 'Larry' }),
    User.create({ name: 'Susan', awardCount: 1 }),
    User.create({ name: 'Jane', awardCount: 2 })
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
      Award.create({ content: genAward(), userId: moe.id }),
      Award.create({ content: genAward(), userId: moe.id }),
      Award.create({ content: genAward(), userId: jane.id }),
      Award.create({ content: genAward(), userId: jane.id }),
      Award.create({ content: genAward(), userId: susan.id })
    ])
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
      User.findById(jane.id, options),
      Award.findById(moe.id, options),
      Award.findById(jane.id, options),
      Award.findById(susan.id, options)
    ]);
  })
  .then(([ moe, larry, susan, jane ]) => {
    console.log(`Larry has a mentor named ${larry.mentor.name}.`);
    console.log(`Susan has a mentor named ${susan.mentor.name} and ${susan.awardCount} award.`);

    moe.getAwards()
      .then(awards => {
        console.log(`Moe has ${moe.mentees.length} mentees and ${awards.length} awards.`);
        console.log(`Moe has an award for "${awards[0].content}."`);
      });
  })
  .catch(console.error);
};

module.exports = seed;
