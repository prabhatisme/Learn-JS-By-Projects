'use strict';
const IssueModel = require('../models.js').Issue;
const ProjectModel = require('../models.js').Project;
const { ObjectId } = require("mongodb")
module.exports = function (app) {
 
  app.route('/api/issues/:project')

    .get(async function (req, res){
      let project = req.params.project;
      console.log(req.query)
      if(!req.query){
      const allIssues = await IssueModel.find({ projectId: project })
      return res.json(allIssues)
      }else{
        const filterIssues = await IssueModel.find({ projectId: project, ...req.query })
        return res.json(filterIssues)
      }})
    
    .post(async function (req, res){
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
     console.log(req.body)
     if(!issue_title || !issue_text || !created_by){
      return res.json({error: "required field(s) missing"})
     }
const generateId = new ObjectId().toString();
     const doc = new IssueModel({
      _id: generateId,
      projectId: project,
      issue_title,
      issue_text,
      created_by,
      assigned_to,
      status_text,
      created_on: new Date(),
      updated_on: new Date(),
      open: true
     })
     try{
      const savedIssue = await doc.save();
      return res.json(savedIssue);
    }catch(e){
      console.error(e);
      return res.status(500).json({error: 'internal server error'})
    }})
    
    .put(async function (req, res){
      let project = req.params.project;
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      
        if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && open === undefined) {
          res.json({ error: "no update field(s) sent", '_id': _id });
          return
        }
     try{
      const findId = await IssueModel.findOne({_id: _id})
      console.log(findId)
      if (!findId) {
        return res.json({ error: 'could not update', _id: _id });
      }
        let updateResult = await IssueModel.updateOne(
          { projectId: project, _id: _id },
          {
            $set: {
              issue_title: issue_title || findId.issue_title,
              issue_text: issue_text || findId.issue_text,
              created_by: created_by || findId.created_by,
              assigned_to: assigned_to || findId.assigned_to,
              status_text: status_text || findId.status_text,
              updated_on: new Date(),
              open: open !== undefined ? open : findId.open,  
            }
          }
        );

      res.json({ result: "successfully updated", '_id': _id });
      }catch(err){
        res.json({ error: "could not update", '_id': _id })
      }
    })
    
    .delete(async function (req, res){
      let project = req.params.project;
     let {_id} = req.body;
     const findId2 = await IssueModel.findOne({_id: _id});
     if(_id){
     if(!findId2){
      return res.json({ error: 'could not delete', '_id': _id });
     } else {
      const removeIssue = await IssueModel.deleteOne({_id: _id})
      return res.json({ result: 'successfully deleted', "_id": _id })
     }}else{
      return res.json({ error: 'missing _id' })
     }
    });
    
};