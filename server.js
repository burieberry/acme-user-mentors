const express = require('express');
const nunjucks = require('nunjucks');
nunjucks.configure('views', { noCache: true });
const db = require('./db');

const app = express();
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(require('morgan')('dev'));

app.use('/', express.static(require('path').join(__dirname, 'node_modules')));

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

app.use('/users', require('./routes/users'));

app.use((req, res, next) => {
  const error = new Error('page not found.');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
  db.sync()
    .then(console.log('synced'))
    .then(db.seed)
    .then(console.log('seeded'))
    .catch(err => {
      console.log(err);
    });
});
