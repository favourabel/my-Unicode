import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import school from "../assets/school.png";
import { IoMdMenu } from "react-icons/io";

const Navbar = () => {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div>

      {/* ================= DESKTOP NAVBAR FIXED ================= */}
      <nav className='hidden md:flex items-center justify-between w-full px-10 py-4 relative z-50'>

        {/* LEFT: LOGO */}
        <div className='flex items-center'>
          <img
            src={school}
            className="w-[60px] h-[60px] object-contain rounded-[8px]"
          />
        </div>

        {/* CENTER: NAV LINKS */}
        <ul className='flex gap-[30px] text-[23px] text-white items-center'>
          <li><a href='#Home'>Home</a></li>
          <li><a href='#Leaders'>Leaders</a></li>
          <li><a href='#About'>About</a></li>
          <li><a href='#Mission'>Mission</a></li>
          <li><a href='#Rules'>Rules</a></li>
          <li><a href='#Courses'>Courses</a></li>
        </ul>

        {/* RIGHT: BUTTONS */}
        <div className='flex items-center'>

          <button
            onClick={() => navigate("/signup")}
            className="bg-yellow-400 text-white p-[13px] py-2 rounded-lg"
          >
            Signup
          </button>

          <button
            onClick={() => navigate("/login")}
            className="text-black px-6 py-3 rounded-[8px] border-[3px] border-yellow-400 ml-[10px]"
          >
            Login
          </button>

        </div>

      </nav>

      {/* ================= MOBILE NAVBAR ================= */}
      <div className='flex md:hidden justify-between items-center w-full px-4 relative z-50'>

        {/* LEFT SIDE */}
        <div className='flex items-center gap-[10px]'>

          <img src={school} className='w-[40px] h-[40px]' />

          <div
            onClick={() => setOpen(!open)}
            className="cursor-pointer flex items-center justify-center"
          >
            <IoMdMenu className='w-[60px] h-[60px]' />
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className='flex items-center'>

          <button
            onClick={() => navigate("/signup")}
            className="bg-yellow-400 text-white px-4 py-2 rounded-lg"
          >
            Signup
          </button>

          <button
            onClick={() => navigate("/login")}
            className="text-black px-4 py-2 border ml-[10px] border-yellow-400"
          >
            Login
          </button>

        </div>

      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className='md:hidden absolute top-[70px] left-0 w-full bg-[#07162d] text-white flex flex-col gap-4 p-6 z-[9999]'>
          <a onClick={() => setOpen(false)} href="#Home">Home</a>
          <a onClick={() => setOpen(false)} href="#Leaders">Leaders</a>
          <a onClick={() => setOpen(false)} href="#About">About</a>
          <a onClick={() => setOpen(false)} href="#Mission">Mission</a>
          <a onClick={() => setOpen(false)} href="#Rules">Rules</a>
          <a onClick={() => setOpen(false)} href="#Courses">Courses</a>
        </div>
      )}

    </div>
  )
}

export default Navbar;