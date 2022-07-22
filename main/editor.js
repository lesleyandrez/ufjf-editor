const { ipcMain } = require('electron')

const Editor = {
  getContent (mainWindow) {
    return new Promise((resolve) => {
      mainWindow.webContents.send('get-content')

      ipcMain.once('content', (event, content) => {
        resolve(content)
      })
    })
  },
  setContent (mainWindow, content) {
    mainWindow.webContents.send('set-content', content)
  }
}

module.exports = { Editor }
