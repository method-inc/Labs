exports = module.exports = {

  index: function(req, res, next) {
    res.render('barcampclt_physics/index', { message: "Hello, world!" });
  },
  
  section: function(req, res, next) {
    res.render('barcampclt_physics/' + req.params.section + '/' + req.params.id, { message: "Hello, world!" });
  }

  
};

