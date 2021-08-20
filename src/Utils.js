import gsap from 'gsap'
import fs from 'fs' 

class Utils {

  saveImage(image) {
    // https://www.youtube.com/watch?v=8K2ihr3NC40
    const reader = new FileReader();

    reader.addEventListener("load", ()=>{
      localStorage.setItem("avatar", reader.result)
    })

    reader.readAsDataURL(image.files[0])
  }

  isMobile(){
    let viewportWidth = window.innerWidth
    if(viewportWidth <= 768){
      return true
    }else{
      return false
    }
  }


  pageIntroAnim(){
    const pageContent = document.querySelector('.page-content')
    if(!pageContent) return
    gsap.fromTo(pageContent, {opacity: 0, y: -12}, {opacity: 1, y: 0, ease: 'power2.out', duration: 0.3})
  }
}

export default new Utils()