import App from './App'
import Auth from './Auth'
import Toast from './Toast'

class HandymanAPI {

  async getHandymen(){

    // fetch the json data
    const response = await fetch(`${App.apiBase}/handymen`)

    // if response not ok
    if(!response.ok){ 
      // console log error
      const err = await response.json()
      if(err) console.log(err)
      // throw error (exit this function)      
      throw new Error('Problem getting handymen')
    }
    
    // convert response payload into json - store as data
    const data = await response.json()
    
    // return data
    return data
  }
}

export default new HandymanAPI()