import React, { useState, useEffect } from "react";
import Header from "./components/Navbar/Header";
import HeroSection from "./components/HeroSection/HeroSection";
import HotelSection from "./components/hotels/HotelSection";
import HotelDetailModal from "./components/hotels/HotelDetailModal";
import RoomSection from "./components/rooms/RoomSection";
import RoomDetailModal from "./components/rooms/RoomDetailModal";
import BookingModal from "./components/booking/BookingModal";
import MyBookingsModal from "./components/booking/MyBookingsModal";
import AmenitiesSection from "./components/sections/AmenitiesSection";
import SpecialOffers from "./components/sections/SpecialOffers";
import AboutSection from "./components/sections/AboutSection";
import ContactSection from "./components/sections/ContactSection";
import Footer from "./components/Footer/Footer";

import { getHotelsData, getRoomsData } from "./api/api";

const App = () => {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Modals state
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    isOpen: false,
    room: null,
    hotel: null,
  });
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Filter pass-through from Hero
  const [cityFilter, setCityFilter] = useState("all");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelsRes, roomsRes] = await Promise.all([
          getHotelsData(),
          getRoomsData(),
        ]);
        setHotels(hotelsRes);
        setRooms(roomsRes);
      } catch (error) {
        console.error("Error loading hotel catalog:", error);
      } finally {
        setLoadingHotels(false);
        setLoadingRooms(false);
      }
    };

    fetchData();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Hero search handler
  const handleHeroSearch = ({ city, roomType }) => {
    if (city && city !== "all") {
      setCityFilter(city);
      scrollToSection("hotels");
    } else if (roomType && roomType !== "all") {
      scrollToSection("rooms");
    } else {
      scrollToSection("hotels");
    }
  };

  // Trigger Booking flow
  const handleStartBooking = (room, hotel = null) => {
    // If no room is specified, select the first available room
    const targetRoom =
      room ||
      rooms.find((r) => r.room_information?.status !== false) ||
      rooms[0];
    const targetHotel =
      hotel ||
      hotels.find(
        (h) =>
          h.hotel_id === targetRoom?.hotel_id ||
          h.hotel_name === targetRoom?.hotel_name
      ) ||
      hotels[0];

    setBookingData({
      isOpen: true,
      room: targetRoom,
      hotel: targetHotel,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-800 antialiased selection:bg-emerald-600 selection:text-white">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border text-xs font-bold ${
              toast.type === "success"
                ? "bg-emerald-800/95 text-white border-emerald-500/40"
                : "bg-slate-900/95 text-white border-slate-700"
            }`}
          >
            <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onBookNowClick={() => handleStartBooking(null, null)}
      />

      <main>
        {/* 1. Hero Section with Search Bar */}
        <HeroSection
          hotels={hotels}
          onSearch={handleHeroSearch}
          onExploreHotels={() => scrollToSection("hotels")}
          onExploreRooms={() => scrollToSection("rooms")}
        />

        {/* 2. Hotel Sanctuaries Section */}
        <HotelSection
          hotels={hotels}
          loading={loadingHotels}
          initialCityFilter={cityFilter}
          onSelectHotel={(hotel) => setSelectedHotel(hotel)}
          onViewRooms={(hotel) => {
            setSelectedHotel(hotel);
          }}
        />

        {/* 3. Luxury Rooms & Suites Section */}
        <RoomSection
          rooms={rooms}
          loading={loadingRooms}
          onSelectRoom={(room) => setSelectedRoom(room)}
          onBookRoom={(room) => handleStartBooking(room)}
        />

        {/* 4. Curated Amenities & Privileges */}
        <AmenitiesSection />

        {/* 5. Special Seasonal Offers */}
        <SpecialOffers
          onClaimOffer={(offer) => {
            showToast(`Offer "${offer.code}" applied! Select your suite.`);
            scrollToSection("rooms");
          }}
        />

        {/* 6. Heritage Story & Guest Testimonials */}
        <AboutSection />

        {/* 7. Concierge & Contact Channels */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenMyBookings={() => setIsMyBookingsOpen(true)} />

      {/* MODAL 1: Hotel Details */}
      {selectedHotel && (
        <HotelDetailModal
          hotel={selectedHotel}
          rooms={rooms}
          onClose={() => setSelectedHotel(null)}
          onBookRoom={(room, hotel) => handleStartBooking(room, hotel)}
        />
      )}

      {/* MODAL 2: Room Details */}
      {selectedRoom && (
        <RoomDetailModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onBookRoom={(room) => handleStartBooking(room)}
        />
      )}

      {/* MODAL 3: Interactive Booking Checkout */}
      {bookingData.isOpen && bookingData.room && (
        <BookingModal
          room={bookingData.room}
          hotel={bookingData.hotel}
          onClose={() =>
            setBookingData({ isOpen: false, room: null, hotel: null })
          }
          onBookingSuccess={(booking) => {
            showToast(
              `Reservation #${booking.booking_id} confirmed for ${booking.guest_name}!`
            );
          }}
        />
      )}

      {/* MODAL 4: My Bookings & Reservation Lookup */}
      {isMyBookingsOpen && (
        <MyBookingsModal onClose={() => setIsMyBookingsOpen(false)} />
      )}
    </div>
  );
};

export default App;