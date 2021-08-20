import Router from './Router'
import Auth from './Auth'
import Toast from './Toast'


class App {
  constructor(){
    //set properties for our object
    this.name = "Fixeroo"
    this.version = "1.0.0"
    this.apiBase = 'https://qriit84nz2.execute-api.us-east-1.amazonaws.com'
    //the root div we want to insert et into
    this.rootEl = document.getElementById("root")
    this.version = "1.0.0"
  }
  
  //this function gets fired at the very start
  init() { 
    console.log("App.init")
    
    // Toast init
    Toast.init()   
    
    // Authentication check 
    // check to see if the person is logged in   
    //Auth.check(() => {
      // authenticated! init Router
      // if theyre logged in theh nwe run the router which listens out for page changes
      Router.init()
   // })    
  }
}

export default new App()