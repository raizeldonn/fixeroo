import App from './App.js'

// components (custom web components)
import './components/va-app-header'

// styles
import './scss/master.scss'

// app.init - run the app
// waits till the dom has finished loading all its content
document.addEventListener('DOMContentLoaded', () => {
  App.init()
})