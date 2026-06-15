import React from 'react'
import { useNavigate } from "react-router-dom"

import girl from "../assets/girl.jpg";
import school from "../assets/school.png"
import peter from "../assets/peter.jpg"
import bursary from "../assets/bursary.jpg";
import sabastine from "../assets/sabastine.jpg";
import judith from "../assets/judith.jpg";
import Dera from "../assets/Dera.jpg";
import Tolu from "../assets/Tolu.jpg";
import two from "../assets/two.jpg";
import Economics from "../assets/Economics.jpg";
import cybersecurity from "../assets/cyber security.jpg";
import Nursing from "../assets/Nursing.jpg";
import DataAnalysist from "../assets/Data Analysist.jpg";
import SoftwareEngineering from "../assets/Software Engineering.jpg";
import pyhsics from "../assets/physis.jpg"
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const App = () => {

    const navigate = useNavigate();

  return (
    <div className="font-sans text-gray-800 bg-gray-50 overflow-x-hidden">

      {/* HERO SECTION */}
      <div 
        id='Home'
        className="relative min-h-[90vh] flex flex-col w-full"
        style={{
          backgroundImage: `url(${girl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Navbar/>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07162d]/95 via-[#07162d]/80 to-transparent"></div>

        {/* Hero Content */}
        <div className="relative z-10 flex-grow flex flex-col justify-center max-w-7xl mx-auto w-full px-6 lg:px-8 pb-32 pt-20">
          
          <h1 className='font-bold text-yellow-400 text-2xl md:text-3xl tracking-wide uppercase mb-4'>
            Welcome to Unicode University
          </h1>

          <p className='text-5xl md:text-7xl text-white font-extrabold leading-tight mb-6'>
            Empowering <br className="hidden md:block" />
            Students for a <br className="hidden md:block" />
            <span className='text-yellow-400'>Brighter Tomorrow</span>
          </p>

          <p className='text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed mb-10'>
            We provide a nurturing environment that inspires excellence, fosters creativity, 
            and prepares students to become Future Leaders.
          </p>

          <button className='bg-yellow-400 hover:bg-yellow-300 transition-colors duration-300 text-black font-semibold py-4 px-10 rounded-lg w-max text-lg shadow-lg'>
            Read more
          </button>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="relative z-20 -mt-20 max-w-7xl mx-auto px-6 lg:px-8 mb-20">
        <div className="bg-white rounded-2xl shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 p-10">
          <div className="text-center">
            <div className="text-yellow-500 text-5xl font-extrabold mb-2">15+</div>
            <p className="text-gray-800 font-bold text-lg">Years of Excellence</p>
            <p className="text-gray-500 text-sm mt-1">In quality education</p>
          </div>
          <div className="text-center">
            <div className="text-blue-600 text-5xl font-extrabold mb-2">4500+</div>
            <p className="text-gray-800 font-bold text-lg">Happy Students</p>
            <p className="text-gray-500 text-sm mt-1">Enrolled across all levels</p>
          </div>
          <div className="text-center">
            <div className="text-green-600 text-5xl font-extrabold mb-2">250+</div>
            <p className="text-gray-800 font-bold text-lg">Qualified Lecturers</p>
            <p className="text-gray-500 text-sm mt-1">Dedicated to excellence</p>
          </div>
          <div className="text-center">
            <div className="text-purple-600 text-5xl font-extrabold mb-2">95%</div>
            <p className="text-gray-800 font-bold text-lg">Success Rate</p>
            <p className="text-gray-500 text-sm mt-1">In national exams</p>
          </div>
        </div>
      </div>

      {/* LEADERS SECTION */}
      <div id="Leaders" className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <h2 className="text-center text-3xl md:text-5xl font-bold text-[#07162d] mb-12">
          University <span className="text-yellow-500">Heads</span>
        </h2>

        <div className="w-full overflow-x-auto pb-8 snap-x scrollbar-hide">
          <div className="flex gap-6 md:gap-8 w-max px-4">
            {[
              { img: peter, title: "Chancellor" },
              { img: bursary, title: "Bursary" },
              { img: sabastine, title: "V. Chancellor" },
              { img: judith, title: "Registrar" },
              { img: Dera, title: "Dean" },
              { img: Tolu, title: "Finances" },
            ].map((leader, index) => (
              <div key={index} className="flex-shrink-0 snap-center group cursor-pointer">
                <div className="overflow-hidden rounded-xl border-4 border-yellow-400 shadow-md transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                  <img src={leader.img} alt={leader.title} className="w-[240px] md:w-[280px] h-[320px] md:h-[360px] object-cover" />
                </div>
                <p className="text-center mt-4 text-lg font-semibold text-gray-800">{leader.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div id='About' className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
            <img src={two} alt="About Unicode" className='w-full h-auto object-cover rounded-2xl shadow-lg border-4 border-white'/>
          </div>
            
          <div className="space-y-6">
            <h2 className='text-4xl md:text-5xl font-bold text-[#07162d]'>About Unicode</h2>
            <p className='text-lg text-gray-600 leading-relaxed'>
              Unicode University is a forward-thinking institution dedicated 
              to empowering students with knowledge, innovation, and practical
              skills for success in a rapidly evolving global world. It is where 
              creativity meets excellence and education goes beyond the classroom.
            </p>
            <p className='text-lg text-gray-600 leading-relaxed'>
              At Unicode University, we believe in nurturing not only academic
              growth but also personal development. Our students are encouraged
              to think critically, solve real-world problems, and become impactful
              contributors to society.
            </p>
            <p className='text-lg text-gray-600 leading-relaxed'>
              With modern facilities, experienced faculty, and a strong focus on 
              research and innovation, Unicode University stands as a place where
              future leaders are shaped and dreams are transformed into reality. 
            </p>
          </div>
        </div>
      </div>

      {/* MISSION SECTION */}
      <div id='Mission' className='bg-[#1b1425] py-24 px-6 lg:px-8 my-10'>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className='text-yellow-400 text-4xl md:text-5xl font-bold uppercase tracking-widest'>Our Mission</h2>
          <p className='text-gray-300 text-xl md:text-2xl font-light leading-relaxed'>
            To provide high-quality education that empowers students to become responsible,
            innovative, and successful global citizens. To be a leading institution recognized
            for academic excellence, character development, and student success.
          </p>
        </div>
      </div>
       
      {/* RULES / TERMS SECTION */}
      <section id='Rules' className="bg-[#0d1b34] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-center text-yellow-400 text-4xl md:text-5xl font-bold mb-16">
            Terms & Privacy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
              <h3 className="text-yellow-400 text-2xl font-bold mb-4">
                Terms & Conditions
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                By using this website, you agree to follow all rules and guidelines.
                All content is for educational purposes. Users must not misuse,
                damage, or interfere with the website. We reserve the right to
                update content at any time.
              </p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
              <h3 className="text-yellow-400 text-2xl font-bold mb-4">
                Privacy Policy
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                We respect your privacy. Any information collected is used only
                for communication and school purposes. We do not sell or share
                your data with third parties except when required by law.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES SECTION */}
      <div id='Courses' className='bg-[#fdf6ec] py-24'>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className='text-3xl md:text-5xl text-[#07162d] font-bold mb-4'>Academic Programs</h2>
            <p className='text-xl text-yellow-600 font-medium'>Examples of the type of Courses we Offer</p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            
            {/* Course Cards */}
            {[ 
                { img: Economics, title: "Economics", desc: "Study how money and resources shape societies and drive economic growth." },
                { img: cybersecurity, title: "Cyber Security", desc: "Study how to secure systems and protect data from cyber attacks and threats." },
                { img: Nursing, title: "Nursing", desc: "Study how to care for patients, support health, and promote overall wellbeing." },
                { img: DataAnalysist, title: "Data Analyst", desc: "Learn how to collect, analyze, and interpret data to help make better business decisions." }
            ].map((course, i) => (
              <div key={i} className='bg-white rounded-xl overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col'>
                <img src={course.img} alt={course.title} className='w-full h-56 object-cover'/>
                <div className='p-6 flex-grow flex flex-col'>
                  <h3 className='text-xl font-bold text-[#07162d] mb-3'>{course.title}</h3>
                  <p className='text-gray-600 text-sm leading-relaxed'>{course.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer/>

    </div>
  )
}

export default App