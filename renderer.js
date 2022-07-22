const { ipcRenderer } = require('electron')

const $textEditor = document.getElementById('text-editor')
// const textSaved = localStorage.getItem('text-content') || ''

// $textEditor.innerHTML = textSaved

// $textEditor.oninput = () => {
//     localStorage.setItem('text-content', $textEditor.value)
// }

ipcRenderer.on('get-content', () => {
  ipcRenderer.send('content', $textEditor.value)
})

ipcRenderer.on('set-content', (event, content) => {
  $textEditor.value = content
})
