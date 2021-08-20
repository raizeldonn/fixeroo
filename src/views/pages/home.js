import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute } from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'
import HandymanAPI from '../../HandymanAPI'
import Toast from '../../Toast'

class HomeView {
  init(){    
    console.log('HomeView.init')
    document.title = 'Home'    
    this.render() 
    Utils.pageIntroAnim()    
  }

  render(){
    const template = html`
      <va-app-header title="Home" user=${JSON.stringify(Auth.currentUser)}></va-app-header>
      
      <div class="page-content home-page">
        <section class='tools'>
          <img  class='tools-img' src="/images/tools.jpg">
          <h1>Welcome to Fixeroo</h1>
          <h3>where you can find the handyman tailored to YOUR needs</h3>
          <div class='btn-cont'>
            <button @click=${() => gotoRoute('/handymen')}>Browse Handymen</button>
          </div>
        </section>

        <section class='map'>
          <h1>Come visit our head office!</h1>
          <p>We are open Sunday to Friday, 9-5</p>
          <!--https://developers.google.com/maps/documentation/embed/get-started-->
          <iframe width="100%" height="250" style="border:0" loading="lazy" allowfullscreen
          src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJC4-55lNo1moRhWv-Xn5G4hc&key=AIzaSyBlgJdaNAjanXndDIrgBz7tqsotkj-09Ww">
          </iframe>
        </section>
        
        <section class='our-handymen'>
          <h1>Our handymen get 20% more jobs than the average handyman</h1>
          <h3>Sign up to add yourself to that statistic!</h3>
          <button @click=${() => gotoRoute('/signup')}>Sign Up</button>
        </section>
      </div>
     
    `
    render(template, App.rootEl)
  }
}

export default new HomeView()