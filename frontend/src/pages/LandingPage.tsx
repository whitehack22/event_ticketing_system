import Testimonials from "../components/about/Testimonials"
import Footer from "../components/footer/Footer"
import  Hero  from "../components/home/Hero"
import Navbar from "../components/nav/Navbar"


const LandingPage = () => {
  return (
    <div>
         <Navbar />
            <Hero />
            <Testimonials />
            <Footer />
    </div>
  )
}

export default LandingPage