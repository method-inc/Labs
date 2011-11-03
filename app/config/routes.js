var home = require('../controllers/home')
  , labs = require('../controllers/labs');

exports = module.exports = function(server) {

  server.all('/labs/:section/:id', labs.section );
  server.all('/labs', labs.index);
  server.all('/', home.index);
}
