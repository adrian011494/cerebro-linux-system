/* eslint max-len: [0] */
var fs = require('fs');
var stringSearcher = require('string-search');

const { search, shellCommand } = require('cerebro-tools')

const COMMANDS = {
  Restart: {
    command: "gksudo -m \"Reiniciar el sistema.\" reboot",
  },
  Suspend: {
    command: 'gksudo -m \"Suspender el sistema.\" pm-suspend',
  },
  Hibernate: {
    command: 'gksudo -m \"Hibernar el sistema.\" pm-hibernate',
  },
  'Shut Down': {
    command: "gksudo -m \"Apagar el sistema.\" poweroff",
  }
}


var path="/usr/share/applications";

var apps = new Array();

fs.readdir(path, (err, files) => {
  files.forEach(file => {
 //console.log("\n\n"+file+"\n\n");
    if(fs.lstatSync(path+"/"+file).isFile())
    fs.readFile(path+"/"+file,{encoding: "utf8"}, function read(err, data) {
    if (err) {
       console.log(err)
    }

    content = data;
    var nameapp="";
    stringSearcher.find(content, '^Name').then(function(resultArr) {
    //resultArr => [ {line: 1, text: 'This is the string to search text in'} ]
    nameapp=resultArr[0].text.replace("Name=","");
    if(!apps[nameapp])
        apps[nameapp]=""; 
    
  });
    stringSearcher.find(content, '^Exec')
  .then(function(resultArr) {
    //resultArr => [ {line: 1, text: 'This is the string to search text in'} ] 
    if(resultArr[0].text){
    var s=resultArr[0].text.replace("Exec=","");
    if(s.indexOf('%')>0)
    s=s.substring(0, s.indexOf('%'));
    apps[nameapp]=s; 
    }


  });


    // Invoke the next step here however you like
    //console.log(content);   // Put all of the code here (not the best solution)
             // Or put the next step in a function and invoke it
});
   // console.log(file);
  });
console.log(apps);
})


/**
 * Plugin for Linux system commands
 *
 * @param  {String} options.term
 * @param  {Function} options.display
 */
const fn = ({ term, display }) => {
  const commands = search(Object.keys(COMMANDS), term)
  if (commands.length > 0) {
    const result = commands.map((cmd) => ({
      title: cmd,
      subtitle: COMMANDS[cmd].subtitle,
      term: cmd,
      icon: COMMANDS[cmd].icon,
      onSelect: () => shellCommand(COMMANDS[cmd].command)
    }))
    display(result)
  }

const app = search(Object.keys(apps), term)
console.log(app);
console.log(apps);
  if (app.length > 0) {
    const result = app.map((cmd) => ({
      title: cmd,
      subtitle: apps[cmd],
      term: cmd,      
      onSelect: () => shellCommand(apps[cmd])
    }))
    display(result)
  }

}






module.exports = { fn }
