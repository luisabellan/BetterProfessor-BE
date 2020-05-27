const db = require("../data/dbConfig.js");



//  return a list of all projects in the database.

function getProjects() {
  return db('projects')


}

// resolves to  Resolve to a single user object (or null)

function findById(id) {
  return db("projects").where({ id }).first();
}

// returns a list of all projects and due_dates for a given user

/* SELECT  p.name as project_name, p.due_date 
FROM [users] AS u
JOIN [projects] AS p; */

//TODO continue here
async function getProjectList(id) {
  return db("projects as p")
  .select("p.name as project_name", "p.due_date")
    .join("users as u")
    .where({ 'u.id': id });
}

// returns a list of messages for a user
/* SELECT r.id, s.message 
FROM [user] AS u
JOIN [reminder] AS r
ON u.id = r.id; */

function getMessages(user_id) {
  return db("user as u")
    .select("r.id", "r.message")
    .join("reminders as r", "u.id", "r.id")
    .where({ "u.id": user_id });
}


// resolves to  Resolve to a single project object (or null)

function findById(id) {
  return db('projects').where({ id }).first();
}

// CREATE PROJECT
 function add(project) {
  db('projects').insert(project)
  .then(ids => {
    return findById(ids[0]);
  });
}
 

function remove(id) {
  return db("projects").where({ id }).first().del();
}
// returns  all users in the system that utilize a single project
// TODO: Not working right now
function getUsersWithProjects(id) {
  const users = db("p.name as project_name", "u.name  as user_name")
    .join("project as p")
    .select("p.name as project_name", "u.name as user_name");

  return users.where({ 'user.id': id });


}
module.exports = {
  getProjects,
  getProjectList,
  getMessages,
  findById,
  add,
  remove,
  getUsersWithProjects,
};
