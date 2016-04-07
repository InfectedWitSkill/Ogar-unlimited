const fs = require("fs");
const request = require('request');
// plugin command
module.exports = function (gameServer, split) {
  if (split[1] == "list") {
    console.log("[Console] --------------- Available Plugins ---------------");
    for (var i in gameServer.plugins) {
      var plugin = gameServer.plugins[i];
      if (plugin && plugin.name && plugin.author && plugin.version) {
        if (plugin.description) console.log("[Console] " + plugin.name + " By " + plugin.author + " version " + plugin.version + "\n      Description: " + plugin.description); else console.log("[Console] " + plugin.name + " By " + plugin.author + " version " + plugin.version + "\n      Description: No description given");


      }


    }
    console.log("[Console] ------------------------------------------------");
  } else if (split[1] == "reload") {
    gameServer.pluginLoader.load();
    console.log("[Console] Reloaded plugins");
  } else if (split[1] == "delete") {
    if(split[2]) {
    gameServer.dfr('../plugins/' + split[2]);
    console.log("[Console] Deleting Plugin " + split[2]);
    
    setTimeout(function() {
      console.log("[Console] Reloading plugins");
      gameServer.pluginLoader.load();
      
    }, 3000)
    } else {
      console.log("[Console] Please specify a plugin filename")
      
    }
  } else if (split[1] == "add") {
    if (!split[3]) {
      
      console.log("[Console] Please specify a plugin filename");
    }
    if (!split[2]) {
      
      console.log("[Console] Please specify a plugins files.txt raw url");
    }
    
    request(split[2], function (error, response, body) {
        if (!error && response.statusCode == 200) {
         var files = body.split(/[\r\n]+/).filter(function (x) {
            return x != ''; // filter empty
          });
          var filenames = [];
          var src = [];
          for (var i in files) {
            var f = files[i].split("|");
            filenames[i] = f[0];
            src[i] = f[1];
          }
          var download = function(src,location) {
            request(src, function (error, response, body) {
      if (!error && response.statusCode == 200 && body != "") {
        fs.writeFile(location , body, (err, res)=> {
        });
      } else {
        console.log("[Console] Error: Couldnt download file into " + location);
      }
    });
            
            
          };
          for (var i in files) {
            var f = files[i].split("|");
            filenames[i] = f[0];
            src[i] = f[1];
            download(src[i],'./plugins/' + split[3] + '/' + filenames[i]);
            
          }
          

        } else {
          console.log("[Update] Please put a valid url of the raw files.txt file");

        }
      });
    
    
    
  } else {
    console.log("[Console] Please specify a command. Available commands: list, reload, delete, add")
  }


};
