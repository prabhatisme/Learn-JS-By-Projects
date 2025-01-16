const mongoose = require("mongoose");
const { Schema } = mongoose;

const IssueSchema = new Schema({
  projectId: {type: String, required: true},
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    created_by: {type: String, required: true},
    assigned_to: { type: String, default: "" },
    open: { type: Boolean, default: true },
    status_text: { type: String, default: "" },
});

const Issue = mongoose.model("Issue", IssueSchema);

const ProjectSchema = new Schema({
  name: { type: String, required: true },
});
const Project = mongoose.model("Project", ProjectSchema);
module.exports = { Issue, Project };