exports = module.exports = {

  // barcampclt physics actions
  'barcampclt_physics' : {

    index: function(req, res, next) {
      res.render('barcampclt_physics/index');
    },
    
    section: function(req, res, next) {
      res.render('barcampclt_physics/' + req.params.section + '/' + req.params.id);
    }
  },

  // canvastest actions
  'canvastest' : {
    
    index: function(req, res, next) {
      res.render('canvastest/index');
    }
  }

  
};

