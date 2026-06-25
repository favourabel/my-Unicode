// ============================================================
// FILE: App.jsx
// DESCRIPTION: Unicode University Landing Page
// AUTHOR: Your Name
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// ── Assets ────────────────────────────────────────────────────
import girl            from "../assets/girl.jpg";
import school          from "../assets/school.png";
import peter           from "../assets/peter.jpg";
import bursary         from "../assets/bursary.jpg";
import sabastine       from "../assets/sabastine.jpg";
import judith          from "../assets/judith.jpg";
import Dera            from "../assets/Dera.jpg";
import Tolu            from "../assets/Tolu.jpg";
import two             from "../assets/two.jpg";
import Economics       from "../assets/Economics.jpg";
import cybersecurity   from "../assets/cyber security.jpg";
import Nursing         from "../assets/Nursing.jpg";
import DataAnalysist   from "../assets/Data Analysist.jpg";
import SoftwareEng     from "../assets/Software Engineering.jpg";
import physics         from "../assets/physis.jpg";

// ── Components ────────────────────────────────────────────────
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';




/* ============================================================
   SECTION 1 — ANIMATION VARIANTS
   Used by Framer Motion throughout the page
   ============================================================ */

const fadeUp = {
  hidden:  { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const scaleUp = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const slideInLeft = {
  hidden:  { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const slideInRight = {
  hidden:  { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

// Custom hero text variant — accepts a custom delay index (i)
const heroText = {
  hidden:  { opacity: 0, y: 80 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};




/* ============================================================
   SECTION 2 — STATIC DATA
   All static content arrays live here — easy to update
   ============================================================ */

// Timeline milestones shown in the History section
const timelineData = [
  { year: "2008", title: "Foundation",          desc: "Unicode University was established with a vision to transform education in Africa." },
  { year: "2011", title: "First Graduating Class", desc: "Our pioneer students graduated with honors, setting the standard for excellence." },
  { year: "2014", title: "Accreditation",       desc: "Received full accreditation from the National Universities Commission." },
  { year: "2017", title: "Research Center",     desc: "Opened the state-of-the-art research and innovation center on campus." },
  { year: "2020", title: "Digital Transformation", desc: "Launched virtual learning platforms and expanded our global partnerships." },
  { year: "2023", title: "Global Recognition",  desc: "Ranked among the top emerging universities in West Africa." },
];

// Student testimonials shown in the Testimonials carousel
const testimonials = [
  {
    name:   "Chioma Eze",
    role:   "Computer Science, Class of 2023",
    quote:  "Unicode University transformed my career. The faculty's dedication and world-class facilities gave me the confidence to land my dream job at a Fortune 500 company.",
    avatar: "CE",
  },
  {
    name:   "David Okonkwo",
    role:   "Economics, Class of 2022",
    quote:  "The rigorous academic environment and supportive community at Unicode prepared me for the real world. I'm now pursuing my Master's at Oxford.",
    avatar: "DO",
  },
  {
    name:   "Amara Nwosu",
    role:   "Nursing, Class of 2024",
    quote:  "From day one, Unicode felt like home. The clinical training and mentorship I received were exceptional. I'm proud to be an alumnus.",
    avatar: "AN",
  },
  {
    name:   "Tunde Bakare",
    role:   "Data Analytics, Class of 2023",
    quote:  "The innovative curriculum and hands-on projects at Unicode gave me a competitive edge. I now lead a data team at a top tech firm.",
    avatar: "TB",
  },
];

// Images shown in the Campus Gallery section
const galleryImages = [
  { img: girl,         caption: "Campus Life"  },
  { img: two,          caption: "Main Library" },
  { img: Economics,    caption: "Lecture Hall" },
  { img: peter,        caption: "Convocation"  },
  { img: judith,       caption: "Research Lab" },
  { img: cybersecurity,caption: "Tech Hub"     },
];




/* ============================================================
   SECTION 3 — REUSABLE SMALL COMPONENTS
   AnimatedSection and AnimatedCounter are used many times
   ============================================================ */

// ── AnimatedSection ──────────────────────────────────────────
// Wraps any section with a stagger animation.
// Re-animates every time the section enters the viewport (once: false).
const AnimatedSection = ({ children, className = "", id }) => {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
};


// ── AnimatedCounter ──────────────────────────────────────────
// Counts from 0 → end every time the card enters the viewport.
// Resets when it leaves, so it always re-plays.
const AnimatedCounter = ({ end, suffix = "", label, sub, icon, delay = 0 }) => {
  const [count, setCount]   = useState(0);
  const ref                 = useRef(null);
  const isInView            = useInView(ref, { once: false, margin: "-50px" });
  const hasAnimated         = useRef(false);

  useEffect(() => {
    if (isInView) {
      // --- Start the count-up animation ---
      hasAnimated.current = true;
      setCount(0);

      const timer = setTimeout(() => {
        const duration  = 2000;
        const startTime = Date.now();

        const tick = () => {
          const elapsed  = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      }, delay);

      return () => clearTimeout(timer);

    } else {
      // --- Reset when out of view so it re-animates next time ---
      if (hasAnimated.current) {
        setCount(0);
        hasAnimated.current = false;
      }
    }
  }, [isInView, end, delay]);

  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      className="group relative p-6 sm:p-8 lg:p-10 text-center cursor-default"
    >
      {/* Icon */}
      <motion.div
        className="text-4xl sm:text-5xl mb-4"
        whileHover={{ scale: 1.2, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>

      {/* Number */}
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#07162d] mb-2 tracking-tight font-serif">
        {count.toLocaleString()}{suffix}
      </div>

      {/* Label & sub-label */}
      <p className="text-[#07162d] font-bold text-sm sm:text-base md:text-lg">{label}</p>
      <p className="text-gray-400 text-xs sm:text-sm mt-1">{sub}</p>

      {/* Animated underline */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
        initial={{ width: 0 }}
        animate={isInView ? { width: "60%" } : { width: 0 }}
        transition={{ duration: 0.8, delay: delay / 1000 + 0.3 }}
      />
    </motion.div>
  );
};




/* ============================================================
   SECTION 4 — LEADER CARD COMPONENT
   One card per university leader. Re-animates on every scroll.
   ============================================================ */
const LeaderCard = ({ leader, index }) => {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="flex-shrink-0 snap-center group cursor-pointer w-[200px] sm:w-[240px] md:w-[280px]"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -12 }}
    >
      {/* Card image with hover overlay */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl">
        <motion.img
          src={leader.img}
          alt={leader.title}
          className="w-full h-[280px] sm:h-[330px] md:h-[380px] object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Top gold bar that slides in on hover */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Name & title — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-yellow-400 text-xs sm:text-sm font-bold tracking-wider uppercase mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {leader.title}
          </p>
          <p className="text-white text-base sm:text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
            {leader.name}
          </p>
        </div>

        {/* Star icon badge — appears on hover */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all duration-500">
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
      </div>

      {/* Name & role below the card */}
      <div className="mt-4 text-center">
        <p className="text-base sm:text-lg font-bold text-[#07162d]">{leader.name}</p>
        <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{leader.title}</p>
      </div>
    </motion.div>
  );
};




/* ============================================================
   SECTION 5 — TIMELINE ITEM COMPONENT
   Alternates left/right layout. Re-animates on every scroll.
   ============================================================ */
const TimelineItem = ({ item, index }) => {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });

  // Alternate direction: even = slide from left, odd = slide from right
  const slideDirection = index % 2 === 0 ? -60 : 60;

  return (
    <motion.div
      ref={ref}
      className={`
        relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0
        ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} sm:mb-16
      `}
      initial={{ opacity: 0, x: slideDirection }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: slideDirection }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Content card */}
      <div className={`
        pl-14 sm:pl-0 sm:w-[calc(50%-40px)]
        ${index % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:text-left'}
      `}>
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.3 }}
        >
          <span className="inline-block font-serif text-2xl sm:text-3xl font-black gradient-text mb-2">
            {item.year}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-[#07162d] mb-2">{item.title}</h3>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">{item.desc}</p>
        </motion.div>
      </div>

      {/* Center dot on the timeline line */}
      <motion.div
        className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-4 border-yellow-400 rounded-full z-10 shadow-md"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 300 }}
      />

      {/* Empty column to push the card to one side */}
      <div className="hidden sm:block sm:w-[calc(50%-40px)]" />
    </motion.div>
  );
};




/* ============================================================
   SECTION 6 — GLOBAL CSS STYLES
   Injected via <style> tag inside the component
   ============================================================ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    * { box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, sans-serif; }
    .font-serif { font-family: 'Playfair Display', Georgia, serif; }

    /* Hide scrollbar for the leader cards row */
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

    /* Gold gradient text utility */
    .gradient-text {
      background: linear-gradient(135deg, #c9a84c, #f0d078, #c9a84c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Frosted glass — dark version */
    .glass {
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
    }

    /* Frosted glass — light version */
    .glass-light {
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.9);
    }

    /* Subtle radial overlay on the hero background */
    .hero-parallax::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(30,58,95,0.06) 0%, transparent 50%);
      z-index: 1;
    }

    /* Gradient line down the center of the timeline */
    .timeline-line {
      background: linear-gradient(180deg, rgba(201,168,76,0.6), rgba(201,168,76,0.1));
    }

    /* Large decorative quote mark behind testimonial text */
    .testimonial-quote::before {
      content: '"';
      position: absolute;
      top: -20px;
      left: 0;
      font-size: 120px;
      font-family: 'Playfair Display', serif;
      color: rgba(201,168,76,0.1);
      line-height: 1;
    }

    /* Infinite scrolling marquee strip */
    .marquee-track {
      display: flex;
      animation: marquee 40s linear infinite;
    }
    @keyframes marquee {
      from { transform: translateX(0);    }
      to   { transform: translateX(-50%); }
    }

    /* Gallery image hover overlay */
    .gallery-item::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(7,22,45,0.8), transparent 60%);
      opacity: 0;
      transition: opacity 0.5s;
    }
    .gallery-item:hover::after { opacity: 1; }
  `}</style>
);




/* ============================================================
   SECTION 7 — MAIN APP COMPONENT
   All page sections are rendered here in order
   ============================================================ */
const App = () => {

  const navigate = useNavigate();

  // ── Refs & Scroll ────────────────────────────────────────
  const heroRef                    = useRef(null);
  const { scrollYProgress }        = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY                      = useTransform(scrollYProgress, [0, 1],   ["0%", "30%"]);
  const heroOpacity                = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // ── Testimonial State ────────────────────────────────────
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // ── Gallery Hover State ──────────────────────────────────
  const [galleryHover, setGalleryHover] = useState(null);

  // ── Event Registration Toast State ───────────────────────
  const [show, setShow] = useState(false);

  // ── Countdown Timer State ────────────────────────────────
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });


  // ── Auto-rotate testimonials every 5 seconds ─────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  // ── Auto-hide the registration toast after 3 seconds ─────
  useEffect(() => {
    if (show) setTimeout(() => setShow(false), 3000);
  }, [show]);


  // ── Live countdown to convocation (45 days from now) ─────
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 45);

    const update = () => {
      const now  = new Date();
      const diff = target - now;
      if (diff <= 0) return;

      setCountdown({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);


  // ── Helper: navigate testimonial by direction ─────────────
  const prevTestimonial = () =>
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const nextTestimonial = () =>
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);


  // ─────────────────────────────────────────────────────────
  return (
    <div className="font-sans text-gray-800 bg-[#fafafa] overflow-x-hidden scroll-smooth">

      {/* Inject global CSS */}
      <GlobalStyles />


      {/* ── Scroll Progress Bar (fixed top) ──────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 z-[100] origin-left"
        style={{ scaleX: useTransform(scrollYProgress, [0, 1], [0, 1]) }}
      />


      {/* ================================================
          HERO SECTION
          Full-screen intro with parallax background,
          headline, and CTA buttons
          ================================================ */}
      <div ref={heroRef} className="relative min-h-screen flex flex-col w-full overflow-hidden">

        <Navbar />

        {/* Parallax background image */}
        <motion.div className="absolute inset-0 hero-parallax" style={{ y: heroY }}>
          <img src={girl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </motion.div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/90 via-[#07162d]/75 to-[#020817]/95" />

        {/* Subtle grid texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Hero content — fades out as user scrolls down */}
        <motion.div
          className="relative z-10 flex-grow flex flex-col justify-center max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-16 pb-24 pt-28 md:pt-20"
          style={{ opacity: heroOpacity }}
        >
          {/* Badge */}
          <motion.div custom={0} variants={heroText} initial="hidden" animate="visible">
            <span className="inline-flex items-center gap-3 bg-white/[0.05] border border-white/[0.08] text-yellow-400/90 text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase mb-8 sm:mb-10 px-5 py-2.5 rounded-full backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
              </span>
              Established & Accredited
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            custom={1}
            variants={heroText}
            initial="hidden"
            animate="visible"
            className="font-serif text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] text-white font-black leading-[1.05] mb-6 md:mb-8 tracking-tight"
          >
            Empowering<br />
            Students for a<br />
            <span className="gradient-text">Brighter Tomorrow</span>
          </motion.h1>

          {/* Animated gold divider line */}
          <motion.div
            className="h-[2px] bg-gradient-to-r from-yellow-400 via-amber-400 to-transparent rounded-full mb-6 md:mb-8"
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Sub-headline */}
          <motion.p
            custom={3}
            variants={heroText}
            initial="hidden"
            animate="visible"
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300/90 max-w-2xl leading-relaxed mb-10 md:mb-14 font-light"
          >
            We provide a nurturing environment that inspires excellence, fosters creativity,
            and prepares students to become Future Leaders in a rapidly evolving world.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            custom={4}
            variants={heroText}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 mb-[60px]"
          >
            {/* Login */}
            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -10px rgba(201,168,76,0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-r from-yellow-400 to-amber-500 text-[#07162d] font-bold py-4 px-10 rounded-xl text-base sm:text-lg shadow-xl shadow-yellow-400/20 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Login
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            {/* Signup */}
            <motion.button
              onClick={() => navigate('/signup')}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.98 }}
              className="border-2 border-white/20 hover:border-white/40 text-white font-semibold py-4 px-10 rounded-xl text-base sm:text-lg backdrop-blur-sm transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Signup
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </motion.button>
          </motion.div>

          {/* Scroll indicator — desktop only */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-3 hidden md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-medium">Scroll</span>
            <motion.div
              className="w-[2px] h-14 bg-gradient-to-b from-yellow-400/80 to-transparent rounded-full"
              animate={{ scaleY: [0, 1, 0], originY: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>


      {/* ================================================
          STATS SECTION
          4 animated counters overlapping the hero bottom
          ================================================ */}
      <AnimatedSection className="relative z-20 -mt-20 sm:-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          variants={scaleUp}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.12)] border border-gray-100/80 overflow-hidden"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
            <AnimatedCounter end={15}   suffix="+" label="Years of Excellence" sub="Building academic legacy"   icon="🎓" delay={0}   />
            <AnimatedCounter end={4500} suffix="+" label="Happy Students"       sub="Thriving campus community"  icon="👨‍🎓" delay={200} />
            <AnimatedCounter end={250}  suffix="+" label="Qualified Lecturers"  sub="World-class faculty"        icon="📚" delay={400} />
            <AnimatedCounter end={95}   suffix="%" label="Success Rate"         sub="In national examinations"   icon="🏆" delay={600} />
          </div>
        </motion.div>
      </AnimatedSection>


      {/* ================================================
          LEADERS SECTION
          Horizontally scrollable row of leader cards
          ================================================ */}
      <AnimatedSection id="Leaders" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">

        {/* Section heading */}
        <div className="text-center mb-14 md:mb-20">
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-yellow-500/60 rounded-full" />
            <span className="text-yellow-600 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase">Leadership</span>
            <span className="w-10 h-[2px] bg-yellow-500/60 rounded-full" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#07162d] tracking-tight">
            University <span className="gradient-text">Heads</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 text-base sm:text-lg mt-4 max-w-xl mx-auto">
            Meet the visionary leaders guiding our institution towards excellence
          </motion.p>
          <motion.div variants={fadeUp} className="w-14 h-[3px] bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Scrollable leader cards */}
        <div className="w-full overflow-x-auto pb-6 snap-x scrollbar-hide">
          <div className="flex gap-5 sm:gap-7 md:gap-8 w-max px-4 sm:px-6">
            {[
              { img: peter,    title: "Chancellor",  name: "Dr. Peter Obi"    },
              { img: bursary,  title: "Bursary",     name: "Mrs. Grace Okon"  },
              { img: sabastine,title: "V. Chancellor",name: "Prof. Sebastine"  },
              { img: judith,   title: "Registrar",   name: "Dr. Judith Obi"   },
              { img: Dera,     title: "Dean",        name: "Prof. Dera Nwosu" },
              { img: Tolu,     title: "Finances",    name: "Mr. Tolu Akande"  },
            ].map((leader, index) => (
              <LeaderCard key={index} leader={leader} index={index} />
            ))}
          </div>
        </div>
      </AnimatedSection>


      {/* ================================================
          ABOUT SECTION
          Two-column layout: image left, text right
          ================================================ */}
      <AnimatedSection id="About" className="relative py-20 md:py-32 overflow-hidden">

        {/* Background glow */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-yellow-400/[0.03] rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Image column */}
            <motion.div variants={slideInLeft} className="relative group order-2 lg:order-1">
              <motion.div
                className="absolute -inset-4 bg-gradient-to-br from-yellow-400/15 via-amber-400/10 to-orange-400/15 rounded-3xl transform rotate-3"
                whileHover={{ rotate: 2 }}
                transition={{ duration: 0.7 }}
              />
              <div className="absolute -inset-4 bg-gradient-to-br from-yellow-400/5 to-amber-400/5 rounded-3xl transform rotate-3 scale-105 blur-2xl" />

              <motion.img
                src={two}
                alt="About Unicode"
                className="relative w-full h-auto object-cover rounded-2xl sm:rounded-3xl shadow-2xl border-[5px] sm:border-[6px] border-white"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              />

              {/* Floating accreditation badge */}
              <motion.div
                className="absolute -bottom-6 -right-4 bg-white rounded-2xl shadow-2xl p-4 sm:p-5"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-[#07162d]">100%</p>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">Accredited</p>
                  </div>
                </div>
              </motion.div>

              {/* Corner accent */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-[3px] border-yellow-400/20 rounded-2xl" />
            </motion.div>

            {/* Text column */}
            <motion.div variants={slideInRight} className="space-y-6 lg:space-y-8 order-1 lg:order-2">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-[2px] bg-yellow-500/60 rounded-full" />
                  <span className="text-yellow-600 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase">Who We Are</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black text-[#07162d] leading-[1.1] tracking-tight">
                  About <span className="gradient-text">Unicode</span>
                </h2>
              </div>

              <div className="w-14 h-[3px] bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" />

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Unicode University is a forward-thinking institution dedicated to empowering students
                with knowledge, innovation, and practical skills for success in a rapidly evolving
                global world. It is where creativity meets excellence and education goes beyond the classroom.
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                At Unicode University, we believe in nurturing not only academic growth but also personal
                development. Our students are encouraged to think critically, solve real-world problems,
                and become impactful contributors to society.
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                With modern facilities, experienced faculty, and a strong focus on research and innovation,
                Unicode University stands as a place where future leaders are shaped and dreams are
                transformed into reality.
              </p>

              {/* Vision & Value cards */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {[
                  {
                    title: "Our Vision",
                    sub:   "Leading global institution",
                    color: "from-yellow-400 to-amber-500",
                    icon:  "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                  },
                  {
                    title: "Our Value",
                    sub:   "Excellence & Integrity",
                    color: "from-blue-500 to-indigo-600",
                    icon:  "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
                  },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
                    className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm cursor-default flex-1"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-[#07162d] text-sm sm:text-base">{card.title}</p>
                      <p className="text-gray-400 text-xs sm:text-sm">{card.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>


      {/* ================================================
          MISSION SECTION
          Dark full-width section with core values
          ================================================ */}
      <AnimatedSection id="Mission" className="relative py-24 sm:py-32 md:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">

        {/* Backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020817] via-[#0c1a33] to-[#020817]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 35%, rgba(201,168,76,0.06) 0%, transparent 50%), radial-gradient(circle at 75% 65%, rgba(99,102,241,0.04) 0%, transparent 50%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 md:space-y-12">

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1.5px] bg-yellow-400/40 rounded-full" />
            <span className="text-yellow-400/60 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase">Our Purpose</span>
            <span className="w-8 h-[1.5px] bg-yellow-400/40 rounded-full" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-serif gradient-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider"
            style={{ textShadow: '0 0 100px rgba(201,168,76,0.12)' }}
          >
            Our Mission
          </motion.h2>

          {/* Diamond divider */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-yellow-400/60 rounded-full" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full rotate-45" />
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-yellow-400/60 rounded-full" />
          </motion.div>

          <motion.p variants={fadeUp} className="text-gray-300 text-lg sm:text-xl md:text-2xl lg:text-[1.65rem] font-light leading-relaxed md:leading-loose max-w-4xl mx-auto">
            To provide high-quality education that empowers students to become responsible,
            innovative, and successful global citizens. To be a leading institution recognized
            for academic excellence, character development, and student success.
          </motion.p>

          {/* Core value pills */}
          <motion.div variants={staggerContainer} className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-6 md:pt-10">
            {[
              { name: "Innovation", icon: "💡" },
              { name: "Excellence", icon: "⭐" },
              { name: "Integrity",  icon: "🛡️" },
              { name: "Leadership", icon: "👑" },
            ].map((val, i) => (
              <motion.span
                key={i}
                variants={staggerItem}
                whileHover={{ y: -4, backgroundColor: "rgba(201,168,76,0.12)", borderColor: "rgba(201,168,76,0.4)" }}
                className="glass text-gray-300 text-xs sm:text-sm font-semibold tracking-wider uppercase px-5 sm:px-7 py-3 sm:py-3.5 rounded-full cursor-default flex items-center gap-2"
              >
                <span className="text-base">{val.icon}</span>
                {val.name}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>


      {/* ================================================
          TIMELINE / HISTORY SECTION
          Alternating left-right milestone cards
          ================================================ */}
      <AnimatedSection id="History" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 overflow-hidden">

        {/* Section heading */}
        <div className="text-center mb-14 md:mb-20">
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-yellow-500/60 rounded-full" />
            <span className="text-yellow-600 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase">Our Journey</span>
            <span className="w-10 h-[2px] bg-yellow-500/60 rounded-full" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#07162d] tracking-tight">
            Our <span className="gradient-text">History</span>
          </motion.h2>
          <motion.div variants={fadeUp} className="w-14 h-[3px] bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical center line — hidden on mobile, shown on sm+ */}
          <div className="absolute left-6 sm:left-1/2 sm:-translate-x-[1px] top-0 bottom-0 w-[2px] timeline-line hidden sm:block" />
          <div className="absolute left-6 top-0 bottom-0 w-[2px] timeline-line sm:hidden" />

          <div className="space-y-12 sm:space-y-0">
            {timelineData.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </AnimatedSection>


      {/* ================================================
          STUDENT ACHIEVEMENTS SECTION
          Grid of 6 achievement stat cards
          ================================================ */}
      <AnimatedSection id="Achievements" className="relative py-20 md:py-28 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-[#fef9f0] to-white" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="text-center mb-14 md:mb-20">
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-[2px] bg-yellow-500/60 rounded-full" />
              <span className="text-yellow-600 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase">Achievements</span>
              <span className="w-10 h-[2px] bg-yellow-500/60 rounded-full" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#07162d] tracking-tight">
              Student <span className="gradient-text">Excellence</span>
            </motion.h2>
            <motion.div variants={fadeUp} className="w-14 h-[3px] bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mt-6 rounded-full" />
          </div>

          {/* Achievement cards grid */}
          <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: "Dean's List Scholars",  value: "320+", desc: "Students recognized for outstanding academic performance this semester.",            color: "from-yellow-400 to-amber-500",   bg: "bg-yellow-50",  icon: "🎓" },
              { title: "Research Publications", value: "85+",  desc: "Student-led research papers published in international journals.",                   color: "from-blue-400 to-indigo-500",    bg: "bg-blue-50",    icon: "📄" },
              { title: "Competition Awards",    value: "47",   desc: "National and international awards won by our students this year.",                   color: "from-emerald-400 to-teal-500",   bg: "bg-emerald-50", icon: "🏅" },
              { title: "Startup Ventures",      value: "23",   desc: "Student-founded startups launched with university incubator support.",               color: "from-violet-400 to-purple-500",  bg: "bg-violet-50",  icon: "🚀" },
              { title: "Community Service",     value: "10K+", desc: "Hours of community service contributed by our student body.",                        color: "from-rose-400 to-pink-500",      bg: "bg-rose-50",    icon: "❤️" },
              { title: "Employment Rate",       value: "92%",  desc: "Graduates employed within 6 months of completing their studies.",                   color: "from-cyan-400 to-blue-500",      bg: "bg-cyan-50",    icon: "💼" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 cursor-default group"
              >
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div className={`font-serif text-3xl sm:text-4xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2`}>
                  {item.value}
                </div>
                <h3 className="text-lg font-bold text-[#07162d] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>


      {/* ================================================
          TESTIMONIALS SECTION
          Auto-rotating carousel with nav arrows & dots
          ================================================ */}
      <AnimatedSection id="Testimonials" className="relative py-20 md:py-28 overflow-hidden">

        {/* Backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020817] via-[#07162d] to-[#020817]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(201,168,76,0.06) 0%, transparent 50%)' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="text-center mb-14 md:mb-20">
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-[2px] bg-yellow-400/40 rounded-full" />
              <span className="text-yellow-400/60 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase">Testimonials</span>
              <span className="w-10 h-[2px] bg-yellow-400/40 rounded-full" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              What Our <span className="gradient-text">Students Say</span>
            </motion.h2>
          </div>

          {/* Carousel */}
          <div className="relative">

            {/* Active testimonial card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="glass rounded-3xl p-8 sm:p-12 text-center"
              >
                <div className="relative testimonial-quote mb-6">
                  <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed font-light italic">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                </div>

                {/* Avatar + name */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-[#07162d] font-bold text-lg">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-base sm:text-lg">{testimonials[activeTestimonial].name}</p>
                    <p className="text-gray-400 text-sm">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === activeTestimonial ? 'bg-yellow-400 w-8' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Previous arrow */}
            <button
              onClick={prevTestimonial}
              className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-14 w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next arrow */}
            <button
              onClick={nextTestimonial}
              className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-14 w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </AnimatedSection>


      {/* ================================================
          EVENT COUNTDOWN SECTION
          Countdown timer + register button with toast
          ================================================ */}
      <AnimatedSection id="Events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <motion.div
          variants={scaleUp}
          className="relative bg-gradient-to-br from-[#07162d] via-[#0a1d38] to-[#07162d] rounded-3xl overflow-hidden"
        >
          {/* Backgrounds */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 50%)' }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative p-8 sm:p-12 lg:p-16 text-center">

            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-[1.5px] bg-yellow-400/40 rounded-full" />
              <span className="text-yellow-400/60 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase">Upcoming Event</span>
              <span className="w-8 h-[1.5px] bg-yellow-400/40 rounded-full" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3">
              2026 Convocation Ceremony
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-10 max-w-lg mx-auto">
              Join us for the grand celebration of our graduating class
            </p>

            {/* Countdown tiles */}
            <div className="flex justify-center gap-3 sm:gap-5 md:gap-8 mb-10">
              {[
                { value: countdown.days,    label: "Days"    },
                { value: countdown.hours,   label: "Hours"   },
                { value: countdown.minutes, label: "Minutes" },
                { value: countdown.seconds, label: "Seconds" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <motion.div
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 glass rounded-2xl flex items-center justify-center mb-2 sm:mb-3"
                    // Only the seconds tile pulses
                    animate={i === 3 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-yellow-400">
                      {String(item.value).padStart(2, '0')}
                    </span>
                  </motion.div>
                  <span className="text-gray-400 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Register button */}
            <motion.button
              onClick={() => setShow(true)}
              whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -10px rgba(201,168,76,0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-[#07162d] font-bold py-3.5 px-8 sm:px-10 rounded-xl text-base shadow-xl shadow-yellow-400/20"
            >
              <span className="flex items-center gap-2">
                Register Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </motion.button>

            {/* Toast notification — auto-dismisses after 3s */}
            <AnimatePresence>
              {show && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed bottom-4 right-4 bg-[#07162d] border border-yellow-400/30 text-white px-4 py-3 rounded-lg shadow-xl text-sm flex items-center gap-2 z-50"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-yellow-400"
                  >
                    ⟳
                  </motion.span>
                  Registration has not started. We'll update you soon.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatedSection>


      {/* ================================================
          TERMS & PRIVACY SECTION
          Two frosted-glass cards side by side
          ================================================ */}
      <AnimatedSection id="Rules" className="relative py-24 sm:py-32 overflow-hidden">

        {/* Backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07162d] via-[#0a1d38] to-[#07162d]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 40%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="text-center mb-16 sm:mb-20">
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-[1.5px] bg-yellow-400/40 rounded-full" />
              <span className="text-yellow-400/60 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase">Legal</span>
              <span className="w-8 h-[1.5px] bg-yellow-400/40 rounded-full" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
              Terms & <span className="gradient-text">Privacy</span>
            </motion.h2>
            <motion.div variants={fadeUp} className="w-14 h-[3px] bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mt-6 rounded-full" />
          </div>

          {/* Cards */}
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            {[
              {
                title: "Terms & Conditions",
                desc:  "By using this website, you agree to follow all rules and guidelines. All content is for educational purposes. Users must not misuse, damage, or interfere with the website. We reserve the right to update content at any time.",
                icon:  "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              },
              {
                title: "Privacy Policy",
                desc:  "We respect your privacy. Any information collected is used only for communication and school purposes. We do not sell or share your data with third parties except when required by law.",
                icon:  "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,0.08)" }}
                className="glass rounded-3xl p-8 lg:p-10 transition-all duration-500 group"
              >
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-yellow-400/20 transition-all duration-500">
                    <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-yellow-400 text-xl sm:text-2xl font-bold mb-1">{card.title}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium">Last updated: 2025</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>


      {/* ================================================
          ACADEMIC PROGRAMS / COURSES SECTION
          4-column course cards with image, tag & duration
          ================================================ */}
      <AnimatedSection id="Courses" className="relative py-24 sm:py-32 overflow-hidden">

        {/* Backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fffcf5] via-[#fef8ee] to-[#fffcf5]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className="text-center mb-16 sm:mb-20">
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-[2px] bg-yellow-500/60 rounded-full" />
              <span className="text-yellow-600 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase">Programs</span>
              <span className="w-10 h-[2px] bg-yellow-500/60 rounded-full" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#07162d] font-black tracking-tight">
              Academic <span className="gradient-text">Programs</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base sm:text-lg md:text-xl text-gray-500 font-medium mt-4 max-w-2xl mx-auto">
              Explore the diverse range of courses we offer to shape your future
            </motion.p>
            <motion.div variants={fadeUp} className="w-14 h-[3px] bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mt-6 rounded-full" />
          </div>

          {/* Course cards */}
          <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {[
              { img: Economics,    title: "Economics",     desc: "Study how money and resources shape societies and drive economic growth.",                        tag: "Social Sciences", duration: "4 Years" },
              { img: cybersecurity,title: "Cyber Security",desc: "Study how to secure systems and protect data from cyber attacks and threats.",                   tag: "Technology",      duration: "4 Years" },
              { img: Nursing,      title: "Nursing",       desc: "Study how to care for patients, support health, and promote overall wellbeing.",                  tag: "Health Sciences", duration: "5 Years" },
              { img: DataAnalysist,title: "Data Analyst",  desc: "Learn how to collect, analyze, and interpret data to help make better business decisions.",       tag: "Technology",      duration: "4 Years" },
            ].map((course, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -12, boxShadow: "0 30px 60px -15px rgba(0,0,0,0.15)" }}
                className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg transition-all duration-500 flex flex-col cursor-pointer"
              >
                {/* Course image */}
                <div className="relative overflow-hidden">
                  <motion.img
                    src={course.img}
                    alt={course.title}
                    className="w-full h-52 sm:h-56 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                  {/* Tag badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
                    <span className="text-[#07162d] font-bold text-xs">{course.tag}</span>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute top-4 right-4 bg-[#07162d]/80 backdrop-blur-sm rounded-xl px-3 py-1.5">
                    <span className="text-white font-medium text-xs">{course.duration}</span>
                  </div>
                </div>

                {/* Course info */}
                <div className="p-6 sm:p-7 flex-grow flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-[#07162d] mb-3 group-hover:text-yellow-600 transition-colors duration-300 font-serif">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-grow">{course.desc}</p>

                  {/* Footer */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-yellow-600 text-sm font-bold group-hover:tracking-wider transition-all duration-500 flex items-center gap-1.5">
                      Learn More
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    <div className="w-9 h-9 bg-yellow-50 rounded-xl flex items-center justify-center group-hover:bg-yellow-400 transition-colors duration-300">
                      <svg className="w-4 h-4 text-yellow-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* View all button */}
          <motion.div variants={fadeUp} className="text-center mt-14 sm:mt-16">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -10px rgba(7,22,45,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 bg-[#07162d] hover:bg-[#0a1d38] text-white font-bold py-4 px-10 rounded-xl text-base sm:text-lg shadow-xl transition-all duration-300"
            >
              View All Programs
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </AnimatedSection>


      {/* ================================================
          GALLERY SECTION
          3-column responsive image grid with hover overlay
          ================================================ */}
      <AnimatedSection id="Gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 overflow-hidden">

        {/* Section heading */}
        <div className="text-center mb-14 md:mb-20">
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-yellow-500/60 rounded-full" />
            <span className="text-yellow-600 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase">Gallery</span>
            <span className="w-10 h-[2px] bg-yellow-500/60 rounded-full" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#07162d] tracking-tight">
            Campus <span className="gradient-text">Gallery</span>
          </motion.h2>
          <motion.div variants={fadeUp} className="w-14 h-[3px] bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Gallery grid */}
        <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {galleryImages.map((item, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="gallery-item relative overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer group aspect-[4/3]"
              onMouseEnter={() => setGalleryHover(i)}
              onMouseLeave={() => setGalleryHover(null)}
            >
              <motion.img
                src={item.img}
                alt={item.caption}
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07162d]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-20">
                <p className="text-white font-bold text-sm sm:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatedSection>


      {/* ================================================
          MARQUEE / TRUST STRIP
          Infinite scrolling row of trust keywords
          ================================================ */}
      <div className="relative py-8 sm:py-10 bg-[#07162d] overflow-hidden border-y border-white/[0.05]">
        <div className="marquee-track">
          {/* Duplicated twice so the loop is seamless */}
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-10 sm:gap-16 px-5 sm:px-8 whitespace-nowrap">
              {[
                "Accredited Programs",
                "World-Class Faculty",
                "Modern Facilities",
                "Research Excellence",
                "Global Partnerships",
                "Student Success",
                "Innovation Hub",
                "Community Impact",
              ].map((text, i) => (
                <span key={i} className="flex items-center gap-3 sm:gap-4 text-white/25 text-sm sm:text-base font-medium tracking-wider uppercase">
                  <span className="w-2 h-2 bg-yellow-400/40 rounded-full" />
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>


      <Footer />

    </div>
  );
};

export default App;