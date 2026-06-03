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
    <div>

      <div 
        id='Home'
        className="relative"
        style={{
          backgroundImage: `url(${girl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

       <Navbar/>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07162d]/95 via-[#07162d]/75 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10">

         

          {/* HERO TEXT */}
          <h1 className='mt-[30px] font-bold text-yellow-400 ml-[7%] text-[30px]'>
            Welcome to Unicode University
          </h1>

          <p className='mt-[40px] ml-[7%] text-[60px] text-white font-bold'>
            Empowering<br />
            Students for a<br />
            <span className='text-yellow-400'>Brighter Tomorrow</span>
          </p>

          <p className='text-[23px] mt-[20px] ml-[7%] text-white'>
            we provide a nurturing environment<br />
            that inspires excellence foster creativity<br />
            and prepare students to become<br />
            Future Leaders.
          </p>

          <button className='bg-yellow-400 text-black p-[15px_40px] rounded-[8px] ml-[7%] mt-[30px] cursor-pointer text-[23px] mb-[15%]'>
            Read more
          </button>

          {/* STATS SECTION */}
          <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 w-[90%]">

            <div className="bg-white rounded-[20px] shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6 p-8">

              <div className="text-center">
                <div className="text-yellow-500 text-4xl font-bold">15+</div>
                <p className="text-gray-800 font-semibold">Years of Excellence</p>
                <p className="text-gray-500 text-sm">In quality education</p>
              </div>

              <div className="text-center">
                <div className="text-blue-600 text-4xl font-bold">4500+</div>
                <p className="text-gray-800 font-semibold">Happy Students</p>
                <p className="text-gray-500 text-sm">Enrolled across all levels</p>
              </div>

              <div className="text-center">
                <div className="text-green-600 text-4xl font-bold">250+</div>
                <p className="text-gray-800 font-semibold">Qualified Lecturers</p>
                <p className="text-gray-500 text-sm">Dedicated to excellence</p>
              </div>

              <div className="text-center">
                <div className="text-purple-600 text-4xl font-bold">95%</div>
                <p className="text-gray-800 font-semibold">Success Rate</p>
                <p className="text-gray-500 text-sm">In national exams</p>
              </div>

            </div>

          </div>

        </div>

      </div>


    <div id="Leaders" className="px-4 md:px-0">

  <h2 className="text-center text-[28px] md:text-[40px] text-yellow-400 mt-[7%]">
    Heads
  </h2>

  {/* Scroll container */}
  <div className="w-full md:w-[1320px] mt-[50px] mb-[50px] mx-auto overflow-x-auto scrollbar-hide">

    {/* Flex row for cards */}
    <div className="flex gap-[20px] md:gap-[40px] w-max px-4">

      {/* Card 1 */}
      <div className="flex-shrink-0">
        <img src={peter} className="w-[220px] md:w-[300px] h-[280px] md:h-[370px] rounded-[8px] border-[4px] border-yellow-400 object-cover" />
        <p className="text-center mt-[13px]">Chancellor</p>
      </div>

      {/* Card 2 */}
      <div className="flex-shrink-0">
        <img src={bursary} className="w-[220px] md:w-[300px] h-[280px] md:h-[370px] rounded-[8px] border-[4px] border-yellow-400 object-cover" />
        <p className="text-center mt-[13px]">Bursary</p>
      </div>

      {/* Card 3 */}
      <div className="flex-shrink-0">
        <img src={sabastine} className="w-[220px] md:w-[300px] h-[280px] md:h-[370px] rounded-[8px] border-[4px] border-yellow-400 object-cover" />
        <p className="text-center mt-[13px]">V. Chancellor</p>
      </div>

      {/* Card 4 */}
      <div className="flex-shrink-0">
        <img src={judith} className="w-[220px] md:w-[300px] h-[280px] md:h-[370px] rounded-[8px] border-[4px] border-yellow-400 object-cover" />
        <p className="text-center mt-[13px]">Registrar</p>
      </div>

      {/* Card 5 */}
      <div className="flex-shrink-0">
        <img src={Dera} className="w-[220px] md:w-[300px] h-[280px] md:h-[370px] rounded-[8px] border-[4px] border-yellow-400 object-cover" />
        <p className="text-center mt-[13px]">Dean</p>
      </div>

      {/* Card 6 */}
      <div className="flex-shrink-0">
        <img src={Tolu} className="w-[220px] md:w-[300px] h-[280px] md:h-[370px] rounded-[8px] border-[4px] border-yellow-400 object-cover" />
        <p className="text-center mt-[13px]">Finances</p>
      </div>

    </div>
  </div>
</div>

       <div id='About'>

         <div className='flex-col md:flex-row flex gap-[6%]'>

        <img src={two} className='w-[500px] h-[650px] rounded-[8px] ml-[40px] border-[3px] border-yellow-400'/>
            
            <div>

         <p className='text-[50px] pt-[60px]'>About Unicode</p>

         <p className='pt-[40px] text-[20px]'>
          Unicode University is a forward-thinking institution dedicated 
          to empowering students with knowledge, innovation,  practical
          skills for success in a rapidly evolving global world. where 
         creativity meets excellence and education goes beyond the classroom.</p>

         <p className='pt-[30px] text-[20px]'>
          At Unicode University, we believe in nurturing not only academic
          growth but also personal development. Our students are encouraged
          to think critically, solve real-world problems, and become impactful
          contributors to society.</p>

          <p className='text-[20px] pt-[30px]'>
           With modern facilities, experienced faculty, and a strong focus on 
           research and innovation, Unicode University stands as a place where
           future leaders are shaped and dreams are transformed into reality. 
          </p>
        </div>

         </div>

       </div>

       <div id='Mission'>

         <div style={{backgroundColor : "#1b1425"}} className='flex-col md:flex-row mt-[70px]'>
        <p className='text-[#facc15] text-[40px] pt-[10%] text-center font-bold'>Our Mission</p>
        <p className='text-[#d1d5db] text-center text-[25px] font-bold pt-[40px] pb-[10%]'>
          To provide high-quality education that empowers students to become responsible,<br/>
          innovative, and successful global citizens. To be a leading institution recognized
               for academic excellence, character development, and student success.
          </p>
          </div>

       </div>
       
    <section className="bg-[#0d1b34] py-20 mt-[10%]" id='Rules'>
  <div className="max-w-6xl mx-auto px-8">

    <h2 className="text-center text-yellow-400 text-5xl font-bold mb-16">
      Terms & Privacy
    </h2>

    <div className="flex flex-col md:flex-row gap-12">

      {/* Terms */}
      <div className="flex-1">
        <h3 className="text-yellow-400 text-3xl font-bold mb-4">
          Terms & Conditions
        </h3>

        <p className="text-gray-300 text-lg leading-8">
          By using this website, you agree to follow all rules and guidelines.
          All content is for educational purposes. Users must not misuse,
          damage, or interfere with the website. We reserve the right to
          update content at any time.
        </p>
      </div>

      {/* Privacy */}
      <div className="flex-1">
        <h3 className="text-yellow-400 text-3xl font-bold mb-4">
          Privacy Policy
        </h3>

        <p className="text-gray-300 text-lg leading-8">
          We respect your privacy. Any information collected is used only
          for communication and school purposes. We do not sell or share
          your data with third parties except when required by law.
        </p>
      </div>

    </div>

  </div>
</section>

     <div style={{backgroundColor: "#fdf6ec"}} className='flex-col md:flex-row mt-[10%]' id='Courses'>
      
       <p className='pt-[40px] text-[30px] text-[#facc15] font-bold pt-[50px]'>Examples of the type of Courses we Offer</p>

       <div className='flex-col md:flex-row flex gap-[30px] mt-[6%] items-center justify-center mb-[10%] pb-[13%]'>

      <div>
        <img src={Economics}  className='w-[280px] h-[300px]'/>

              <div className='bg-white p-5 shadow-[0_4px_20px_rgba(255,255,255,0.18)]'>
        <p className='pt-[20px] text-[20px] '>Economics</p>
        <p className='pt-[20px] text-[15px] pb-[30px]'>
          Study how money, resources,shape<br/>
          societies and economic growth.</p>
          </div>

      </div>

       <div>
        <img src={cybersecurity}  className='w-[340px] h-[300px]'/>

           <div  className='bg-white p-5 shadow-[0_4px_20px_rgba(255,255,255,0.18)]'>
        <p className='pt-[20px] text-[20px] pl-[30px]'>Cyber Security</p>
        <p className='pt-[20px] text-[15px] pl-[30px] pb-[30px]'>
         Study how to secure systems and protect<br/>
         data from cyber attacks and threats.</p>
          </div>

      </div>

         <div>
        <img src={Nursing}  className='w-[290px] h-[300px]'/>

           <div className='bg-white p-5 shadow-[0_4px_20px_rgba(255,255,255,0.18)]'>
        <p className='pt-[20px] text-[20px] pl-[30px]'>Nursing</p>
        <p className='pt-[20px] text-[15px] pl-[30px] pb-[30px]'>
         Study how to care for patients and<br/>
         support health and wellbeing.</p>
         </div>
      </div>

         <div>
        <img src={DataAnalysist}  className='w-[390px] h-[300px]'/>

           <div className='bg-white p-5 shadow-[0_4px_20px_rgba(255,255,255,0.18)]'>
        <p className='pt-[20px] text-[20px] pl-[30px]'>Data Analysist</p>
        <p className='pt-[20px] text-[15px] pl-[30px] pb-[30px]'>
        Learn how to collect, analyze, and interpret data<br/>
         to help make better business decisions.</p>   
         </div> 

      </div>

        
       </div>

     </div>

     <Footer/>

    </div>
  )
}

export default App
