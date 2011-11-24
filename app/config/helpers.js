exports = module.exports = function(server) {
  
  server.helpers({
    
    embed_json: function(obj, name) {
      var escaped = JSON.stringify(obj).replace(/\\/g, '\\\\').replace(/<\/script>/g, '');
      return "<script> " + name + " = " + escaped + "; </script>";
    },
    
    embed: function(obj, name) {
      return "<script> " + name + " = \"" + obj + "\"; </script>";
    },
    
    embed_json_func: function(obj, name) {
      var escaped = JSON.stringify(obj).replace(/\\/g, '\\\\').replace(/<\/script>/g, '');
      return "<script> " + name + "( " + escaped + " ); </script>";
    },
    
    base_url: server.set('host'),
    
    media_url: server.set('media'),
    environment: server.set('env')
    
  });
  
  server.dynamicHelpers({
    messages: require('express-messages')
  });
};