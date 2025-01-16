const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test("Create an issue with every field: POST request to /api/issues/{project}", function(done){
chai.request(server)
.post('/api/issues/apitest')
.send({
    issue_title: 'a',
    issue_text: 'b',
    created_by: 'c',
    assigned_to: 'd',
    status_text: 'e'
  })
.end((err, res) => {
    assert.equal(res.status, 200);
    assert.isObject(res.body);
    assert.property(res.body, '_id');
    assert.equal(res.body.issue_title, 'a');
    done();
})
  })

  test("Create an issue with only required fields: POST request to /api/issues/{project}", function(done){
    chai.request(server)
   .post('/api/issues/apitest')
   .send({
    issue_title: 'a', 
    issue_text: 'b', 
    created_by: 'c'
    })
   .end((err, res) => {
     assert.equal(res.status, 200);
     assert.isObject(res.body);
     assert.property(res.body, '_id');
     assert.equal(res.body.issue_title, 'a'); 
     done();
   })
  })
  
  test("Create an issue with missing required fields: POST request to /api/issues/{project}", function(done){
    chai.request(server)
    .post('/api/issues/apitest')
    .send({
     issue_text: 'b',
     created_by: 'c'
    })
    .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.equal(res.body.error, 'required field(s) missing')
        done();
    })
  })

  test("View issues on a project: GET request to /api/issues/{project}", function(done){
    chai.request(server)
    .get('/api/issues/apitest')
    .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
    })
  })

  test("View issues on a project with one filter: GET request to /api/issues/{project}", function(done){
    chai.request(server)
    .get('/api/issues/apitest')
    .query({ open: false })
    .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
    })
  })

  test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function(done){
    chai.request(server)
    .get('/api/issues/apitest')
    .query({ open: false, assigned_to: 'd' })
    .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
    })
  })

  test("Update one field on an issue: PUT request to /api/issues/{project}", function(done){
    chai.request(server)
   .post('/api/issues/apitest')
   .send({ 
   issue_title: 'a',
   issue_text: 'b', 
    created_by: 'c'
   })
   .end((err, res) => {
    chai.request(server)
    .put('/api/issues/apitest')
    .send({
        _id: res.body._id,
        created_by: 'Ayato'
    })
    .end((err, res) => {
     assert.equal(res.status, 200);
     assert.isObject(res.body);
     assert.equal(res.body.result, 'successfully updated'); 
     done();
   })
  })})

  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function(done){
    chai.request(server)
   .post('/api/issues/apitest')
   .send({ 
    issue_title: 'a',
    issue_text: 'b', 
    created_by: 'c'
   })
   .end((err, res) => {
    chai.request(server)
    .put('/api/issues/apitest')
    .send({
        _id: res.body._id,
        issue_title: 'b',
        assigned_to: 'd'
    })
    .end((err, res) => {
     assert.equal(res.status, 200);
     assert.isObject(res.body);
     assert.equal(res.body.result, 'successfully updated');
     done();
   })
  })})

  test("Update an issue with missing _id: PUT request to /api/issues/{project}", function(done){
    chai.request(server)
   .post('/api/issues/apitest')
   .send({ 
    issue_title: 'a',
    issue_text: 'b', 
    created_by: 'c'
   })
   .end((err, res) => {
    chai.request(server)
    .put('/api/issues/apitest')
    .send({
        issue_title: 'b',
        assigned_to: 'd'
    })
    .end((err, res) => {
     assert.equal(res.status, 200);
     assert.isObject(res.body);
     assert.equal(res.body.error, 'missing _id');
     done();
   })
  })})

  test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function(done){
    chai.request(server)
   .post('/api/issues/apitest')
   .send({ 
    issue_title: 'a',
    issue_text: 'b', 
    created_by: 'c'
   })
   .end((err, res) => {
   chai.request(server)
   .put('/api/issues/apitest')
   .end((err, res) => {
     assert.equal(res.status, 200);
     assert.isObject(res.body);
     done();
   })
   })
  })

  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function(done){
    chai.request(server)
    .post('/api/issues/apitest')
    .send({ 
     issue_title: 'a',
     issue_text: 'b', 
     created_by: 'c'
    })
    .end((err, res) => {
        chai.request(server)
       .put('/api/issues/apitest')
       .send({
            _id: '507f191e810c19729de860ea',
            issue_title: 'b',
            assigned_to: 'd'
        })
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.equal(res.body.error, 'could not update');
            done();
        })
    })
  })

  test("Delete an issue: DELETE request to /api/issues/{project}", function(done){
    chai.request(server)
   .post('/api/issues/apitest')
   .send({ 
    issue_title: 'a',
    issue_text: 'b', 
    created_by: 'c'
   })
   .end((err, res) => {
    chai.request(server)
    .delete('/api/issues/apitest/')
    .send({_id: res.body._id})
    .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.equal(res.body.result, 'successfully deleted');
        done();
    })
   })
  })

  test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function(done){
    chai.request(server)
    .post('/api/issues/apitest')
    .send({
        issue_title: 'a',
        issue_text: 'b',
        created_by: 'c'
    })
    .end((err, res) => {
        chai.request(server)
       .delete('/api/issues/apitest/')
       .send({_id: '507f191e810c19729de860ea'})
       .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.equal(res.body.error, 'could not delete');
        done();
       })
    })
  })

  test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function(done){
    chai.request(server)
    .post('/api/issues/apitest')
    .send({
        issue_title: "a",
        issue_text: 'b',
        created_by: 'c'
    })
    .end((err, res) => {
        chai.request(server)
       .delete('/api/issues/apitest')
       .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        done();
       })
    })
  })
});
