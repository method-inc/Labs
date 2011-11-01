exports = module.exports = {

  index: function(req, res, next) {
    res.render('home/index', { message: "Hello, world!" });
  }
  
};