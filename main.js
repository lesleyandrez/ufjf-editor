/* eslint-disable no-unused-vars */
const { app, BrowserWindow, Menu } = require('electron')
const { createWindow } = require('./main/window')
const { menuTemplate } = require('./main/menu')

// require('electron-reload')(__dirname, {
//     electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
//     hardResetMethod: 'exit'
// });

let mainWindow

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

app.whenReady().then(() => {
  mainWindow = createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
