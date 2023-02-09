

//user.js tests


const chai = require('chai');
const chaiHTTP = require('chai-http');

const app = require('../app');

let should = chai.should();
chai.use(chaiHTTP);

describe('Test of /healthz GET API', () => {
    it('health should be OK', (done) => {
        chai.request(app)
            .get('/healthz')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

var assert = require('assert');
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

//product tests

//get api test
describe('Authentication Test for Get', function() {
  describe('Success', function() {
      it('Return the product for Get if the id does not exist', function(done) {
          chai.request(app).get('/v1/product/1').send({}).end(function(err, res) {
              chai.expect(res.statusCode).to.be.equal(400);
              done();
          });
      });
    });
})

//post api test
describe('Authentication Test for post', function() {
  describe('Success', function() {
      it('return the product for Post if auth does not exist', function(done) {
          chai.request(app).post('/v1/product/').send({}).end(function(err, res) {
              chai.expect(res.statusCode).to.be.equal(400);
              done();
          });
      });
    });
})

//put api test
describe('Authentication Test for put', function() {
  describe('Success', function() {
      it('Do not Update the product for Put if the id does not exist', function(done) {
          chai.request(app).put('/v1/product/qqq').send({}).end(function(err, res) {
              chai.expect(res.statusCode).to.be.equal(400);
              done();
          });
      });
    });
})

//patch api test
describe('Authentication Test for patch', function() {
  describe('Success', function() {
      it('Do not Update the product for Patch if the id does not exist', function(done) {
          chai.request(app).patch('/v1/product/csye').send({}).end(function(err, res) {
              chai.expect(res.statusCode).to.be.equal(400);
              done();
          });
      });
    });
})

//delete api test
describe('Authentication Test for delete', function() {
  describe('Success', function() {
      it('Do not destroy the product for Delete if the id does not exist', function(done) {
          chai.request(app).delete('/v1/product/assign').send({}).end(function(err, res) {
              chai.expect(res.statusCode).to.be.equal(400);
              done();
          });
      });
    });
})

