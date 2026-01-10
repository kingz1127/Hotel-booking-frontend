import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function CustomerSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); 
    };

    
    checkScreenSize();

    
    window.addEventListener("resize", checkScreenSize);

    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && isMobile && !event.target.closest(".sidebar-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isMobile]);

  const navLinks = [
    { to: "customerHome", label: "Dashboard" },
    { to: "customersettings", label: "Settings" },
    { to: "restaurant", label: "Restaurant" },
    { to: "customerRoom", label: "Rooms & Suites" },
    { to: "customerBookings", label: "Bookings" },
  ];

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-my-Bg text-white font-semibold"
        : "hover:bg-gray-800/70 hover:text-white text-gray-300"
    }`;

  return (
    <>
      
      <div className="xl:hidden fixed top-3 right-3 z-50 sidebar-container">
        <button
          onClick={toggleMenu}
          className="p-3 -mt-2 rounded-lg bg-my-Bg/70 backdrop-blur-sm text-white hover:bg-my-Bg transition-all duration-200 shadow-lg hover:shadow-xl"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      
      {isOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      
      <div
        className={`
          sidebar-container
          mt-4
          fixed top-0 left-0 h-full z-40
          backdrop-blur-lg bg-gray-900/90 border-r border-gray-700/30
          transition-all duration-300 ease-in-out
          shadow-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          
         
          xl:translate-x-0 xl:static xl:h-auto xl:shadow-none
          xl:backdrop-blur-md xl:bg-gray-900/80
          xl:border-none xl:rounded-xl
          
          
          w-72              
          md:w-80           
          xl:w-full         
          xl:max-w-7xl xl:mx-auto 
          
          
          xl:fixed xl:top-4 xl:left-1/2 xl:transform xl:-translate-x-1/2
          xl:w-[95%] xl:max-w-6xl
        `}
      >
       
        <div className="flex flex-col p-4 h-full 
                        xl:flex-row xl:justify-evenly xl:items-center 
                        xl:p-3 xl:h-auto">
          
         
          <div className="flex flex-col space-y-2 flex-1
                          xl:flex-row xl:space-y-0 xl:space-x-2
                          xl:justify-center xl:items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-3 p-3 rounded-lg transition-all duration-200
                   ${isActive
                     ? "bg-gradient-to-r from-my-Bg to-blue-600 text-white font-semibold shadow-lg"
                     : "hover:bg-gray-800/60 hover:text-white text-gray-300 hover:shadow-md"
                   }
                   text-sm sm:text-base
                   xl:flex-1 xl:max-w-[180px] xl:text-center xl:justify-center
                   lg:hover:scale-105 active:scale-95`
                }
                onClick={() => setIsOpen(false)}
                end
              >
                <span className="xl:text-sm 2xl:text-base">{link.label}</span>
              </NavLink>
            ))}
          </div>

          
          <div className="mt-auto pt-4 border-t border-gray-700/50 xl:hidden">
            <button
              onClick={toggleMenu}
              className="w-full p-3 text-center text-gray-300 hover:text-white 
                         bg-gray-800/50 hover:bg-gray-700/60 rounded-lg 
                         transition-colors duration-200 font-medium"
            >
              Close Menu
            </button>
          </div>

          
          <div className="hidden xl:block absolute -inset-2 -z-10 rounded-xl 
                         bg-gradient-to-r from-gray-900/30 via-transparent to-gray-900/30 
                         opacity-50 pointer-events-none" />
        </div>
      </div>

      
      <div className="hidden xl:block h-20" />
    </>
  );
}