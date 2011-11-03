/**
 * Projects model
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
    {name: 'BarcampCLT Physics', link: '/barcampclt_physics'}
  ];

  callback(null, projects);
};