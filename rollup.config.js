export default [{
  input: './lib/es6_global/src/popup.js',
  name: 'Popup',
  output: {
    file: './static/popup.js',
    format: 'iife',
  },
}, {
  input: './lib/es6_global/src/background.js',
  name: 'Background',
  output: {
    file: './static/background.js',
    format: 'iife',
  },
}]
