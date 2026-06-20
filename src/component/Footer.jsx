import React from 'react'

const Footer = () => {

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: "Home", id: "Home" },
    { label: "Leaders", id: "Leaders" },
    { label: "About", id: "About" },
    { label: "Mission", id: "Mission" },
    { label: "History", id: "History" },
    { label: "Achievements", id: "Achievements" },
    { label: "Testimonials", id: "Testimonials" },
    { label: "Events", id: "Events" },
    { label: "Rules", id: "Rules" },
    { label: "Courses", id: "Courses" },
    { label: "Gallery", id: "Gallery" },
  ];

  return (
    <div>

      <div className="bg-gradient-to-b from-[#07162d] via-[#0a1d38] to-[#020817] relative overflow-hidden">

        {/* Decorative Elements */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(201,168,76,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 50%)' }}></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>

        <footer className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10 sm:pb-14">

          {/* Top Section — Logo & Tagline */}
          <div className="text-center mb-12 sm:mb-16">
            <a
              href="#Home"
              onClick={(e) => handleScroll(e, 'Home')}
              className="inline-block"
            >
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3 hover:opacity-80 transition-opacity duration-300 cursor-pointer">
                Uni<span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">code</span>
              </h2>
            </a>
            <div className="w-16 h-[3px] bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 text-sm sm:text-base font-light max-w-md mx-auto leading-relaxed">
              Empowering students for a brighter tomorrow through excellence, innovation, and integrity.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12 sm:mb-14"></div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-3 sm:gap-x-4 sm:gap-y-4 mb-12 sm:mb-14">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={`#${link.id}`}
                onClick={(e) => handleScroll(e, link.id)}
                className="group relative text-gray-300 hover:text-yellow-400 text-xs sm:text-sm font-semibold tracking-wider uppercase px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-white/[0.06] hover:border-yellow-400/30 bg-white/[0.02] hover:bg-yellow-400/[0.06] backdrop-blur-sm transition-all duration-400 cursor-pointer"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-[60%] h-[2px] bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-400"></span>
              </a>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 sm:gap-5 mb-12 sm:mb-14">
            {[
              {
                label: "Facebook",
                path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
              },
              {
                label: "Twitter",
                path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
              },
              {
                label: "Instagram",
                path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z"
              },
              {
                label: "LinkedIn",
                path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"
              },
              {
                label: "YouTube",
                path: "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"
              },
            ].map((social, i) => (
              <a
                key={i}
                href="#"
                aria-label={social.label}
                className="group w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-white/[0.08] hover:border-yellow-400/40 bg-white/[0.03] hover:bg-yellow-400/10 flex items-center justify-center transition-all duration-400 cursor-pointer"
              >
                <svg
                  className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>

          {/* Contact Info Row */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-12 sm:mb-14">
            {[
              { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: "info@unicode.edu.ng" },
              { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", text: "+234 800 123 4567" },
              { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", text: "Lagos, Nigeria" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-default">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-yellow-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6 sm:mb-8"></div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-[11px] sm:text-xs font-medium tracking-wide">
              © {new Date().getFullYear()} Unicode University. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 text-[11px] sm:text-xs font-medium tracking-wide">Crafted with</span>
              <span className="text-yellow-400 text-sm animate-pulse">♥</span>
              <span className="text-gray-500 text-[11px] sm:text-xs font-medium tracking-wide">for Education</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#Rules" onClick={(e) => handleScroll(e, 'Rules')} className="text-gray-500 hover:text-yellow-400/80 text-[11px] sm:text-xs font-medium tracking-wide transition-colors duration-300 cursor-pointer">
                Privacy Policy
              </a>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <a href="#Rules" onClick={(e) => handleScroll(e, 'Rules')} className="text-gray-500 hover:text-yellow-400/80 text-[11px] sm:text-xs font-medium tracking-wide transition-colors duration-300 cursor-pointer">
                Terms of Service
              </a>
            </div>
          </div>

        </footer>
      </div>

    </div>
  )
}

export default Footer