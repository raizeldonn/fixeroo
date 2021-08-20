import App from './App'
import Auth from './Auth'
import Toast from './Toast'
//let fs = require('fs');
import fs from 'fs';

class UserAPI {

  async postImage(firstName, lastName, image, reader){
    
    let fileType = image.name.split('.').pop()

    let response = await fetch(`${App.apiBase}/image`, {
      method: 'PUT',  
      headers: {"Content-Type": "application/json"}  ,  
      body: JSON.stringify({
        "key": firstName + lastName + "." + fileType,
        "data": reader.result.split(',')[1],
        "contentType": image.type
      })
    })

     // if response not ok
    if(!response.ok){
      // console log error
      const err = await response.json()
      if(err) console.log(err)
      // throw error (exit this function)      
      throw new Error('Problem updating user')
    }

    // convert response payload into json - store as data
    const data = await response.json()
    
    // return data
    return data
  }

 
  
  async addReview(email, rating, message){
    let reviewData = {
      "email": email,
      "rating": rating,
      "message": message,
    }
    
    // // make fetch request to backend
    let response = await fetch(`${App.apiBase}/handymen/${email}/review`, {
      method: 'PUT',  
      headers: {"Content-Type": "application/json"}  ,  
      body: JSON.stringify(reviewData)
    })

    // if response not ok
    if(!response.ok){
      // console log error
      const err = await response.json()
      if(err) console.log(err)
      // throw error (exit this function)      
      throw new Error('Problem adding review to handyman')
    }

    // convert response payload into json - store as data
    const data = await response.json()
    
    // return data
    return data
  }

  async uploadProfileImageS3(firstName, lastName, image){
    var reader = new FileReader();

    reader.addEventListener("load", async () => {
      await this.postImage(firstName, lastName, image, reader)
    })
    reader.readAsDataURL(image);
  }

  async updateUser(email, password, firstName, lastName, field, experience,
    price, neatness, safety, pets, policeCheck){
    // validate
    if(!email) return

    let user = {
      "email": email,
      "firstName": firstName,
      "lastName": lastName,
      "password": password,
      "field": field,
      "experience":experience,
      "price": price,
      "neatness": neatness,
      "safety": safety,
      "pets": pets,
      "policeCheck":policeCheck
    }
    
    // make fetch request to backend
    let response = await fetch(`${App.apiBase}/handymen/${email}`, {
      method: 'PUT',  
      headers: {"Content-Type": "application/json"}  ,  
      body: JSON.stringify(user)
    })
    


    // if response not ok
    if(!response.ok){
      // console log error
      const err = await response.json()
      if(err) console.log(err)
      // throw error (exit this function)      
      throw new Error('Problem updating user')
    }

    // convert response payload into json - store as data
    const data = await response.json()
    
    // return data
    return data
  }

  async getUser(email){
    // validate
    if(!email) return
    
    // fetch the json data
    const response = await fetch(`${App.apiBase}/handymen/${email}`)

    // if response not ok
    if(!response.ok){ 
      // console log error
      const err = await response.json()
      if(err) console.log(err)
      // throw error (exit this function)      
      throw new Error('Problem getting user')
    }
    
    // convert response payload into json - store as data
    const data = await response.json()
    // return data
    return data
  }

  // uploadProfileImage(image){
  //   // Load the AWS SDK for Node.js
  //   var AWS = require('aws-sdk');
  //   // Set the region 
  //   AWS.config.update({region: 'us-east-1'});

  //   // Create S3 service object
  //   var s3 = new AWS.S3({apiVersion: '2006-03-01'});

  //   // call S3 to retrieve upload file to specified bucket
  //   var uploadParams = {Bucket: 'handymen-avatars', Key: '', Body: ''};
  //   var file = image;
  //   console.log(image)

  //   // Configure the file stream and obtain the upload parameters
  //   // var reader = new FileReader();
  //   // reader.readAsDataURL(file);
    
  //   //var fileStream = fs.createReadStream('titus.jpg');
  //   var fileStream = fs.readFile('./titus.jpg')
  //   fileStream.on('error', function(err) {
  //     console.log('File Error', err);
  //   });
  //   uploadParams.Body = fileStream;
  //   var path = require('path');
  //   uploadParams.Key = path.basename(file);

  //   // call S3 to retrieve upload file to specified bucket
  //   s3.upload (uploadParams, function (err, data) {
  //     if (err) {
  //       console.log("Error", err);
  //     } if (data) {
  //       console.log("Upload Success", data.Location);
  //     }
  //   });
  // }
}

export default new UserAPI()