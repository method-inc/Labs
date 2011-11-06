/**
 * Projects model
 *
 * @author Jim Snodgrass jim@skookum.com
 */

function Projects() {}

module.exports = new Projects();

Projects.prototype.init = function(server) {
  this.host = server.set('host');
};

Projects.prototype.find_all = function(callback) {
  
  projects = {
    featured: [
      {name: 'Clickdummy', link: 'https://clickdummy.com', screenshot:'clickdummy.jpg', tags:['html5', 'css3']}
    ],

    demos: [
      {name: 'BarcampCLT Physics', link: '/demos/barcampclt_physics', screenshot:'physics.jpg', tags:['html5', 'physics', 'canvas', 'code examples']},
      {name: 'Canvas Performace Test', link: '/demos/canvastest', screenshot:'canvas_test.jpg', tags:['html5', 'physics', 'canvas']},
      {name: 'Skookball Prototype', link: '/demos/skookball', screenshot:'Skookball_proto.jpg', tags:['html5', 'physics', 'game', 'canvas']},
      {name: 'Dueling Pianos', link: this.host+':3100', screenshot:'DuelingPianos.jpg',         tags:['html5', 'audio', 'game', 'css3']},
      {name: 'HTML5 Fish Aquarium', link: this.host+':3200', screenshot:'FishAquarium.jpg',     tags:['html5', 'ccss3', 'canvas']},
      {name: 'Tribes 2D : Operation MAX', link: this.host+':3300', screenshot:'Tribes.jpg',     tags:['html5', 'physics', 'game', 'canvas']}
  ]};

  callback(null, projects);
};