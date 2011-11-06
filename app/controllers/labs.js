exports = module.exports = {

  // barcampclt physics actions
  'barcampclt_physics' : {

    index: function(req, res, next) {
      res.render('barcampclt_physics/index', {page_title: 'BarcampCLT Physics'});
    },
    
    section: function(req, res, next) {
      res.render('barcampclt_physics/' + req.params.section + '/' + req.params.id, {page_title: 'BarcampCLT Physics'});
    }
  },

  // canvastest actions
  'canvastest' : {

    index: function(req, res, next) {
      res.render('canvastest/index', {page_title: 'Canvas Test'});
    }
  },

  // canvastest actions
  'skookball' : {
    
    index: function(req, res, next) {
      res.render('skookball/index', {page_title: 'Skookball Prototype'});
    }
  },

  // knockoutjs todos actions
  'knockout_todos' : {
    
    index: function(req, res, next) {
      res.render('knockout_todos/index', {page_title: 'KnockoutJS ToDo List'});
    }
  }
  
};

