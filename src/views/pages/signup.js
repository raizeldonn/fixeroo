import App from './../../App'
import Auth from './../../Auth'
import {html, render } from 'lit-html'
import {anchorRoute, gotoRoute} from './../../Router'
import Utils from './../../Utils'

class SignUpView{
   
  init(){      
    console.log('SignUpView.init')  
    document.title = 'Sign In'    
    this.render()
    Utils.pageIntroAnim()
  }

  signUpSubmitHandler(e){
    e.preventDefault()    
    const submitBtn = document.querySelector('.submit-btn')
    submitBtn.setAttribute('loading', '')    
    const formData = e.detail.formData
    
    // sign up using Auth
    let accessLevel = formData.get('accessLevel')
    let firstName = formData.get('firstName')
    let lastName = formData.get('lastName')
    let email = formData.get('email')
    let password = formData.get('password')
    
    Auth.signUp(accessLevel, firstName, lastName, email, password, formData, () => {
      submitBtn.removeAttribute('loading')
    })   
  }

  render(){
    const template = html`      
      <div class="page-content page-centered">      
        <div class="signinup-box">
        <img class="signinup-logo" src="/images/fixeroo.png">
          <h1>Sign Up</h1>
          <sl-form class="form-signup" @sl-submit=${this.signUpSubmitHandler}>
            <div class="input-group">
              <sl-input name="firstName" type="text" placeholder="First Name" required></sl-input>
            </div>
            <div class="input-group">
              <sl-input name="lastName" type="text" placeholder="Last Name" required></sl-input>
            </div>
            <div class="input-group">
              <sl-input name="email" type="email" placeholder="Email" required></sl-input>
            </div>
            <div class="input-group">
              <sl-input name="password" type="password" placeholder="Password" required toggle-password></sl-input>
            </div>          
            <div class="input-group">
              <sl-select name='accessLevel' placeholder='I am a...' required>
                <sl-menu-item value='1'>Customer</sl-menu-item>
                <sl-menu-item value='2'>Handyman</sl-menu-item>\
              </sl-select>
            </div>   
            <sl-button type="primary" class="submit-btn" submit style="width: 100%;">Sign Up</sl-button>
          </sl-form>
          <p>Have an account? <a href="/signin" @click=${anchorRoute}>Sign In</a></p>
        </div>
      </div>
    `
    render(template, App.rootEl)
  }
}


export default new SignUpView()