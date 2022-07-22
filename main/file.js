const fs = require('fs')
const path = require('path')
const Store = require('electron-store')
const { dialog, app } = require('electron')
const { getMainWindow, updateTitle } = require('./window')
const { Editor } = require('./editor')

const store = new Store()

const File = {
  new () {
    const mainWindow = getMainWindow()
    Editor.setContent(mainWindow, '')
    store.set('pathFile', '')
    updateTitle()
  },
  async open () {
    const mainWindow = getMainWindow()
    const response = await dialog.showOpenDialog(mainWindow, {
      filters: [{ name: 'Texts', extensions: ['txt'] }]
    })

    if (response.canceled) return

    const [pathFile] = response.filePaths
    const content = fs.readFileSync(pathFile, { encoding: 'utf-8' })

    const fileName = path.basename(pathFile)
    updateTitle(fileName)

    Editor.setContent(mainWindow, content)
    store.set('pathFile', pathFile)
  },
  save () {
    this._save()
  },
  saveAs () {
    this._save(true)
  },
  async _save (saveAs = false) {
    const mainWindow = getMainWindow()
    const content = await Editor.getContent(mainWindow)
    let pathFile = store.get('pathFile')
    const saved = !!pathFile

    if (saved && !saveAs) {
      fs.writeFileSync(pathFile, content, { encoding: 'utf-8' })
      store.set('pathFile', pathFile)
      return
    }

    let defaultDir = app.getPath('documents')
    let defaultName = 'untitled.txt'

    if (saveAs && saved) {
      const { dir, name, ext } = path.parse(pathFile)
      defaultName = `${name}-copy${ext}`
      defaultDir = dir
    }

    const response = await dialog.showSaveDialog(mainWindow, {
      defaultPath: path.join(defaultDir, defaultName)
    })

    if (response.canceled) return

    pathFile = response.filePath

    fs.writeFileSync(pathFile, content, { encoding: 'utf-8' })

    updateTitle(path.basename(pathFile))
    store.set('pathFile', pathFile)
  }
}

module.exports = { File }
