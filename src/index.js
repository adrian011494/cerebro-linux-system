/* eslint max-len: [0] */
var fs = require('fs');
var stringSearcher = require('string-search');
const ejectIcon = require('./eject.png');
const pendriveIcon = require('./pendrive.png');



const { search, shellCommand } = require('cerebro-tools')
var usb = [];
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

  const match = /eject\s(.*)/.exec(term);
  if (match) {


    shellCommand('lsblk -J -p -o name,label,size,type,state,rm,hotplug,mountpoint')
      .then((output) => {
         var partitios = JSON.parse(output);
                for (var attributename in partitios.blockdevices) {
                  //console.log(partitios.blockdevices[attributename]);
                  for (var c in partitios.blockdevices[attributename].children) {
                    //console.log(partitios.blockdevices[attributename].children[c]);
        
                    if (partitios.blockdevices[attributename].children[c].mountpoint != null &&
                      partitios.blockdevices[attributename].children[c].rm == "1") {
                      console.log(partitios.blockdevices[attributename].children[c]);
                      usb.push(partitios.blockdevices[attributename].children[c]);
                      showMy(display);
                    }
                  }
        
                }

        //console.log(output);
      });


  }

}


function showMy(display) {
  if (usb.length) {
    display([{
      icon: ejectIcon,
      title: 'Eject All',
      subtitle: 'Unmount and eject all external disks and partitions',
      onSelect: () => usb.forEach(ejectDrive)
    }].concat(usb.map(({ label, mountpoint, size }) => ({
      icon: pendriveIcon,
      title: label + " " + size,
      subtitle: `Unmount and eject ${mountpoint} `,
      onSelect: () => ejectDrive({ mountpoint, label })
    }))));

  }
}

function ejectDrive({ mountpoint, label }) {

  shellCommand('umount "' + mountpoint + '"').then(() => {
    new Notification('Drive Ejected', {
      body: `${label} has been ejected.`
    });
  });
}



module.exports = { fn }
