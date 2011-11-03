var home = require('../controllers/home')
  , labs = require('../controllers/labs');

exports = module.exports = function(server) {

  server.all('/:section/:id', labs.section );
  server.all('/:section', labs.index);
  server.all('/', home.index);
}
