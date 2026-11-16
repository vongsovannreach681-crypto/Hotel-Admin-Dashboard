import React, { useState, useEffect } from "react";
import { getBookingsData } from "../../api/api";

const MyBookingsModal = ({ onClose }) => {
  const [localBookings, setLocalBookings] = useState([]);
  const [backendBookings, setBackendBookings] = useState([]);
  const [searchRef, setSearchRef] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load local storage bookings
    try {
      const stored = JSON.parse(
        localStorage.getItem("romdul_user_bookings") || "[]"
      );
      setLocalBookings(stored);
    } catch (e) {
      console.error(e);
    }

    // Load backend bookings to allow lookup by ID
    const fetchApiBookings = async () => {
      try {
        const data = await getBookingsData();
        setBackendBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApiBookings();
  }, []);

  const handleCancelReservation = (bookingId) => {
    const confirm = window.confirm(
      `Are you sure you want to cancel booking #${bookingId}?`
    );
    if (!confirm) return;

    const updated = localBookings.map((b) =>
      b.booking_id === bookingId ? { ...b, status: "cancelled" } : b
    );
    setLocalBookings(updated);
    localStorage.setItem("romdul_user_bookings", JSON.stringify(updated));
  };

  // Combine or filter
  const displayBookings = localBookings.filter((b) => {
    if (!searchRef.trim()) return true;
    const term = searchRef.toLowerCase();
    return (
      String(b.booking_id).includes(term) ||
      b.hotel_name?.toLowerCase().includes(term) ||
      b.guest_name?.toLowerCase().includes(term) ||
      b.guest_email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <i className="fa-solid fa-receipt text-base"></i>
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900">
                My Reservations
              </h3>
              <p className="text-xs text-slate-500">
                View your confirmed hotel stays, receipts, and booking status.
              </p>
            </div>
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

        {/* Search / Filter bar */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              placeholder="Search by Booking ID, Hotel, or Guest Name..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white font-medium"
            />
          </div>
          {searchRef && (
            <button
              type="button"
              onClick={() => setSearchRef("")}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Clear
            </button>
          )}
        </div>

        {/* Bookings List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-700">
          {displayBookings.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/80 p-6">
              <i className="fa-solid fa-calendar-xmark text-slate-300 text-5xl mb-3"></i>
              <h4 className="font-bold text-slate-800 text-base">
                No Reservations Found
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                You haven&apos;t booked any suites yet in this browser session, or no matching reservation ID was found.
              </p>
            </div>
          ) : (
            displayBookings.map((item) => (
              <div
                key={item.id || item.booking_id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Reference #{item.booking_id}
                    </span>
                    <h4 className="font-serif font-bold text-slate-900 text-base">
                      {item.hotel_name}
                    </h4>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      item.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {item.status || "Confirmed"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Room / Suite
                    </span>
                    <span className="font-bold text-slate-800">
                      {item.room_type}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Check-in & Out
                    </span>
                    <span className="font-semibold text-slate-700">
                      {item.check_in} → {item.check_out}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Guest & Stay
                    </span>
                    <span className="font-semibold text-slate-700">
                      {item.guest_name} ({item.nights} Nights)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Total Paid / Due
                    </span>
                    <span className="font-extrabold text-emerald-700 text-sm">
                      ${item.total_price} USD
                    </span>
                  </div>
                </div>

                {item.status !== "cancelled" && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleCancelReservation(item.booking_id)}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                    >
                      Cancel Reservation
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className="fa-solid fa-print text-emerald-600"></i>
                      <span>Print Pass</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            For modifications, call concierge at +855 23 888 991
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsModal;
