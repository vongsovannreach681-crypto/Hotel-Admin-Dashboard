import React, { useState, useEffect } from "react";
import logo from "../../assets/Romdullogo.png";

const Header = ({ onOpenMyBookings, onBookNowClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Hotels", href: "#hotels" },
    { label: "Rooms & Suites", href: "#rooms" },
    { label: "Amenities", href: "#amenities" },
    { label: "Offers", href: "#offers" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    setActiveSection(targetId);
    const element = document.getElementById(targetId);
    if (element) {
      const navOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-3"
          : "bg-gradient-to-b from-black/60 via-black/30 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="flex items-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-700/10 p-1 flex items-center justify-center shadow-inner border border-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
            <img
              src={logo}
              alt="RomduL Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <div>
            <span
              className={`font-bold text-xl tracking-wider block font-serif uppercase transition-colors ${
                scrolled ? "text-emerald-900" : "text-white"
              }`}
            >
              RomduL
            </span>
            <span
              className={`text-[10px] tracking-[0.25em] uppercase block font-medium ${
                scrolled ? "text-emerald-700" : "text-emerald-300"
              }`}
            >
              Hotels & Resorts
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
                  scrolled
                    ? isActive
                      ? "text-emerald-700 font-semibold"
                      : "text-slate-700 hover:text-emerald-700"
                    : isActive
                    ? "text-emerald-300 font-semibold"
                    : "text-slate-100 hover:text-emerald-300"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMyBookings}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
              scrolled
                ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                : "bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
            }`}
            title="View or search your reservations"
          >
            <i className="fa-solid fa-receipt text-emerald-500"></i>
            <span>My Bookings</span>
          </button>

          <button
            type="button"
            onClick={onBookNowClick}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 transition-all duration-200 active:scale-95"
          >
            <i className="fa-solid fa-calendar-check"></i>
            <span>Book A Stay</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={onOpenMyBookings}
            className={`p-2 rounded-lg text-sm ${
              scrolled ? "text-slate-700" : "text-white"
            }`}
            title="My Bookings"
          >
            <i className="fa-solid fa-receipt"></i>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${
              scrolled
                ? "text-slate-800 hover:bg-slate-100"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            <i
              className={`fa-solid ${
                mobileMenuOpen ? "fa-xmark" : "fa-bars"
              } text-xl`}
            ></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200 px-6 py-5 shadow-2xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-slate-800 hover:text-emerald-700 text-base font-medium py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <i className="fa-solid fa-chevron-right text-xs text-slate-400"></i>
              </a>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyBookings();
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-800 py-3 rounded-xl text-sm font-semibold border border-slate-200"
            >
              <i className="fa-solid fa-receipt text-emerald-600"></i>
              <span>My Reservations</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onBookNowClick();
              }}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-emerald-700/20"
            >
              <i className="fa-solid fa-calendar-check"></i>
              <span>Book A Stay</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;