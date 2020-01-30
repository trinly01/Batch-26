const tasks = require('./tasks/tasks.service.js');
const users = require('./users/users.service.js');
const todos = require('./todos/todos.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(tasks);
  app.configure(users);
  app.configure(todos);
};
