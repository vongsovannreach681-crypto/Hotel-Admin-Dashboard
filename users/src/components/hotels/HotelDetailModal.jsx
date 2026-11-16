import React, { useState } from "react";
import { getImageUrl } from "../../api/api";

const HotelDetailModal = ({
  hotel,
  rooms = [],
  onClose,
  onBookRoom,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!hotel) return null;

  const imageUrl = getImageUrl(
    hotel.image,
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
  );

  const starCount = Math.min(Math.max(hotel.star_rating || 5, 1), 5);

  const locationString = [
    hotel.location?.street,
    hotel.location?.city,
    hotel.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  // Match rooms belonging to this hotel if hotel_id or hotel_name matches
  const hotelRooms = rooms.filter((r) => {
    if (hotel.hotel_id && r.hotel_id) {
      return Number(r.hotel_id) === Number(hotel.hotel_id);
    }
    if (hotel.hotel_name && r.hotel_name) {
      return (
        r.hotel_name.toLowerCase().includes(hotel.hotel_name.toLowerCase()) ||
        hotel.hotel_name.toLowerCase().includes(r.hotel_name.toLowerCase())
      );
    }
    return true; // fallback: show all rooms if unlinked
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col">
        {/* Header Hero Image */}
        <div className="relative h-64 sm:h-80 bg-slate-900 flex-shrink-0">
          <img
            src={imageUrl}
            alt={hotel.hotel_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Close modal"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>

          {/* Title & Info on image */}
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                {hotel.location?.city || "Luxury Destination"}
              </span>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs text-amber-300">
                {[...Array(starCount)].map((_, i) => (
                  <i key={i} className="fa-solid fa-star text-xs"></i>
                ))}
                <span className="text-white font-bold ml-1">{starCount}.0</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide">
              {hotel.hotel_name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 mt-1 flex items-center gap-1.5">
              <i className="fa-solid fa-map-pin text-emerald-400"></i>
              <span>{locationString}</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "overview"
                ? "border-emerald-600 text-emerald-800 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <i className="fa-solid fa-hotel mr-2"></i>
            Hotel Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rooms")}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "rooms"
                ? "border-emerald-600 text-emerald-800 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <i className="fa-solid fa-bed mr-2"></i>
            Available Rooms ({hotelRooms.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("amenities")}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "amenities"
                ? "border-emerald-600 text-emerald-800 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <i className="fa-solid fa-spa mr-2"></i>
            Services & Amenities
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                  About the Property
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                  {hotel.description ||
                    "Nestled in one of Cambodia's most picturesque settings, this RomduL luxury sanctuary harmoniously unites timeless Khmer cultural heritage with modern 5-star elegance. Enjoy private balcony vistas, personalized butler care, gourmet culinary feasts, and award-winning holistic wellness therapies."}
                </p>
              </div>

              {/* Quick Contact & Details Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2">
                    <i className="fa-solid fa-door-open text-sm"></i>
                  </div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Available Rooms
                  </span>
                  <span className="text-lg font-bold text-emerald-700">
                    {hotel.available_rooms ?? 12} Units Ready
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-2">
                    <i className="fa-solid fa-phone text-sm"></i>
                  </div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Direct Phone
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {hotel.contact?.phone || "+855 23 888 991"}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-2">
                    <i className="fa-solid fa-envelope text-sm"></i>
                  </div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Concierge Email
                  </span>
                  <span className="text-xs font-semibold text-slate-800 truncate block">
                    {hotel.contact?.email || "concierge@romdulhotels.com"}
                  </span>
                </div>
              </div>

              {/* Featured Amenities preview */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Signature Highlights
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    "Private Balcony / Terrace",
                    "Infinity Sky Swimming Pool",
                    "Royal Khmer Herbal Spa",
                    "Farm-to-Table Restaurant",
                    "24-Hour Butler & Concierge",
                    "High-Speed Fiber Wi-Fi",
                  ].map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs font-medium text-slate-700"
                    >
                      <i className="fa-solid fa-check text-emerald-600"></i>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROOMS LIST */}
          {activeTab === "rooms" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Suites & Rooms at this Hotel
              </h4>

              {hotelRooms.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl">
                  <i className="fa-solid fa-bed text-slate-300 text-4xl mb-3"></i>
                  <p className="text-sm text-slate-500">
                    All suites for this hotel are currently booked or undergoing seasonal refresh.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {hotelRooms.map((room) => {
                    const price =
                      room.room_information?.price_per_night || 180;
                    const bed =
                      room.room_information?.bed_type || "1 King Bed";
                    const isAvail = room.room_information?.status !== false;
                    const roomImg = getImageUrl(
                      room.image,
                      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"
                    );

                    return (
                      <div
                        key={room._id}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                      >
                        <div className="relative h-40 bg-slate-100">
                          <img
                            src={roomImg}
                            alt={room.room_type}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                            ${price} / night
                          </span>
                          <span
                            className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isAvail
                                ? "bg-emerald-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {isAvail ? "Available" : "Reserved"}
                          </span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h5 className="font-bold text-slate-900 text-base">
                              {room.room_type}
                            </h5>
                            <p className="text-xs text-slate-500 mt-1">
                              {bed} • Floor {room.floor || 1} • Room #{room.room_number || "VIP"}
                            </p>
                            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                              {room.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={!isAvail}
                            onClick={() => {
                              onClose();
                              onBookRoom(room, hotel);
                            }}
                            className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                              isAvail
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer active:scale-95"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            <i className="fa-solid fa-calendar-check"></i>
                            <span>{isAvail ? "Book This Suite" : "Unavailable"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AMENITIES */}
          {activeTab === "amenities" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Resort Services & Luxury Privileges
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: "fa-solid fa-water-ladder",
                    title: "Infinity Sky Pool",
                    desc: "Temperature-controlled swimming pool with skyline and nature views.",
                  },
                  {
                    icon: "fa-solid fa-spa",
                    title: "Royal Wellness & Spa",
                    desc: "Organic herbal aromatherapy and traditional master massages.",
                  },
                  {
                    icon: "fa-solid fa-utensils",
                    title: "Michelin-Inspired Dining",
                    desc: "Authentic royal Cambodian cuisine and international gourmet gastronomy.",
                  },
                  {
                    icon: "fa-solid fa-bell-concierge",
                    title: "24/7 Butler & Room Service",
                    desc: "Private room dining, baggage handling, and tailored excursion arrangements.",
                  },
                  {
                    icon: "fa-solid fa-car",
                    title: "Private Airport Limousine",
                    desc: "Seamless pick-up with chilled refresher towels and Wi-Fi aboard.",
                  },
                  {
                    icon: "fa-solid fa-wifi",
                    title: "Ultra High-Speed Wi-Fi",
                    desc: "Uninterrupted connectivity throughout the property and gardens.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-base">
                      <i className={item.icon}></i>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">
                        {item.title}
                      </h5>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-500 hidden sm:block">
            <span className="font-semibold text-slate-700">RomduL Guarantee:</span> Best rate & free changes up to 24h before check-in.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("rooms")}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider shadow-md cursor-pointer"
            >
              View Suites & Rates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailModal;
