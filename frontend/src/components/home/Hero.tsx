import image from "../../assets/images/hero-image.jpeg"
import { NavLink } from 'react-router';

const Hero = () => {
  return (
    <div>
        <div
        className="hero min-h-screen"
        style={{
            backgroundImage:
            `url(${image})`,
        }}
        >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
            <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-extrabold text-gray-200">Hello there</h1>
            <p className="mb-5 text-gray-200 text-xl font-bold">
                Welcome to EventFlow Management System. Here you will be able to book
                for various events at affordable prices.
            </p>
            <button className="btn btn-primary rounded-full text-gray-200 font-bold px-6 py-2 shadow-md hover:bg-gray-500 transition duration-300">
               <NavLink to="/login">Get Started</NavLink>
            </button>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Hero