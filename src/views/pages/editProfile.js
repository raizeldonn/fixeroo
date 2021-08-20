import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'
import UserAPI from './../../UserAPI'
import Toast from '../../Toast'
import moment from 'moment'

class EditProfileView {
  init(){
    console.log('EditProfileView.init')
    document.title = 'Edit Profile'    
    this.user = null
    this.render()    
    Utils.pageIntroAnim()
    this.getUser()    
  }

  async getUser(){
    try {
      this.user = await UserAPI.getUser(Auth.currentUser.email)      

      this.render()
    }catch(err){
      Toast.show(err, 'error')
    }
  }

  async updateProfileSubmitHandler(e){
    e.preventDefault()
    const formData = e.detail.formData
    
    let firstName = formData.get('firstName')
    let lastName = formData.get('lastName')
    let field = formData.get('field')
    let experience = formData.get('experience')
    let price = formData.get('price')
    let neatness = formData.get('neatness')
    let safety = formData.get('safety')
    let pets = formData.get('pets')
    let policeCheck = formData.get('policeCheck')

    let profileImage = document.querySelector('#avatar')

    const submitBtn = document.querySelector('.submit-btn')
    submitBtn.setAttribute('loading', '')
    // UserAPI.uploadProfileImage(avatar)
    
    try {
      // Utils.saveImage(profileImage);
      // let imageUrl = localStorage.getItem("avatar")
      // console.log(imageUrl)
      console.log(profileImage.files[0])
      if (profileImage.files[0] != undefined){
        await UserAPI.uploadProfileImageS3(firstName, lastName, profileImage.files[0])
      }
      const updatedUser = await UserAPI.updateUser(Auth.currentUser.email, Auth.currentUser.password, firstName, lastName, 
        field, experience, price, neatness, safety, pets, policeCheck)   
          
      this.render()
      Toast.show('profile updated')
    }catch(err){      
      Toast.show(err, 'error')
    }
    submitBtn.removeAttribute('loading')
  }

  render(){
    const template = html`
      <va-app-header title="Edit Profile" user=${JSON.stringify(Auth.currentUser)}></va-app-header>
      <div class="page-content">        
        ${(this.user == null) ? html`
          <sl-spinner></sl-spinner>
        `:html`
          <p>Updated: ${moment(Auth.currentUser.updatedAt).format('MMMM Do YYYY, @ h:mm a')}</p>
          <sl-form class="page-form" @sl-submit=${this.updateProfileSubmitHandler.bind(this)} enctype="multipart/form-data">
            <div class="input-group">
              <sl-input type="text" label="First Name" name="firstName" value="${this.user.Item.firstName}" placeholder="First Name"></sl-input>
            </div>
            <div class="input-group">
              <sl-input type="text" label="Last Name" name="lastName" value="${this.user.Item.lastName}" placeholder="Last Name"></sl-input>
            </div>

            <div class="input-group">
            ${this.user.Item.field == null ? html`
            <sl-select name='field' label="Field of expertise" placeholder='Field of expertise' required>
                <sl-menu-item value='carpentry'>Carpentry</sl-menu-item>
                <sl-menu-item value='plumbing'>Plumbing</sl-menu-item>
                <sl-menu-item value='maintenance'>Maintenance</sl-menu-item>
                <sl-menu-item value='painting'>Painting</sl-menu-item>
                <sl-menu-item value='electrical'>Electrical</sl-menu-item>
            </sl-select>
            ` : html`
            <sl-select name='field' label="Field of expertise" placeholder='Field of expertise' value="${this.user.Item.field}" required>
                <sl-menu-item value='carpentry'>Carpentry</sl-menu-item>
                <sl-menu-item value='plumbing'>Plumbing</sl-menu-item>
                <sl-menu-item value='maintenance'>Maintenance</sl-menu-item>
                <sl-menu-item value='painting'>Painting</sl-menu-item>
                <sl-menu-item value='electrical'>Electrical</sl-menu-item>
            </sl-select>
            `}
              
            </div>   

            <div class="input-group">
              ${this.user.Item.experience == null ? html`
              <sl-input type="number" name="experience" label="Years of Experience" placeholder="Years of Experience"></sl-input>
              ` : html`
              <sl-input type="number" name="experience" label="Years of Experience"  value="${this.user.Item.experience}" placeholder="Years of Experience"></sl-input>
              `}
            </div>      
            
            <div class="input-group">
              ${this.user.Item.price == null ? html`
              <sl-input name="price" label="Price per hour (AUD) " placeholder="$" value="enter price">
              <span slot='prefix'>$</span>
              </sl-input>
              ` : html`
              <sl-input name="price" label="Price per hour (AUD) " placeholder="$" value="${this.user.Item.price}">
              <span slot='prefix'>$</span>
              </sl-input>`}
            </div>

            <div class="input-group">
              ${this.user.Item.neatness == null ? html`
              <sl-input name="neatness" label="Works Neatly (between 0 to 100) " pattern="^[1-9][0-9]?$|^100$" placeholder="enter neatness"></sl-input>
              `: html`
              <sl-input name="neatness" label="Works Neatly (between 0 to 100) " pattern="^[1-9][0-9]?$|^100$" value="${this.user.Item.neatness}"></sl-input>
              `}
            </div>

            <div class="input-group">
              ${this.user.Item.safety == null ? html`
              <sl-input name="safety" label="Safety Concious (between 0 to 100) " pattern="^[1-9][0-9]?$|^100$" placeholder="enter safety conciousness"></sl-input>
              `: html`
              <sl-input name="safety" label="Safety Concious (between 0 to 100) " pattern="^[1-9][0-9]?$|^100$" value="${this.user.Item.safety}"></sl-input>
              `}
            </div>

            <div class="input-group">
              <sl-checkbox class='checkbox' name="pets" value="true">
                Okay with pets
              </sl-checkbox> 
            </div>

            <div class="input-group">
              <sl-checkbox class='checkbox' name="policeCheck" value="true">
                Police Check
              </sl-checkbox>  
            </div> 


            <div class="input-group">
              <label>Avatar</label><br>          
              ${(this.user.avatar) ? html`
                <sl-avatar image="${App.apiBase}/images/${this.user.avatar}"></sl-avatar>
                <input id="avatar" type="file" name="avatar" />
              `: html`
                <input id="avatar" type="file" name="avatar" />
              `}
            </div>
            <sl-button type="primary" class="submit-btn" submit>Update Profile</sl-button>
          </sl-form>
        `}
      </div>
    `
    render(template, App.rootEl)
  }
}

export default new EditProfileView()