const express = require('express'),
      nunjucks = require('nunjucks'),
      faker = require('faker');
nunjucks.configure('views', { noCache: true });

const app = express();
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(require('morgan')('dev'));

app.use('/', express.static(require('path').join(__dirname, 'node_modules')));

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

app.use((req, res, next) => {
  const error = new Error('page not found.');
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
