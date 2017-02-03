/* eslint max-len: [0] */
var fs = require('fs');
var stringSearcher = require('string-search');

const { search, shellCommand } = require('cerebro-tools')

const COMMANDS = {
  Restart: {
    command: "systemctl reboot",
  },
  Sleep: {
    command: 'systemctl suspend',
  },
  'Shut Down': {
    command: "systemctl poweroff",
  },
  'Empty Trash': {
    command: "rm -rf ~/.local/share/Trash/*"
},
  '! mute': {
    command: "amixer -D pulse set Master mute",
    subtitle: "Volume off"
},
  '! unmute': {
    command: "amixer -D pulse set Master unmute",
    subtitle: "Volume on"
}
,
  '! +': {
    command: "amixer -D pulse set Master unmute;amixer set Master 10+",
    subtitle: "Volume +10%"
},
  '! ++': {
    command: "amixer -D pulse set Master unmute;amixer set Master 30+",
    subtitle: "Volume +30%"
}
,
  '! +++': {
    command: "amixer -D pulse set Master unmute;amixer set Master 50+",
    subtitle: "Volume +50%"
},
  '! 100%': {
    command: "amixer -D pulse set Master unmute;amixer set Master 100+",
    subtitle: "Volume 100%"
},
  '! -': {
    command: "amixer -D pulse set Master unmute;amixer set Master 10-",
    subtitle: "Volume -10%"
},
  '! --': {
    command: "amixer -D pulse set Master unmute;amixer set Master 30-",
    subtitle: "Volume -30%"
}
,
  '! ---': {
    command: "amixer -D pulse set Master unmute;amixer set Master 50-",
    subtitle: "Volume -50%"
}
,
  'wifi on': {
    command: "nmcli radio wifi on",
    subtitle: "Enable wifi"
},
  'wifi off': {
    command: "nmcli radio wifi off",
    subtitle: "Disable wifi"
}
,
  '* 10%': {
    command: "xrandr --output $(xrandr -q | grep ' connected' | head -n 1 | cut -d ' ' -f1) --brightness 0.1",
    subtitle: "Brightness 10%"
}
,
  '* 20%': {
    command: "xrandr --output $(xrandr -q | grep ' connected' | head -n 1 | cut -d ' ' -f1) --brightness 0.2",
    subtitle: "Brightness 20%"
}
,
  '* 30%': {
    command: "xrandr --output $(xrandr -q | grep ' connected' | head -n 1 | cut -d ' ' -f1) --brightness 0.3",
    subtitle: "Brightness 30%"
}
,
  '* 40%': {
    command: "xrandr --output $(xrandr -q | grep ' connected' | head -n 1 | cut -d ' ' -f1) --brightness 0.4",
    subtitle: "Brightness 40%"
},
  '* 50%': {
    command: "xrandr --output $(xrandr -q | grep ' connected' | head -n 1 | cut -d ' ' -f1) --brightness 0.5",
    subtitle: "Brightness 50%"
},
  '* 60%': {
    command: "xrandr --output $(xrandr -q | grep ' connected' | head -n 1 | cut -d ' ' -f1) --brightness 0.6",
    subtitle: "Brightness 60%"
},
  '* 70%': {
    command: "xrandr --output $(xrandr -q | grep ' connected' | head -n 1 | cut -d ' ' -f1) --brightness 0.7",
    subtitle: "Brightness 70%"
},
  '* 80%': {
    command: "xrandr --output $(xrandr -q | grep ' connected' | head -n 1 | cut -d ' ' -f1) --brightness 0.8",
    subtitle: "Brightness 80%"
},
  '* 90%': {
    command: "xrandr --output $(xrandr -q | grep ' connected' | head -n 1 | cut -d ' ' -f1) --brightness 0.9",
    subtitle: "Brightness 90%"
},
  '* 100%': {
    command: "xrandr --output $(xrandr -q | grep ' connected' | head -n 1 | cut -d ' ' -f1) --brightness 1",
    subtitle: "Brightness 100%"
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
