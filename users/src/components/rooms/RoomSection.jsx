import React, { useState, useMemo } from "react";
import RoomCard from "./RoomCard";

const RoomSection = ({
  rooms = [],
  loading = false,
  onSelectRoom,
  onBookRoom,
}) => {
  const [bedFilter, setBedFilter] = useState("all");
  const [priceSort, setPriceSort] = useState("default");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAndSortedRooms = useMemo(() => {
    let result = [...rooms];

    // 1. Availability filter
    if (onlyAvailable) {
      result = result.filter(
        (room) => room.room_information?.status !== false
      );
    }

    // 2. Bed Type Filter
    if (bedFilter !== "all") {
      result = result.filter((room) => {
        const bed = (room.room_information?.bed_type || "").toLowerCase();
        const type = (room.room_type || "").toLowerCase();
        if (bedFilter === "king") return bed.includes("king") || type.includes("king");
        if (bedFilter === "queen") return bed.includes("queen") || type.includes("queen");
        if (bedFilter === "twin") return bed.includes("twin") || type.includes("twin");
        if (bedFilter === "suite") return type.includes("suite") || type.includes("villa");
        return true;
      });
    }

    // 3. Search Filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (room) =>
          room.room_type?.toLowerCase().includes(term) ||
          room.hotel_name?.toLowerCase().includes(term) ||
          room.description?.toLowerCase().includes(term) ||
          room.room_information?.bed_type?.toLowerCase().includes(term)
      );
    }

    // 4. Price Sorting
    if (priceSort === "low-high") {
      result.sort(
        (a, b) =>
          (a.room_information?.price_per_night || 0) -
          (b.room_information?.price_per_night || 0)
      );
    } else if (priceSort === "high-low") {
      result.sort(
        (a, b) =>
          (b.room_information?.price_per_night || 0) -
          (a.room_information?.price_per_night || 0)
      );
    }

    return result;
  }, [rooms, bedFilter, priceSort, onlyAvailable, searchTerm]);

  return (
    <section id="rooms" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-3">
            <i className="fa-solid fa-bed text-emerald-600"></i>
            <span>Accommodations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Explore Luxury Rooms & Presidential Suites
          </h2>

          <p className="mt-3 text-base text-slate-600 font-light">
            Designed for pure comfort and tranquility. Choose from scenic riverview suites, intimate garden villas, and oceanfront bungalows.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Bed Type Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              {[
                { id: "all", label: "All Suites" },
                { id: "king", label: "King Bed" },
                { id: "queen", label: "Queen Bed" },
                { id: "twin", label: "Twin Beds" },
                { id: "suite", label: "Villas & Suites" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBedFilter(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    bedFilter === item.id
                      ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Price sort & Available Toggle */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end flex-wrap">
              {/* Search keyword input */}
              <div className="relative flex-1 sm:w-56">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter suites..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              {/* Price Sort Dropdown */}
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="default">Sort by: Recommended</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>

              {/* Available only toggle */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 rounded-md accent-emerald-600"
                />
                <span>Available Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 rounded-3xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : filteredAndSortedRooms.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 p-8">
            <i className="fa-solid fa-bed text-slate-300 text-5xl mb-4"></i>
            <h3 className="text-lg font-bold text-slate-800">
              No Suites Match Your Selection
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Please adjust your filters or clear the search criteria to view all available suites.
            </p>
            <button
              type="button"
              onClick={() => {
                setBedFilter("all");
                setSearchTerm("");
                setOnlyAvailable(false);
                setPriceSort("default");
              }}
              className="mt-4 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedRooms.map((room) => (
              <RoomCard
                key={room._id || room.room_id}
                room={room}
                onSelectRoom={onSelectRoom}
                onBookRoom={onBookRoom}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomSection;
