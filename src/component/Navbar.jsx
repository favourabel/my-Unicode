import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

import school from "../assets/school.png";
import { IoMdMenu, IoMdClose } from "react-icons/io";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleScroll = (e, id) => {
    e.preventDefault();

    const scrollToSection = () => {
      const section = document.getElementById(id);
      if (section) {
        const top = section.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top,
          behavior: "smooth",
        });
        window.history.pushState(null, "", `#${id}`);
      }
    };

    if (open) {
      setOpen(false);
      setTimeout(scrollToSection, 350);
    } else {
      scrollToSection();
    }
  };

  const navLinkClass =
    "transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-yellow-300 hover:via-amber-400 hover:to-yellow-500";

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
        <ul className='flex gap-[30px] text-[20px] text-white items-center mr-[40px]'>
          <li><a href='#Home' onClick={(e) => handleScroll(e, "Home")} className={navLinkClass}>Home</a></li>
          <li><a href='#Leaders' onClick={(e) => handleScroll(e, "Leaders")} className={navLinkClass}>Leaders</a></li>
          <li><a href='#About' onClick={(e) => handleScroll(e, "About")} className={navLinkClass}>About</a></li>
          <li><a href='#Mission' onClick={(e) => handleScroll(e, "Mission")} className={navLinkClass}>Mission</a></li>
          <li><a href='#History' onClick={(e) => handleScroll(e, "History")} className={navLinkClass}>History</a></li>
          <li><a href='#Achievements' onClick={(e) => handleScroll(e, "Achievements")} className={navLinkClass}>Achievements</a></li>
          <li><a href='#Testimonials' onClick={(e) => handleScroll(e, "Testimonials")} className={navLinkClass}>Testimonials</a></li>
          <li><a href='#Events' onClick={(e) => handleScroll(e, "Events")} className={navLinkClass}>Events</a></li>
          <li><a href='#Rules' onClick={(e) => handleScroll(e, "Rules")} className={navLinkClass}>Rules</a></li>
          <li><a href='#Courses' onClick={(e) => handleScroll(e, "Courses")} className={navLinkClass}>Courses</a></li>
          <li><a href='#Gallery' onClick={(e) => handleScroll(e, "Gallery")} className={navLinkClass}>Gallery</a></li>
        </ul>

      </nav>

      {/* ================= MOBILE NAVBAR ================= */}
      <div className='flex md:hidden justify-between items-center w-full px-4 relative z-50'>

        <img src={school} className='w-[40px] h-[40px]' />

        <motion.button
          onClick={() => setOpen(!open)}
          className="cursor-pointer flex items-center justify-center z-[10000]"
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {!open && (
              <motion.div
                key="menu"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <IoMdMenu className='w-[60px] h-[60px] text-white' />
              </motion.div>
            )}
            {open && (
              <motion.div
                key="close"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <IoMdClose className='w-[60px] h-[60px] text-white' />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

      </div>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className='md:hidden absolute top-[70px] left-0 w-full bg-[#07162d]/95 backdrop-blur-md text-white flex flex-col gap-4 p-6 z-[9999] overflow-hidden shadow-2xl border-t border-white/10'
          >
            <a onClick={(e) => handleScroll(e, "Home")} href="#Home" className={`${navLinkClass} w-fit`}>Home</a>
            <a onClick={(e) => handleScroll(e, "Leaders")} href="#Leaders" className={`${navLinkClass} w-fit`}>Leaders</a>
            <a onClick={(e) => handleScroll(e, "About")} href="#About" className={`${navLinkClass} w-fit`}>About</a>
            <a onClick={(e) => handleScroll(e, "Mission")} href="#Mission" className={`${navLinkClass} w-fit`}>Mission</a>
            <a onClick={(e) => handleScroll(e, "History")} href="#History" className={`${navLinkClass} w-fit`}>History</a>
            <a onClick={(e) => handleScroll(e, "Achievements")} href="#Achievements" className={`${navLinkClass} w-fit`}>Achievements</a>
            <a onClick={(e) => handleScroll(e, "Testimonials")} href="#Testimonials" className={`${navLinkClass} w-fit`}>Testimonials</a>
            <a onClick={(e) => handleScroll(e, "Events")} href="#Events" className={`${navLinkClass} w-fit`}>Events</a>
            <a onClick={(e) => handleScroll(e, "Rules")} href="#Rules" className={`${navLinkClass} w-fit`}>Rules</a>
            <a onClick={(e) => handleScroll(e, "Courses")} href="#Courses" className={`${navLinkClass} w-fit`}>Courses</a>
            <a onClick={(e) => handleScroll(e, "Gallery")} href="#Gallery" className={`${navLinkClass} w-fit`}>Gallery</a>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default Navbar;