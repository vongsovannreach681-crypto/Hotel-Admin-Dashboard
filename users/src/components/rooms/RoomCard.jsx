import React, { useState } from "react";
import { getImageUrl } from "../../api/api";

const RoomCard = ({ room, onSelectRoom, onBookRoom }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = Array.isArray(room.image) && room.image.length > 0
    ? room.image
    : [room.image || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"];

  const currentImage = getImageUrl(
    images[currentImageIndex],
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
  );

  const { price_per_night, status, bed_type } = room.room_information || {};
  const isAvailable = status !== false;
  const price = price_per_night ?? 180;
  const bed = bed_type || "1 King Bed";

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Room Image Container */}
      <div className="relative h-60 overflow-hidden bg-slate-100">
        <img
          src={currentImage}
          alt={room.room_type}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-1.5 ${
              isAvailable
                ? "bg-emerald-600/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAvailable ? "bg-emerald-200 animate-ping" : "bg-white"
              }`}
            ></span>
            <span>{isAvailable ? "Available" : "Reserved"}</span>
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-lg text-right">
            <span className="text-emerald-700 font-extrabold text-base">
              ${price}
            </span>
            <span className="text-[10px] text-slate-500 font-medium ml-1">
              / night
            </span>
          </div>
        </div>

        {/* Multiple Images Carousel Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              aria-label="Previous image"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              aria-label="Next image"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "bg-white w-3"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Hotel Name Chip on bottom left */}
        <div className="absolute bottom-3 left-4 max-w-[80%]">
          <span className="bg-black/40 backdrop-blur-md text-slate-100 text-[11px] font-medium px-2.5 py-0.5 rounded-md truncate block border border-white/10">
            {room.hotel_name || "RomduL Luxury Collection"}
          </span>
        </div>
      </div>

      {/* Room Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Room Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold font-serif text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {room.room_type}
            </h3>
          </div>

          {/* Quick specs: Bed, Floor, Room Number */}
          <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-bed text-emerald-600"></i>
              <span>{bed}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-layer-group text-emerald-600"></i>
              <span>Floor {room.floor ?? 1}</span>
            </span>
            {room.room_number && (
              <>
                <span>•</span>
                <span className="text-slate-400">#{room.room_number}</span>
              </>
            )}
          </div>

          {/* Room Description */}
          <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
            {room.description ||
              "Enjoy a tranquil sanctuary featuring bespoke handcrafted furnishings, plush premium bedding, and a marble bath."}
          </p>

          {/* Key Amenities */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {[
              "High-Speed Wi-Fi",
              "Balcony View",
              "Breakfast Included",
              "Air Conditioning",
            ].slice(0, 3).map((feature, i) => (
              <span
                key={i}
                className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1"
              >
                <i className="fa-solid fa-check text-emerald-600 text-[9px]"></i>
                <span>{feature}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onSelectRoom(room)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-circle-info text-emerald-600"></i>
            <span>Details</span>
          </button>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={() => onBookRoom(room)}
            className={`w-full text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 ${
              isAvailable
                ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-emerald-700/20 active:scale-95 cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <i className="fa-solid fa-calendar-check"></i>
            <span>{isAvailable ? "Book Now" : "Reserved"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
