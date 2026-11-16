import React, { useState, useMemo } from "react";
import { getImageUrl, submitBooking } from "../../api/api";

const BookingModal = ({
  room,
  hotel,
  onClose,
  onBookingSuccess,
}) => {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestsCount, setGuestsCount] = useState(2);
  const [checkIn, setCheckIn] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const future = new Date();
    future.setDate(future.getDate() + 4);
    return future.toISOString().split("T")[0];
  });
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!room) return null;

  const pricePerNight =
    room.room_information?.price_per_night ?? 180;

  // Calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkIn, checkOut]);

  // Total price calculation
  const subtotal = pricePerNight * nights;
  const taxesAndFees = Math.round(subtotal * 0.1);
  const totalPrice = subtotal + taxesAndFees;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!guestName.trim()) {
      setErrorMsg("Please enter the primary guest name.");
      return;
    }
    if (!guestEmail.trim()) {
      setErrorMsg("Please enter a valid confirmation email address.");
      return;
    }

    setIsSubmitting(true);

    const bookingPayload = {
      booking_id: Date.now() % 1000000,
      user_id: 1, // Guest user id
      hotel_id: room.hotel_id || (hotel ? hotel.hotel_id : 101),
      room_id: room.room_id || 201,
      check_in: checkIn,
      check_out: checkOut,
      nights,
      guests: Number(guestsCount),
      total_price: totalPrice,
      status: "confirmed",
      notes: notes
        ? `${notes} | Guest: ${guestName}, Phone: ${guestPhone}, Email: ${guestEmail}`
        : `Guest: ${guestName}, Phone: ${guestPhone}, Email: ${guestEmail}`,
    };

    const result = await submitBooking(bookingPayload);

    // Save to local storage for "My Bookings" access
    const savedRecord = {
      id: result.data?._id || `LOCAL-${Date.now()}`,
      booking_id: bookingPayload.booking_id,
      hotel_name: hotel?.hotel_name || room.hotel_name || "RomduL Luxury Resort",
      room_type: room.room_type,
      check_in: checkIn,
      check_out: checkOut,
      nights,
      guests: guestsCount,
      total_price: totalPrice,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      status: "confirmed",
      created_at: new Date().toISOString(),
      room_image: getImageUrl(room.image),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("romdul_user_bookings") || "[]");
      existing.unshift(savedRecord);
      localStorage.setItem("romdul_user_bookings", JSON.stringify(existing));
    } catch (err) {
      console.error("Failed to save to local storage:", err);
    }

    setIsSubmitting(false);
    setConfirmedBooking(savedRecord);
    if (onBookingSuccess) {
      onBookingSuccess(savedRecord);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[94vh] flex flex-col">
        {/* SUCCESS CONFIRMATION VIEW */}
        {confirmedBooking ? (
          <div className="p-6 sm:p-8 text-center flex-1 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              <i className="fa-solid fa-circle-check animate-bounce"></i>
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block">
              Reservation Confirmed
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              Thank You, {confirmedBooking.guest_name}!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              A confirmation email with your booking pass has been sent to{" "}
              <span className="font-semibold text-slate-800">
                {confirmedBooking.guest_email}
              </span>
            </p>

            {/* Ticket Card */}
            <div className="mt-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 text-left shadow-xl border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                    Booking Reference
                  </span>
                  <span className="text-xl font-mono font-bold text-white tracking-widest">
                    #{confirmedBooking.booking_id}
                  </span>
                </div>
                <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Confirmed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Hotel & Resort
                  </span>
                  <span className="font-bold text-white text-sm">
                    {confirmedBooking.hotel_name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Suite Type
                  </span>
                  <span className="font-bold text-white text-sm">
                    {confirmedBooking.room_type}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Check-in Date
                  </span>
                  <span className="font-semibold text-slate-200">
                    {confirmedBooking.check_in} (from 2:00 PM)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Check-out Date
                  </span>
                  <span className="font-semibold text-slate-200">
                    {confirmedBooking.check_out} (by 12:00 PM)
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Duration & Guests
                  </span>
                  <span className="font-semibold text-slate-200">
                    {confirmedBooking.nights} Nights • {confirmedBooking.guests} Guests
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Total Amount
                  </span>
                  <span className="font-extrabold text-emerald-400 text-base">
                    ${confirmedBooking.total_price} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-print text-emerald-600"></i>
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-7 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-700/20 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING FORM VIEW */
          <form
            onSubmit={handleSubmitBooking}
            className="flex flex-col max-h-[94vh]"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 block">
                  Complete Reservation
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                  Book {room.room_type}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* Room summary banner */}
              <div className="flex items-center gap-4 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
                <img
                  src={getImageUrl(room.image)}
                  alt={room.room_type}
                  className="w-20 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-emerald-800 block truncate">
                    {hotel?.hotel_name || room.hotel_name || "RomduL Hotel"}
                  </span>
                  <span className="font-bold text-slate-900 text-sm block truncate">
                    {room.room_type}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    ${pricePerNight} / night • {room.room_information?.bed_type || "1 King Bed"}
                  </span>
                </div>
              </div>

              {/* Error alert if any */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Dates & Guests row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-emerald-600 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-emerald-600 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Guests
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-emerald-600 focus:bg-white font-medium cursor-pointer"
                  >
                    <option value="1">1 Adult</option>
                    <option value="2">2 Adults</option>
                    <option value="3">3 Adults (Suite)</option>
                    <option value="4">4 Adults (Family)</option>
                  </select>
                </div>
              </div>

              {/* Guest Details Form */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Guest Contact Information
                </h4>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Johnathan Doe"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-600 focus:bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. guest@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-600 focus:bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +855 12 345 678"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-600 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Special Requests & Preferences (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. High floor, airport pick-up time, dietary restrictions, anniversary setup..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2 outline-none focus:border-emerald-600 focus:bg-white font-medium resize-none"
                  />
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>
                    ${pricePerNight} × {nights} {nights === 1 ? "night" : "nights"}
                  </span>
                  <span className="font-semibold text-slate-800">${subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Estimated Taxes & Luxury Service Fee (10%)</span>
                  <span className="font-semibold text-slate-800">${taxesAndFees}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                      Total Payable
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      Pay now or upon check-in
                    </span>
                  </div>
                  <span className="text-xl font-extrabold text-emerald-700">
                    ${totalPrice} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Submit Button */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-700/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock text-emerald-200"></i>
                    <span>Confirm & Book Stay</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
