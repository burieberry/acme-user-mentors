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
      Award.create({ content: genAward(), userId: moe.id }),
      Award.create({ content: genAward(), userId: moe.id  }),
      Award.create({ content: genAward(), userId: jane.id  }),
      Award.create({ content: genAward(), userId: jane.id  }),
      Award.create({ content: genAward(), userId: susan.id  })
    ])
    .then(awards => {
      awards[0].userId = awards[0].mentorId = moe.id;
      awards[1].userId = awards[1].mentorId = moe.id;
      awards[2].userId = jane.id;
      awards[3].userId = jane.id;
      awards[4].userId = awards[4].menteesId = susan.id;

      return Promise.all([
        awards[0].save(),
        awards[1].save(),
        awards[2].save(),
        awards[3].save(),
        awards[4].save()
      ]);
    });
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

    moe.getAwards()
      .then(awards => {
        console.log(`Moe has ${moe.mentees.length} mentees and ${awards.length} awards.`);
        console.log(`Moe has an award for "${awards[0].content}."`);
      })

    susan.countAwards()
      .then(count => {
        console.log(`Susan has a mentor named ${susan.mentor.name} and ${count} award.`);
      })
  })
  .catch(console.error);
};

module.exports = seed;
