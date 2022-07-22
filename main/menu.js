const contextMenu = require('electron-context-menu')
const { File } = require('./file')
const isMac = process.platform === 'darwin'

contextMenu()

const menuTemplate = [
  { role: 'appMenu' },
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click () {
          File.new()
        }
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click () {
          File.open()
        }
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click () {
          File.save()
        }
      },
      {
        label: 'Save As',
        accelerator: 'CmdOrCtrl+Shift+S',
        click () {
          File.saveAs()
        }
      },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [
                { role: 'startSpeaking' },
                { role: 'stopSpeaking' }
              ]
            }
          ]
        : [
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
          ])
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  { role: 'windowMenu' },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

module.exports = { menuTemplate }
