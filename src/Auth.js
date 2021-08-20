import App from './App'
import Router, { gotoRoute } from './Router'
import splash from './views/partials/splash'
import {html, render } from 'lit-html'
import Toast from './Toast'

class Auth {

  constructor(){
    this.currentUser = ""
  }
  
  async signUp( accessLevel, firstName, lastName, email, password, userData, fail = false){ 

    let user = {
      "email": email,
      "firstName": firstName,
      "lastName": lastName,
      "password": password
    }

    let response  = null

    if (accessLevel == 1){
      //create a new user in the users table
      response = await fetch(`${App.apiBase}/user`, {
        method: 'PUT',      
        body: userData
      })
    }
    else{
      //create a new user in the handymen table
      response = await fetch(`${App.apiBase}/handymen`, {
        method: 'PUT',  
        headers: {"Content-Type": "application/json"}  ,  
        body: JSON.stringify(user)
      })

    }
    

    // if response not ok
    if(!response.ok){      
      // console log error
      const err = await response.json()
      if(err) console.log(err)
      // show error      
      Toast.show(`Problem getting user: ${response.status}`)   
      // run fail() functon if set
      if(typeof fail == 'function') fail()
    }
    /// sign up success - show toast and redirect to sign in page
    Toast.show('Account created, please sign in')        
    // redirect to signin
    gotoRoute('/signin')
  }


  async signIn(email, password, userData, fail = false){

    const response = await fetch(`${App.apiBase}/handymen/${email}`)

    // if response not ok
    if(!response.ok){
      // console log error
      const err = await response.json()
      if(err) console.log(err)
      // show error      
      Toast.show(`Problem signing in: ${err.message}`, 'error')   
      // run fail() functon if set
      if(typeof fail == 'function') fail()
    }

    // sign in success
    const data = await response.json()
    if (data.Item.password == password)
    {
      Toast.show(`Welcome  ${data.Item.firstName}`)

      // set current user
      this.currentUser = data.Item    
       
      // redirect to home
      Router.init()
      gotoRoute('/')
    }
    else{
      Toast.show("Incorrect Password")
      location.reload();
    }
  }

  signOut(){
    Toast.show("You are signed out") 
    // redirect to sign in    
    gotoRoute('/signin')
    // unset currentUser
    this.currentUser = null
  }
}

export default new Auth()