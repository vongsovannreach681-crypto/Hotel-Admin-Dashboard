import React, { useState, useMemo } from "react";
import HotelCard from "./HotelCard";

const HotelSection = ({
  hotels = [],
  loading = false,
  onSelectHotel,
  onViewRooms,
  initialCityFilter = "all",
}) => {
  const [selectedCity, setSelectedCity] = useState(initialCityFilter);
  const [searchTerm, setSearchTerm] = useState("");

  // Extract unique cities from hotels list
  const cities = useMemo(() => {
    const citySet = new Set(
      hotels.map((h) => h.location?.city).filter(Boolean)
    );
    return ["all", ...Array.from(citySet)];
  }, [hotels]);

  // Filtered hotels
  const filteredHotels = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return hotels.filter((hotel) => {
      const matchesCity =
        selectedCity === "all" ||
        hotel.location?.city?.toLowerCase() === selectedCity.toLowerCase();

      const matchesSearch =
        !term ||
        hotel.hotel_name?.toLowerCase().includes(term) ||
        hotel.location?.city?.toLowerCase().includes(term) ||
        hotel.location?.street?.toLowerCase().includes(term) ||
        hotel.description?.toLowerCase().includes(term);

      return matchesCity && matchesSearch;
    });
  }, [hotels, selectedCity, searchTerm]);

  return (
    <section id="hotels" className="py-20 bg-slate-50 relative">
      {/* Decorative background element */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-3">
            <i className="fa-solid fa-hotel text-emerald-600"></i>
            <span>Signature Sanctuaries</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Discover Our Luxury Hotel Collection
          </h2>

          <p className="mt-3 text-base text-slate-600 font-light">
            Each RomduL property is thoughtfully designed to showcase the authentic soul of Cambodia while delivering 5-star elegance, sublime gastronomy, and peaceful retreats.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* City Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCity === city
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {city === "all" ? "All Locations" : city}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hotel name or city..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-600 focus:bg-white transition-colors font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <i className="fa-solid fa-circle-xmark"></i>
              </button>
            )}
          </div>
        </div>

        {/* Hotels Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-3xl bg-slate-200/80 animate-pulse"
              />
            ))}
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <i className="fa-solid fa-hotel text-slate-300 text-5xl mb-4"></i>
            <h3 className="text-lg font-bold text-slate-800">
              No Hotels Match Your Filter
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try choosing a different city or clearing your search keywords.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCity("all");
                setSearchTerm("");
              }}
              className="mt-4 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel._id || hotel.hotel_id}
                hotel={hotel}
                onSelectHotel={onSelectHotel}
                onViewRooms={onViewRooms}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HotelSection;
