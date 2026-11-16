import React, { useState } from "react";
import logo from "../../assets/Romdullogo.png";

const Footer = ({ onOpenMyBookings }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 3500);
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80">
      {/* Top Newsletter Strip */}
      <div className="border-b border-slate-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block mb-1">
              RomduL Luxury Circle
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Subscribe for Exclusive VIP Privileges & Seasonal Invites
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Receive secret promotional codes, complimentary upgrades, and culinary event invitations.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex items-center gap-2 w-full max-w-md"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-emerald-500 flex-1 font-medium"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              {subscribed ? "Subscribed!" : "Join Circle"}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Col 1: Brand Bio */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800/30 p-1 flex items-center justify-center border border-emerald-500/30">
              <img
                src={logo}
                alt="RomduL"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div>
              <span className="font-bold text-lg text-white font-serif tracking-wider block">
                RomduL
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-400 font-semibold block">
                Hotels & Resorts
              </span>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
            Cambodia&apos;s premier boutique luxury hotel brand, offering sanctuary retreats in Phnom Penh, Siem Reap, Sihanoukville, and Kampot with royal Khmer hospitality.
          </p>

          <div className="flex items-center gap-3 pt-2">
            {[
              { icon: "fa-brands fa-facebook-f", href: "#" },
              { icon: "fa-brands fa-instagram", href: "#" },
              { icon: "fa-brands fa-x-twitter", href: "#" },
              { icon: "fa-brands fa-telegram", href: "#" },
              { icon: "fa-brands fa-tripadvisor", href: "#" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
                aria-label="Social Link"
              >
                <i className={`${s.icon} text-xs`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Col 2: Destinations */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
            Destinations
          </h4>
          <ul className="space-y-2.5">
            <li>
              <a href="#hotels" className="hover:text-emerald-400 transition-colors">
                Phnom Penh Riverside
              </a>
            </li>
            <li>
              <a href="#hotels" className="hover:text-emerald-400 transition-colors">
                Siem Reap Angkor
              </a>
            </li>
            <li>
              <a href="#hotels" className="hover:text-emerald-400 transition-colors">
                Sihanoukville Beachfront
              </a>
            </li>
            <li>
              <a href="#hotels" className="hover:text-emerald-400 transition-colors">
                Kampot River Retreat
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Navigation */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
            Guest Services
          </h4>
          <ul className="space-y-2.5">
            <li>
              <a href="#rooms" className="hover:text-emerald-400 transition-colors">
                Suites & Villas
              </a>
            </li>
            <li>
              <a href="#amenities" className="hover:text-emerald-400 transition-colors">
                Royal Khmer Spa
              </a>
            </li>
            <li>
              <a href="#amenities" className="hover:text-emerald-400 transition-colors">
                Gourmet Dining
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenMyBookings}
                className="hover:text-emerald-400 transition-colors text-left"
              >
                My Reservations Lookup
              </button>
            </li>
            <li>
              <a href="#offers" className="hover:text-emerald-400 transition-colors">
                Seasonal Offers
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Legal */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
            Concierge Desk
          </h4>
          <ul className="space-y-2.5 text-slate-400">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-phone text-emerald-500 text-xs"></i>
              <span>+855 (0) 23 888 991</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-envelope text-emerald-500 text-xs"></i>
              <span>vip@romdulhotels.com</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-clock text-emerald-500 text-xs"></i>
              <span>24/7 Butler & Reception</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-500 text-[11px]">
          <p>
            © {new Date().getFullYear()} RomduL Hotels & Resorts Group. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Cookie Preferences
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
