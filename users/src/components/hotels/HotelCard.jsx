import React from "react";
import { getImageUrl } from "../../api/api";

const HotelCard = ({ hotel, onSelectHotel, onViewRooms }) => {
  const imageUrl = getImageUrl(
    hotel.image,
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
  );

  const starCount = Math.min(Math.max(hotel.star_rating || 5, 1), 5);
  const locationString = [
    hotel.location?.street,
    hotel.location?.city,
    hotel.location?.country,
  ]
    .filter(Boolean)
    .join(", ") || "Cambodia";

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Hotel Image Container */}
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={hotel.hotel_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          {/* Star Rating Badge */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
            {[...Array(starCount)].map((_, i) => (
              <i key={i} className="fa-solid fa-star text-amber-400 text-xs"></i>
            ))}
            <span className="text-slate-800 text-xs font-bold ml-1">
              {starCount}.0
            </span>
          </div>

          {/* Available Rooms Badge */}
          <span className="bg-emerald-600/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
            <span>{hotel.available_rooms ?? 12} Rooms Available</span>
          </span>
        </div>

        {/* City Chip on bottom left of image */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
            <i className="fa-solid fa-location-dot text-emerald-400 text-xs"></i>
            <span>{hotel.location?.city || "Cambodia"}</span>
          </span>
        </div>
      </div>

      {/* Hotel Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Hotel Name */}
          <h3 className="text-xl font-bold font-serif text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {hotel.hotel_name}
          </h3>

          {/* Full Location Address */}
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 line-clamp-1">
            <i className="fa-solid fa-map-pin text-emerald-600 flex-shrink-0"></i>
            <span>{locationString}</span>
          </p>

          {/* Description */}
          <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">
            {hotel.description ||
              "Experience world-class luxury accommodations, authentic hospitality, signature dining, and scenic views at RomduL."}
          </p>

          {/* Amenities tags / pills */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {(
              hotel.amenities || [
                "Infinity Pool",
                "Luxury Spa",
                "Fine Dining",
                "Free Wi-Fi",
              ]
            )
              .slice(0, 3)
              .map((amenity, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-50 text-emerald-800 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1"
                >
                  <i className="fa-solid fa-circle-check text-emerald-600 text-[10px]"></i>
                  <span>{amenity}</span>
                </span>
              ))}
            {hotel.amenities && hotel.amenities.length > 3 && (
              <span className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-1 rounded-lg">
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Contact info & Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
            {hotel.contact?.phone && (
              <span className="flex items-center gap-1">
                <i className="fa-solid fa-phone text-emerald-600"></i>
                <span>{hotel.contact.phone}</span>
              </span>
            )}
            {hotel.contact?.email && (
              <span className="flex items-center gap-1 truncate max-w-[150px]">
                <i className="fa-solid fa-envelope text-emerald-600"></i>
                <span className="truncate">{hotel.contact.email}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onSelectHotel(hotel)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <i className="fa-solid fa-circle-info text-emerald-600"></i>
              <span>Details</span>
            </button>

            <button
              type="button"
              onClick={() => onViewRooms(hotel)}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <i className="fa-solid fa-bed"></i>
              <span>View Rooms</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
