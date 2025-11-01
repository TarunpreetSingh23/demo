"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import HeroCarousel from "@/components/herocarosel"; // Assuming this component exists

// --- Mock Data (Moved to the top for easy editing) ---

// Services data for the "Most Booked" section
const MOST_BOOKED_SERVICES = [
  {
    name: "Manicure ",
    image: "/images/mpm.jpg",
    rating: 4.79,
    reviews: "3.2M",
    currentPrice: "₹0",
    originalPrice: "₹0",
    // ADDED LINK:
    href: "/services/manicure",
  },
  {
    name: "Bleach & Facial",
    image: "/images/vee4.jpg",
    rating: 4.91,
    reviews: "1.1M",
    currentPrice: "₹0",
    originalPrice: "₹0",
    // ADDED LINK:
    href: "/services/facial",
  },
  {
    name: "Theme Decor",
    image: "/images/wd.jpg",
    rating: 4.79,
    reviews: "68K",
    currentPrice: "₹0",
    originalPrice: null,
    // ADDED LINK:
    href: "/services/theme",
  },
  {
    name: "kitchen Cleaning",
    image: "/images/kc.jpg",
    rating: 4.72,
    reviews: "69K",
    currentPrice: "₹0",
    originalPrice: null,
    // ADDED LINK:
    href: "/services/kitchen",
  },
];

// Categories for Beauty & Grooming
const BEAUTY_CATEGORIES = [
  { id: 1, name: "Party Makeup", image: "/images/m.jpeg", href: "/services/party-makeup" },
  { id: 2, name: "Bridal Makeup", image: "/images/vee5.jpg", href: "/services/bridal-makeup" },
  { id: 3, name: "Manicure & Pedicure", image: "/images/mpm.jpg", href: "/services/manicure" },
  { id: 4, name: "Bleach & Facial", image: "/images/vee4.jpg", href: "/services/bleach" },
  { id: 5, name: "Hair Styling", image: "/images/m.jpeg", href: "/services/hair" },
  { id: 6, name: "Threading", image: "/images/tm.jpg", href: "/services/threading" },
  { id: 7, name: "Waxing", image: "/images/wm.jpg", href: "/services/waxing" },
]
// Categories for Cleaning Serservices
const CLEANING_CATEGORIES = [
  
  { id: 2, name: "Office/Commercial Cleaning", image: "/images/oc.jpg", href: "/services/office" },
  { id: 3, name: "Carpet Cleaning", image: "/images/cc.webp", href: "/services/carpet" },
  { id: 4, name: "Window Cleaning", image: "/images/wc.jpg", href: "/services/window" },
  { id: 5, name: "Sofa & Furniture Cleaning", image: "/images/hc.webp", href: "/services/sofa" },
  { id: 6, name: "Kitchen Appliance Cleaning", image: "/images/kc.jpg", href: "/services/kitchen" },
  { id: 7, name: "Bathroom Sanitization", image: "/images/washc.webp", href: "/services/bathroom" },
  { id: 1, name: "Home Deep Cleaning", image: "/images/hc1.webp", href: "/services/home" },
];

// Categories for Event Decor
const EVENT_CATEGORIES = [
  { id: 1, name: "Birthday Decor", image: "/images/bd.jpg", href: "/services/birthday" },
  { id: 2, name: "Wedding Decor", image: "/images/wd.jpg", href: "/services/wedding" },
  { id: 3, name: "Corporate Event", image: "/images/event-corporate.jpg", href: "/services/corporate" },
  { id: 4, name: "Balloon Decoration", image: "/images/event-balloons.jpg", href: "/services/balloons" },
  { id: 5, name: "Flower Arrangements", image: "/images/event-flowers.jpg", href: "/services/flowers" },
  { id: 6, name: "Stage & Lighting", image: "/images/event-stage.jpg", href: "/services/stage" },
];


// --- Sub-Components ---

// Reusable Service Card Component
const ServiceCard = ({ service }) => (
  <Link href={service.href} passHref>
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col rounded-2xl border border-gray-100 overflow-hidden shadow-xl bg-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] transform-gpu cursor-pointer"
  >

  
    <div className="relative h-48 sm:h-52 w-full bg-gray-50 overflow-hidden">
      <Image
        src={service.image.startsWith('/') ? service.image : `/${service.image}`}
        alt={service.name}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-700 hover:scale-[1.05]"
      />
    </div>

    <div className="p-4 flex flex-col justify-between flex-grow">
      {/* Service Name */}
      <p className="text-base font-semibold text-gray-900 mb-2 leading-snug min-h-[40px] line-clamp-2">
        {service.name}
      </p>

      {/* Rating and Reviews */}
      <div className="flex items-center text-sm mb-2">
        <svg className="w-4 h-4 text-yellow-500 fill-current mr-1" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
        </svg>
        <span className="text-gray-900 font-medium">{service.rating}</span>
        <span className="text-gray-500 ml-1">({service.reviews} Booked)</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline space-x-2">
        <span className="text-xl font-bold text-[#2856c2]">{service.currentPrice}</span>
        {service.originalPrice && (
          <span className="text-sm text-gray-400 line-through">
            {service.originalPrice}
          </span>
        )}
      </div>
    </div>
  </motion.div>
  </Link>
);

// Reusable Category Grid Section
const CategorySection = ({ title, categories, viewAllHref }) => (
  <section className="bg-white py-10 md:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title with Gradient Separator */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
          {title}
        </h2>
        <div className="h-1 mx-auto w-24 bg-gradient-to-r from-[#2856c2] to-pink-500 rounded-full" />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
        {categories.slice(0, 7).map((cat) => (
          <Link
            key={cat.id}
            href={cat.href || `/services/${cat.name.toLowerCase().replace(/\s/g, '-')}`}
            className="group relative flex flex-col rounded-xl shadow-lg bg-white overflow-hidden 
                         transition-all duration-300 ease-out hover:shadow-2xl transform-gpu hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="relative w-full h-38 sm:h-45 bg-gray-100 overflow-hidden">
              <Image
                src={cat.image.startsWith('/') ? cat.image : `/${cat.image}`}
                alt={cat.name}
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 w-full h-full group-hover:scale-[1.07] transition-transform duration-700 ease-in-out"
              />
              {/* Category Name Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xl font-semibold text-white truncate">{cat.name}</p>
              </div>
            </div>
          </Link>
        ))}

        {/* View All Card (Call-to-action) */}
        <Link
          href={viewAllHref}
          className="bg-gradient-to-br from-[#2856c2] via-[#010c4e] to-[#081d81]
                     shadow-xl flex flex-col items-center justify-center text-white 
                     font-extrabold text-xl p-8 transition-all duration-500 rounded-xl
                     hover:scale-[1.05] hover:shadow-2xl hover:bg-opacity-90 transform-gpu"
        >
          <span className="text-5xl mb-2">→</span>
          View All {title.split(' ')[0]}
        </Link>
      </div>
    </div>
  </section>
);


// Page Loader Component
function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 z-50">
      <Image
        src="/images/LOGO (2).jpg"
        alt="Logo"
        width={180}
        height={60}
        className="mb-6"
      />
      {/* Centered loader bar */}
      <div className="w-48 h-1 bg-gray-700 rounded overflow-hidden">
        <div className="h-full bg-[#3ab4ff] animate-loaderLine"></div>
      </div>
    </div>
  );
}

// Modern Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white pt-12 pb-6 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
        {/* Logo/Brand Section */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/">
            <Image
              src="/images/LOGO (2).jpg"
              alt="Brand Logo"
              width={150}
              height={50}
              objectFit="contain"
            />
          </Link>
          <p className="mt-4 text-gray-400 text-sm max-w-xs">
            Your one-stop destination for home services, beauty, and event planning. Book a pro today!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-[#3ab4ff] mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
            <li><Link href="/careers" className="text-gray-400 hover:text-white transition">Careers</Link></li>
            <li><Link href="/blog" className="text-gray-400 hover:text-white transition">Blog</Link></li>
            <li><Link href="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-semibold text-[#3ab4ff] mb-4">Our Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/cleaning" className="text-gray-400 hover:text-white transition">Cleaning</Link></li>
            <li><Link href="/beauty" className="text-gray-400 hover:text-white transition">Beauty & Grooming</Link></li>
            <li><Link href="/eventdecor" className="text-gray-400 hover:text-white transition">Event Decor</Link></li>
            <li><Link href="/repairs" className="text-gray-400 hover:text-white transition">Home Repairs</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="text-lg font-semibold text-[#3ab4ff] mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="text-gray-400">Email: support@website.com</li>
            <li className="text-gray-400">Phone: +91 98765 43210</li>
            <li className="text-gray-400">Address: 123 Service Lane, City, Country</li>
            <div className="flex space-x-4 mt-4">
              {/* Social Icons (Placeholder) */}
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-instagram"></i></a>
            </div>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} YourCompanyName. All rights reserved. | <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
      </div>
    </div>
    {/* Note: You may need to install font-awesome/react-fontawesome for the social icons */}
  </footer>
);


// --- Main Page Component ---
export default function Home() {
  const { data: session } = useSession();
  const cleaningRef = useRef(null);
  const eventRef = useRef(null);
  const beautyRef = useRef(null);
  // Using local mock data instead of useState/useEffect for services for simplicity, 
  // as the original fetch was mocked out anyway.
  const [loading, setLoading] = useState(true);

  // Unified loading control
  useEffect(() => {
    // Simulates initial loading of data or assets
    const timer = setTimeout(() => setLoading(false), 800); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  // Scroll handlers for quick navigation (can be used in a header component)
  const scrollToCleaning = () => cleaningRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToBeauty = () => beautyRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToEvent = () => eventRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* 1. Hero Carousel */}
      <div className="mt-[55px] mb-8 sm:mb-12">
        <HeroCarousel /> 
      </div>

      {/* 2. Most Booked Services Section */}
     <section className="bg-white py-10 md:py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    {/* Section Title */}
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
        Our <span className="text-[#2856c2]">Top Rated</span> Services
      </h2>
      <p className="text-lg text-gray-500">Book confidently from our most popular and highest-rated professionals.</p>
      <div className="h-1 mx-auto w-24 bg-gradient-to-r from-pink-500 to-[#2856c2] rounded-full mt-4" />
    </div>

    {/* Services Grid */}
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-8 lg:gap-10">
      {MOST_BOOKED_SERVICES.map((service, index) => (
        <ServiceCard key={index} service={service} />
      ))}
    </div>
  </div>
</section>
      
      {/* --- Horizontal Divider --- */}
      <div className="h-0.5 bg-gray-100 mx-auto max-w-7xl" />


      {/* 3. Cleaning Services Category Section */}
      <div ref={cleaningRef}>
        <CategorySection 
          title="Home & Office Cleaning"
          categories={CLEANING_CATEGORIES}
          viewAllHref="/clean"
        />
      </div>

      {/* --- Horizontal Divider --- */}
      <div className="h-0.5 bg-gray-100 mx-auto max-w-7xl" />


      {/* 4. Beauty & Grooming Category Section */}
      <div ref={beautyRef}>
        <CategorySection
          title="Beauty & Grooming"
          categories={BEAUTY_CATEGORIES}
          viewAllHref="/facial"
        />
      </div>

      {/* --- Horizontal Divider --- */}
      <div className="h-0.5 bg-gray-100 mx-auto max-w-7xl" />


      {/* 5. Event Decoration Category Section */}
      <div ref={eventRef}>
        <CategorySection
          title="Event Decoration"
          categories={EVENT_CATEGORIES}
          viewAllHref="/eventdecor"
        />
      </div>

      {/* 6. A Simple Call-to-Action Banner */}
      {/* <section className="bg-[#f0f4ff] py-16 mt-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Ready to Book Your Next Service? 🚀
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Experience the best in professional service delivery, right at your doorstep.
          </p>
          <Link
            href="/all-services"
            className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-medium rounded-full shadow-2xl text-white bg-gradient-to-r from-[#2856c2] to-indigo-600 hover:from-indigo-600 hover:to-[#2856c2] transition-all duration-300 transform hover:scale-[1.05]"
          >
            Explore All Services
          </Link>
        </div>
      </section> */}

      {/* 7. Footer */}
      
    </>
  );
}
