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
  
  projects = [
    {name: 'Dueling Pianos', link: this.host+':3100'},
    {name: 'HTML5 Fish Aquarium', link: this.host+':3200'},
    {name: 'BarcampCLT Physics', link: '/demos/barcampclt_physics'},
    {name: 'Canvas Performace Test', link: '/demos/canvastest'}
  ];

  callback(null, projects);
};