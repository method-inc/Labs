exports = module.exports = {

  index: function(req, res, next) {
    require('../models/projects').find_all(function(err, projects){
      res.render('home/index', { projects: projects });  
    });
  }
  
};