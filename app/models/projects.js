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
      { name: 'Clickdummy',
        featured: true,
        description: 'Mockups That Click! Clickdummy allows you to upload images for your website design and link them together.  You can also add comments and reply to other comments.  You can also share your projects with friends and coworkers to get feedback or let them help build it out.',
        link: 'https://clickdummy.com', 
        screenshot:'clickdummy.jpg', 
        tags:['html5', 'css3', 'knockoutjs']},
      { name: 'Compass',
        featured: true,
        description: 'Easy sitemaps for civilized web architects. This is still in beta status, so some of the links aren\'t active yet. ',
        link: this.host+':3500', 
        screenshot:'compass.png', 
        tags:['html5', 'css3', 'svg']},
      { name: 'BarcampCLT Physics',
        featured: false,
        description: 'This is the presentation that Hunter Loftis gave at BarcampCLT in fall of 2010.  It goes over the basic concepts of using physics in your apps, especially for games. Each page includes the code needed for that demo.',
        link: '/demos/barcampclt_physics', 
        screenshot:'physics.jpg', 
        tags:['html5', 'physics', 'canvas', 'code examples']},
      { name: 'Canvas Performace Test',
        featured: false,
        description: 'There are lots of different ways to do lots of different things with canvas.  This simple demo allows you to dynamically switch between different techniques and settings and see the affect on performance in your browser.',
        link: '/demos/canvastest', 
        screenshot:'canvas_test.jpg', 
        tags:['html5', 'physics', 'canvas']},
      { name: 'Skookball Prototype',
        featured: false,
        description: 'This demo shows off canvas in a game setting with fast, responsive action and controls.  Play it on your iPad and experience motion controls as well!', 
        link: '/demos/skookball', 
        screenshot:'Skookball_proto.jpg', 
        tags:['html5', 'physics', 'game', 'canvas']},
      { name: 'KnockoutJS ToDo List',
        featured: false,
        description: 'This demo was made for a presentation on Knockout.js and the benefits of using declaritive UI binding for front-end interfaces. It also includes local storage for persistance.',
        link: '/demos/knockout_todos', 
        screenshot:'knockout_todos.jpg',  
        tags:['html5', 'canvas', 'knockoutjs']},
      { name: 'Dueling Pianos',
        featured: false,
        description: 'Dueling Pianos was our entry for node knockout.  It was built in a weekend by three guys.  It uses Youtube API\'s for the music, CSS3 transitions and transforms for the playing board, and node.js/web sockets for multiplayer.  Scoring is done on both the client and server using shared modules. There are a few lingering bugs, but it is fun and will continue to get better. ', 
        link: this.host+':3100', 
        screenshot:'DuelingPianos.jpg', 
        tags:['html5', 'audio', 'game', 'css3']},
      { name: 'HTML5 Fish Aquarium',
        featured: false,
        description: 'This was built for the javascript 10k contest in 2010.  The original version, when minified, was less then 10k in size (it\'s expanded now so you can read the code).  Everything is created in code, there are no images.', 
        link: this.host+':3200', 
        screenshot:'FishAquarium.jpg', 
        tags:['html5', 'css3', 'canvas']},
      { name: 'Tribes 2D : Operation MAX', 
        featured: false,
        description: 'This is a demonstration of canvas graphics and multiplayer web socket functionality.  Every viewer gets a character to move around the board and can see any other viewers on the page.',
        link: this.host+':3300', 
        screenshot:'Tribes.jpg', 
        tags:['html5', 'physics', 'game', 'canvas']}
  ];

  callback(null, projects);
};