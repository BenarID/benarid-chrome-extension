export default [{
  entry: './lib/es6_global/src/popup.js',
  format: 'iife',
  dest: './static/popup.js',
  moduleName: 'Popup'
}, {
  entry: './lib/es6_global/src/background.js',
  format: 'iife',
  dest: './static/background.js',
  moduleName: 'Background'
}]
