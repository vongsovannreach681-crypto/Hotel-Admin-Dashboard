import React, { useState } from "react";
import { getImageUrl } from "../../api/api";

const RoomDetailModal = ({ room, onClose, onBookRoom }) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!room) return null;

  const images = Array.isArray(room.image) && room.image.length > 0
    ? room.image
    : [room.image || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"];

  const { price_per_night, status, bed_type } = room.room_information || {};
  const isAvailable = status !== false;
  const price = price_per_night ?? 180;
  const bed = bed_type || "1 King Bed";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col">
        {/* Main Banner Image */}
        <div className="relative h-64 sm:h-80 bg-slate-900 flex-shrink-0">
          <img
            src={getImageUrl(
              images[selectedImgIndex],
              "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80"
            )}
            alt={room.room_type}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>

          {/* Price & availability on image */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
            <div>
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {room.hotel_name || "RomduL Hotel & Resort"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1.5">
                {room.room_type}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                ${price}
              </span>
              <span className="text-xs text-slate-300 font-medium block">
                / night (incl. taxes)
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnail selector if multiple images exist */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 bg-slate-100 border-b border-slate-200 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImgIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                  selectedImgIndex === idx
                    ? "border-emerald-600 ring-2 ring-emerald-500/30 scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={getImageUrl(img)}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Scrollable details */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Bed Setup
              </span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                <i className="fa-solid fa-bed text-emerald-600"></i>
                <span>{bed}</span>
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Floor / Number
              </span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                <i className="fa-solid fa-layer-group text-emerald-600"></i>
                <span>Floor {room.floor || 1} (#{room.room_number || "VIP"})</span>
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Max Capacity
              </span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                <i className="fa-solid fa-users text-emerald-600"></i>
                <span>Up to {room.max_guests || 2} Guests</span>
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Status
              </span>
              <span
                className={`text-sm font-bold flex items-center gap-1.5 mt-1 ${
                  isAvailable ? "text-emerald-600" : "text-red-600"
                }`}
              >
                <i
                  className={`fa-solid ${
                    isAvailable ? "fa-circle-check" : "fa-circle-xmark"
                  }`}
                ></i>
                <span>{isAvailable ? "Available Now" : "Reserved"}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Suite Description
            </h4>
            <p className="text-sm leading-relaxed text-slate-600">
              {room.description ||
                "Featuring bespoke architectural elegance with panoramic views, custom teak wood detailing, an expansive rain shower, and complimentary artisanal amenities for an extraordinary stay."}
            </p>
          </div>

          {/* Room Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Included Amenities & Privileges
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: "fa-solid fa-wifi", name: "Fiber Optic Wi-Fi" },
                { icon: "fa-solid fa-mug-hot", name: "Gourmet Breakfast" },
                { icon: "fa-solid fa-wind", name: "Climate Control AC" },
                { icon: "fa-solid fa-bath", name: "Rain Shower & Tub" },
                { icon: "fa-solid fa-tv", name: "55\" 4K Smart TV" },
                { icon: "fa-solid fa-lock", name: "Digital Safe Box" },
                { icon: "fa-solid fa-champagne-glasses", name: "Complimentary Mini-bar" },
                { icon: "fa-solid fa-shirt", name: "Bathrobes & Slippers" },
                { icon: "fa-solid fa-bell-concierge", name: "24/7 Room Service" },
              ].map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs font-medium text-slate-700"
                >
                  <i className={`${feat.icon} text-emerald-600 text-sm`}></i>
                  <span>{feat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-500 hidden sm:block">
            Instant reservation confirmation • 100% Secure Checkout
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              disabled={!isAvailable}
              onClick={() => {
                onClose();
                onBookRoom(room);
              }}
              className={`px-7 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 ${
                isAvailable
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-emerald-700/20 active:scale-95 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <i className="fa-solid fa-calendar-check"></i>
              <span>{isAvailable ? "Reserve This Suite" : "Room Unavailable"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailModal;
