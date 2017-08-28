const express = require('express');
const nunjucks = require('nunjucks');
nunjucks.configure('views', { noCache: true });
const db = require('./db');

const app = express();
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(require('morgan')('dev'));

app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('method-override')('_method'));

app.use('/', express.static(require('path').join(__dirname, 'node_modules')));

app.use((req, res, next) => {
  res.locals.path = req.url;
  next();
})

app.get('/', (req, res, next) => {
  res.render('home');
});

app.use('/users', require('./routes/users'));

app.use((req, res, next) => {
  const error = new Error('page not found.');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).render('error', { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  db.sync()
    .then(db.seed)
    .then(console.log(`Listening on port ${port}.`))
    .catch(console.error);
});

module.exports = app;
