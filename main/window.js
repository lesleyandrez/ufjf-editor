const fs = require('fs')
const path = require('path')
const windowStateKeeper = require('electron-window-state')
const { BrowserWindow } = require('electron')
const packageInfo = require('../package.json')
const Store = require('electron-store')
const { Editor } = require('./editor')

const store = new Store()

function createWindow () {
  const mainWindowState = windowStateKeeper({
    defaultHeight: 600,
    defaultWidth: 800
  })

  const mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    show: false,
    minWidth: 400,
    title: generateTitle(),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // mainWindow.webContents.openDevTools();
  mainWindowState.manage(mainWindow)

  mainWindow.loadFile('index.html')

  mainWindow.on('ready-to-show', () => {
    const pathFile = store.get('pathFile')
    if (pathFile) {
      const content = fs.readFileSync(pathFile, { encoding: 'utf-8' })

      const fileName = path.basename(pathFile)
      updateTitle(fileName)

      Editor.setContent(mainWindow, content)
      store.set('pathFile', pathFile)
    }
    mainWindow.show()
  })

  return mainWindow
}

function getMainWindow () {
  const [mainWindow] = BrowserWindow.getAllWindows()
  return mainWindow || null
}

function updateTitle (fileName = '') {
  const mainWindow = getMainWindow()
  const title = generateTitle(fileName)

  mainWindow.setTitle(title)
}

function generateTitle (fileName) {
  return `${fileName || 'untitled'} - ${packageInfo.productName}`
}

module.exports = {
  createWindow,
  getMainWindow,
  updateTitle
}
