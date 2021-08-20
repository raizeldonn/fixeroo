import App from '../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../Auth'
import Utils from '../../Utils'
import HandymanAPI from '../../HandymanAPI'
import Toast from '../../Toast'
import UserAPI from '../../UserAPI'

class HandymenView {
  init(){
    document.title = 'Handymen'  
    this.handymen = null    
    this.render() 
    this.getHandymen() 
    Utils.pageIntroAnim()     
  }
  async getHandymen(){
    try{
      let handymenItems = await HandymanAPI.getHandymen()
      this.handymen = handymenItems.Items
    }
    catch(err){
      console.log(err)
    }
    
    this.render()
  }

    //handle a booking
    bookingSubmitHandler(e){
      //forms tend to refresh the page when submitted,
      // so we prevent that in a SPA
      e.preventDefault()
      //atm data is not being sent anywhere
      //we simply show a notification to the user
      Toast.show('booking request sent to cleaner. the cleaner will contact you shortly')
      this.bookingDialog.hide()
    }
  
    //when user selects 'book' create & show a booking dialog
    bookHandler(handyman){
      //create booking dialog
      this.bookingDialog = document.createElement('sl-dialog')
      this.bookingDialog.className = 'booking-dialog'
      //add content
      const dialogContent = html`
      <h2>book: ${handyman.firstName} ${handyman.lastName}</h2>
      <hr class='grey-line' />
      <sl-form class="form-signup" @sl-submit=${this.bookingSubmitHandler.bind(this)}>
            <!--the current user must be sent with the form ,so we do it in a hidden field-->
            <input type="hidden" name="user" value="${Auth.currentUser._id}" />
            <div class="input-group">
              <sl-input name="dateTime" label="Enter Date and Time" type="text" required></sl-input>
            </div>
            <div class="input-group">              
              <sl-input name="phone" type="text" label="Enter Phone Number" required></sl-input>
            </div>
            <p>${handyman.firstName} will call you to confirm the booking</p>
            <sl-button type="primary" class="submit-btn" submit>Book</sl-button>
          </sl-form>       
      `
      render(dialogContent, this.bookingDialog)
      //append to document.body
      document.body.append(this.bookingDialog)
      //show the dialog
      this.bookingDialog.show()
      //on hide, delete the dialog
      this.bookingDialog.addEventListener('sl-after-hide', ()=>{
        this.bookingDialog.remove()
      })
      
    }
  

    //hanlde a review
    async reviewSubmitHandler(e){
      e.preventDefault()
      const formData = e.detail.formData
      let email = formData.get('user')
      let rating = document.querySelector('#rating')
      let message = formData.get('message')

      const submitBtn = document.querySelector('.review-btn')
      submitBtn.setAttribute('loading', '')
      try{
        // hope to send the review to backend, but in the meantime
        // will just show toast that it was received
        await UserAPI.addReview(email, rating.value, message)
        Toast.show('review added!')
        this.reviewDialog.hide()
      }
      catch(err){
        Toast.show(err, 'error')
        submitBtn.removeAttribute('loading', '')
      }
    }

  //when user selects 'review' create & show a review dialog
  reviewHandler(handyman){
    //create review dialog
    this.reviewDialog = document.createElement('sl-dialog')
    this.reviewDialog.className = 'review-dialog'
    //add content
    const dialogContent = html`
    <h2>Review</h2>
    <hr class='grey-line' />
    <p>${this.name}</p>
    <sl-form class="form-signup" @sl-submit=${this.reviewSubmitHandler.bind(this)}>
          <!--the current user must be sent with the form ,so we do it in a hidden field-->
          <input type="hidden" name="user" value="${handyman.email}" />
          <div class="input-group">
            <sl-textarea name="message"></sl-textarea>
          </div>
          <div class="input-group">
            <sl-rating class='review-dialog-rating' id="rating" name="rating"></sl-rating>
          </div>
          <sl-button type="primary" class="review-btn" submit>Leave Review</sl-button>
        </sl-form>       
    `
    render(dialogContent,this.reviewDialog)
    //append to document.body
    document.body.append(this.reviewDialog)
    //show the dialog
    this.reviewDialog.show()
    //on hide, delete the dialog
    this.reviewDialog.addEventListener('sl-after-hide', ()=>{
      this.reviewDialog.remove()
    })
    
  }

  //when user selects 'more info' create & show a more info dialog
  moreInfoHandler(handyman){
    //create cleaner dialog
    this.handymanDialog = document.createElement('sl-dialog')
    this.handymanDialog.className = 'handyman-dialog'

    //add content
    const dialogContent = html`
          <h2>${handyman.firstName} ${handyman.lastName}</h2>
          <hr class='grey-line' />
          <div class='wrap'>
            <div class='handyman'>
              <sl-avatar class='handyman-dialog-avatar' style="--size: 6rem;" image="https://handymen-avatars.s3.amazonaws.com/${handyman.firstName}${handyman.lastName}.jpg" alt="cleaner avatar"></sl-avatar>
              ${handyman.rating == null ? html`
              <sl-rating readonly class='handyman-dialog-rating' value="0"></sl-rating>
              <p>not yet rated</p>` : html`
              <sl-rating readonly class='handyman-dialog-rating' value="${handyman.rating}"></sl-rating>`}
              
              <p>Field: ${handyman.field}</p>
              <p>$${handyman.price} /hour</p>
            </div>

            <div class='info'>
              <p>Years of Experience: ${handyman.experience}</p>
              <p>Works Neatly</p>
              <sl-progress-bar percentage="${handyman.neatness}" style="--height: 6px; --indicator-color: var(--brand-color);"></sl-progress-bar>
              <p>Safety Conscious</p>
              <sl-progress-bar percentage="${handyman.safety}" style="--height: 6px; --indicator-color: var(--brand-color);"></sl-progress-bar>
              ${(handyman.policeCheck == "false") ? html `` : 
              html `<div class='checkbox'><sl-icon style="color:grey;" name="check-square"></sl-icon><span> Police Check</span></div>`}
              ${(handyman.pets == "false") ? html `` : 
              html `<div class='checkbox'><sl-icon style="color:grey;" name="check-square"></sl-icon><span> Ok with pets</span></div>`}

              <sl-button class='more-btn' @click=${()=> this.reviewHandler(handyman)}>Write a Review</sl-button>
              <sl-button class='book-btn' @click=${()=> this.bookHandler(handyman)}>Book</sl-button>
            </div>
          </div>
    `
    render(dialogContent, this.handymanDialog)
    //append to document.body
    document.body.append(this.handymanDialog)
    //show the dialog
    this.handymanDialog.show()
    //on hide, delete the dialog
    this.handymanDialog.addEventListener('sl-after-hide', ()=>{
      this.handymanDialog.remove()
    })
  }

  render(){
    const template = html`
      <va-app-header title="Handymen" user=${JSON.stringify(Auth.currentUser)}></va-app-header>
      
      <div class="page-content">
        
        ${this.handymen == null ? 
          html`<p>Loading Handymen</p><sl-spinner></sl-spinner>`: 
          html`
          ${this.handymen.map(handyman => html`
        
          <sl-card class="handyman-card">
          <h2>${handyman.firstName} ${handyman.lastName}</h2>
          <hr class='grey-line' />
          <sl-avatar class='handyman-dialog-avatar' style="--size: 6rem;" image="https://handymen-avatars.s3.amazonaws.com/${handyman.firstName}${handyman.lastName}.jpg" alt="cleaner avatar"></sl-avatar>
          <p>Field: ${handyman.field}</p>
          <p>$ ${handyman.price} / hour</p>

          <sl-button class='more-btn' @click=${()=> this.moreInfoHandler(handyman)}>See More</sl-button>
          <sl-button class='book-btn' @click=${()=> this.bookHandler(handyman)}>Book</sl-button>
            </div>
          </div>
        </sl-card>

          `)}
          `}
      </div>
     
    `
    render(template, App.rootEl)
  }
}


export default new HandymenView()