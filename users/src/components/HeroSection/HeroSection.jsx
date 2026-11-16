import React, { useState } from "react";

const HeroSection = ({
  hotels = [],
  onSearch,
  onExploreHotels,
  onExploreRooms,
}) => {
  const [selectedCity, setSelectedCity] = useState("all");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [roomType, setRoomType] = useState("all");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({
      city: selectedCity,
      checkIn,
      checkOut,
      guests,
      roomType,
    });
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-900 overflow-hidden"
    >
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury Resort Background"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-10000"
          style={{ animationDuration: "12s" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/70 backdrop-blur-[1px]" />
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl w-full mx-auto text-center flex flex-col items-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-6 shadow-lg">
          <i className="fa-solid fa-crown text-amber-400 text-sm"></i>
          <span>Welcome to RomduL Luxury Hotels & Resorts</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.15] max-w-4xl text-balance">
          Experience Royal Elegance & Unmatched Serenity
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-200/90 font-light max-w-2xl text-balance leading-relaxed">
          Indulge in Cambodia&apos;s most prestigious 5-star destinations — from the
          historic Phnom Penh riverside to the mystical temples of Angkor and
          coastal private islands.
        </p>

        {/* Quick CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onExploreHotels}
            className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-7 py-3.5 rounded-xl shadow-xl shadow-emerald-900/40 hover:shadow-emerald-700/50 transition-all duration-200 active:scale-95"
          >
            <i className="fa-solid fa-hotel"></i>
            <span>Explore Our Hotels</span>
          </button>
          <button
            type="button"
            onClick={onExploreRooms}
            className="flex items-center gap-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-7 py-3.5 rounded-xl border border-white/30 backdrop-blur-md shadow-lg transition-all duration-200 active:scale-95"
          >
            <i className="fa-solid fa-bed"></i>
            <span>Browse Luxury Suites</span>
          </button>
        </div>

        {/* Floating Search & Booking Filter Card */}
        <div className="mt-12 w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/40 text-left">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
          >
            {/* Destination / City */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-emerald-600"></i>
                <span>Destination</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-100 hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium cursor-pointer transition-colors"
              >
                <option value="all">All Destinations</option>
                <option value="Phnom Penh">Phnom Penh (Riverside)</option>
                <option value="Siem Reap">Siem Reap (Angkor)</option>
                <option value="Sihanoukville">Sihanoukville (Beachfront)</option>
                <option value="Kampot">Kampot (River Valley)</option>
              </select>
            </div>

            {/* Check-In Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <i className="fa-regular fa-calendar-check text-emerald-600"></i>
                <span>Check-in</span>
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-slate-100 hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium cursor-pointer transition-colors"
              />
            </div>

            {/* Check-Out Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <i className="fa-regular fa-calendar-xmark text-emerald-600"></i>
                <span>Check-out</span>
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-slate-100 hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium cursor-pointer transition-colors"
              />
            </div>

            {/* Room Type */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <i className="fa-solid fa-door-open text-emerald-600"></i>
                <span>Room Style</span>
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-slate-100 hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-medium cursor-pointer transition-colors"
              >
                <option value="all">All Room Types</option>
                <option value="suite">Royal Suite / Villa</option>
                <option value="deluxe">Deluxe Room</option>
                <option value="king">King Bed</option>
                <option value="twin">Twin Beds</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-700/30 hover:shadow-emerald-700/50 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
                <span>Search Stays</span>
              </button>
            </div>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-200">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
            <i className="fa-solid fa-award text-amber-400 text-2xl"></i>
            <div className="text-left">
              <span className="block text-white font-bold text-sm">5-Star Luxury</span>
              <span className="block text-xs text-slate-400">Awarded Excellence</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
            <i className="fa-solid fa-tags text-emerald-400 text-2xl"></i>
            <div className="text-left">
              <span className="block text-white font-bold text-sm">Best Rate Guarantee</span>
              <span className="block text-xs text-slate-400">Direct Booking Perks</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
            <i className="fa-solid fa-bell-concierge text-teal-400 text-2xl"></i>
            <div className="text-left">
              <span className="block text-white font-bold text-sm">24/7 Butler Service</span>
              <span className="block text-xs text-slate-400">Tailored Hospitality</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
            <i className="fa-solid fa-shield-halved text-cyan-400 text-2xl"></i>
            <div className="text-left">
              <span className="block text-white font-bold text-sm">Instant Confirmation</span>
              <span className="block text-xs text-slate-400">Free Cancellation Option</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
