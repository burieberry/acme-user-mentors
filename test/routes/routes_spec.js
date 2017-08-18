const expect = require('chai').expect;
const db = require('../../db');
const app = require('supertest')(require('../../server'));

describe('Routes', () => {
  beforeEach(() => {
    return db.sync()
      .then(db.seed);
  });

  describe('GET /users route', () => {
    it('displays all users', () => {
      return app.get('/users')
        .expect(200)
        .then(res => {
          expect(res.text).to.contain('Moe');
          expect(res.text).to.contain('Jane');
          expect(res.text).to.contain('Larry');
          expect(res.text).to.contain('Susan');
        });
    });
  });
});
