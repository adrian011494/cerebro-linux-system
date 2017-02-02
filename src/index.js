/* eslint max-len: [0] */

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
}

module.exports = { fn }
