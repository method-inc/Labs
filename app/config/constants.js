exports = module.exports = function(env) {

  // Options
  
  var TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;
  
  var option_tables = {
    development: function() {
      this.maxAge = 14 * 24 * 60 * 60 * 1000;         // Two weeks   // Time before a session goes stale
      this.shortSession = 12 * 24 * 60 * 60 * 1000;    // We no longer have a short session option 1000 * 60 * 60 * 60         // 60 minutes
      this.reqTimeout = 30000;
      this.sessionKey = 'session';
      this.host = 'http://localhost';
      this.port = 80;
      this.dumpExceptions = true;
      this.showStack = true;
      this.errorToHtml = true;
      this.redis = { host: 'localhost', port: 6379, db: 'labs' };
      this.mongo = { db: 'mongodb://localhost/labs'};
    },
    production: function() {
      this.host = "http://labs.skookum.com";
    }
  };
  
  // Cascade options
  
  option_tables.production.prototype = new option_tables.development();

  return new option_tables[env]();
  
};