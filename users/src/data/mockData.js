export const MOCK_HOTELS = [
  {
    _id: "mock-hotel-1",
    hotel_id: 101,
    hotel_name: "RomduL Grand Palace & Spa",
    star_rating: 5,
    location: {
      street: "244 Preah Sisowath Quay, Riverside",
      city: "Phnom Penh",
      country: "Cambodia",
    },
    contact: {
      phone: "+855 (0) 23 888 991",
      email: "grandpalace@romdulhotels.com",
    },
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    available_rooms: 18,
    description:
      "A flagship luxury riverfront sanctuary nestled on the historic Phnom Penh riverside. Featuring French colonial architecture, private river-view balconies, an imperial spa, and rooftop fine dining overlooking the Mekong.",
    amenities: [
      "Infinity Sky Pool",
      "Royal Khmer Spa",
      "Rooftop Sunset Lounge",
      "Michelin-inspired Dining",
      "24/7 Butler Service",
      "Airport Limousine VIP",
    ],
    price_range: "$140 - $480 / night",
  },
  {
    _id: "mock-hotel-2",
    hotel_id: 102,
    hotel_name: "RomduL Angkor Heritage Resort",
    star_rating: 5,
    location: {
      street: "Charles de Gaulle Blvd, Angkor Heritage Park",
      city: "Siem Reap",
      country: "Cambodia",
    },
    contact: {
      phone: "+855 (0) 63 969 888",
      email: "angkor@romdulhotels.com",
    },
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    available_rooms: 12,
    description:
      "Immerse yourself in ancient temple serenity surrounded by tropical lotus gardens and reflecting pools. Experience traditional Apsara culinary nights, an Ayurvedic wellness retreat, and exclusive Angkor sunrise tours.",
    amenities: [
      "Lotus Lagoon Pool",
      "Ayurvedic Herbal Spa",
      "Temple Tour Concierge",
      "Organic Garden Restaurant",
      "Cultural Dance Stage",
      "Complimentary Tuk-Tuk",
    ],
    price_range: "$120 - $390 / night",
  },
  {
    _id: "mock-hotel-3",
    hotel_id: 103,
    hotel_name: "RomduL Serenity Beach Resort & Villas",
    star_rating: 5,
    location: {
      street: "Otres 2 Beachfront Avenue",
      city: "Sihanoukville",
      country: "Cambodia",
    },
    contact: {
      phone: "+855 (0) 34 933 777",
      email: "beach@romdulhotels.com",
    },
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    available_rooms: 8,
    description:
      "Direct private beach access along pristine turquoise waters. Overwater private bungalows, world-class beach club, fresh seafood grill, and private sunset catamaran excursions.",
    amenities: [
      "Private White Beach",
      "Overwater Cabanas",
      "Seafood Ocean Grill",
      "Catamaran Yacht Charter",
      "Sunset Cocktail Bar",
      "Water Sports Hub",
    ],
    price_range: "$160 - $550 / night",
  },
  {
    _id: "mock-hotel-4",
    hotel_id: 104,
    hotel_name: "RomduL Riverview Boutique Retreat",
    star_rating: 4,
    location: {
      street: "Tuek Chhou Road, River Valley",
      city: "Kampot",
      country: "Cambodia",
    },
    contact: {
      phone: "+855 (0) 33 932 444",
      email: "kampot@romdulhotels.com",
    },
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    available_rooms: 15,
    description:
      "Surrounded by Bokor Mountain vistas and the tranquil Teuk Chhou river. Organic pepper farm dining, riverside kayak launches, and handcrafted wooden villa suites for peaceful rejuvenation.",
    amenities: [
      "Riverfront Boardwalk",
      "Mountain View Pool",
      "Kampot Pepper Bistro",
      "Eco Kayak & Paddleboards",
      "Yoga Pavilions",
      "Firepit Star Lounge",
    ],
    price_range: "$85 - $260 / night",
  },
];

export const MOCK_ROOMS = [
  {
    _id: "mock-room-1",
    room_id: 201,
    hotel_id: 101,
    hotel_name: "RomduL Grand Palace & Spa",
    room_number: 501,
    room_type: "Presidential Royal Suite",
    floor: 5,
    description:
      "The pinnacle of luxury with panoramic river views, master king bedroom, marble jacuzzi bathroom, private dining terrace, and dedicated 24-hour butler.",
    image: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    ],
    room_information: {
      price_per_night: 420,
      status: true,
      bed_type: "Imperial King Bed",
    },
    features: ["River View", "Private Jacuzzi", "Balcony", "Free Breakfast", "Mini Bar", "High-speed Wi-Fi"],
    max_guests: 3,
    size: "95 sqm / 1,022 sqft",
  },
  {
    _id: "mock-room-2",
    room_id: 202,
    hotel_id: 101,
    hotel_name: "RomduL Grand Palace & Spa",
    room_number: 408,
    room_type: "Deluxe Riverview King",
    floor: 4,
    description:
      "Spacious designer room overlooking the vibrant Mekong river with custom teak furnishings, plush king bedding, and an Italian rain shower.",
    image: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    ],
    room_information: {
      price_per_night: 210,
      status: true,
      bed_type: "1 King Bed",
    },
    features: ["Riverfront Balcony", "Rain Shower", "Work Desk", "Espresso Machine", "Smart 4K TV"],
    max_guests: 2,
    size: "52 sqm / 560 sqft",
  },
  {
    _id: "mock-room-3",
    room_id: 203,
    hotel_id: 102,
    hotel_name: "RomduL Angkor Heritage Resort",
    room_number: 204,
    room_type: "Angkor Lotus Garden Villa",
    floor: 1,
    description:
      "Private garden sanctuary featuring an outdoor stone soaking tub, open-air tropical shower, traditional Khmer silks, and serene courtyard views.",
    image: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    ],
    room_information: {
      price_per_night: 275,
      status: true,
      bed_type: "1 King Bed",
    },
    features: ["Private Garden", "Stone Soaking Tub", "Outdoor Shower", "Breakfast Included", "Temple Shuttle"],
    max_guests: 2,
    size: "70 sqm / 753 sqft",
  },
  {
    _id: "mock-room-4",
    room_id: 204,
    hotel_id: 103,
    hotel_name: "RomduL Serenity Beach Resort",
    room_number: 102,
    room_type: "Oceanfront Sunset Bungalow",
    floor: 1,
    description:
      "Steps away from turquoise waves with uninterrupted sunset views, private sun lounger deck, hammock, and ocean-facing floor-to-ceiling glass doors.",
    image: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    ],
    room_information: {
      price_per_night: 340,
      status: true,
      bed_type: "1 King Bed",
    },
    features: ["Direct Beachfront", "Private Sun Deck", "Hammock", "Free Mini Bar", "Complimentary Kayak"],
    max_guests: 2,
    size: "68 sqm / 731 sqft",
  },
  {
    _id: "mock-room-5",
    room_id: 205,
    hotel_id: 101,
    hotel_name: "RomduL Grand Palace & Spa",
    room_number: 312,
    room_type: "Executive Twin Suite",
    floor: 3,
    description:
      "Ideal for friends or business colleagues with two premium double queen beds, ergonomic work station, and luxurious marble bathroom.",
    image: [
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    ],
    room_information: {
      price_per_night: 180,
      status: true,
      bed_type: "2 Queen Beds",
    },
    features: ["City Skyline View", "Twin Queen Beds", "Work Station", "Luxury Toiletries", "Fast Wi-Fi"],
    max_guests: 4,
    size: "48 sqm / 516 sqft",
  },
  {
    _id: "mock-room-6",
    room_id: 206,
    hotel_id: 104,
    hotel_name: "RomduL Riverview Boutique Retreat",
    room_number: 105,
    room_type: "Riverside Wooden Cottage",
    floor: 1,
    description:
      "Charming eco-luxurious wooden cottage along the Kampot riverbank. Enjoy fresh breeze, organic fruit basket upon arrival, and peaceful mountain vistas.",
    image: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    ],
    room_information: {
      price_per_night: 110,
      status: true,
      bed_type: "1 Queen Bed",
    },
    features: ["River Deck", "Mountain View", "Organic Breakfast", "Bicycle Rental", "Nature Trail Access"],
    max_guests: 2,
    size: "42 sqm / 452 sqft",
  },
];

export const MOCK_AMENITIES = [
  {
    icon: "fa-solid fa-water-ladder",
    title: "Infinity Sky Pools",
    description:
      "Overlooking panoramic city skylines, emerald rivers, and ocean horizons with private cabana service.",
  },
  {
    icon: "fa-solid fa-spa",
    title: "Royal Khmer Wellness Spa",
    description:
      "Ancient holistic herbal treatments, aromatherapy, and hot stone therapies curated by master therapists.",
  },
  {
    icon: "fa-solid fa-utensils",
    title: "Gourmet Fine Dining",
    description:
      "Sensational international and Royal Khmer fusion dishes created with farm-fresh organic ingredients.",
  },
  {
    icon: "fa-solid fa-bell-concierge",
    title: "24/7 Dedicated Butler",
    description:
      "Tailored itinerary planning, private dining reservations, and personalized room service around the clock.",
  },
  {
    icon: "fa-solid fa-car",
    title: "Airport VIP Transfer",
    description:
      "Chauffeured luxury limousine and private airport pick-up and drop-off with smooth express check-in.",
  },
  {
    icon: "fa-solid fa-martini-glass-citrus",
    title: "Sky Lounge & Cocktail Bar",
    description:
      "Artisanal cocktails, vintage wines, and live acoustic music overlooking stunning twilight views.",
  },
];

export const MOCK_OFFERS = [
  {
    id: "promo-1",
    tag: "Seasonal Special",
    discount: "25% OFF",
    code: "ROMDUL25",
    title: "Angkor Sunrise & Spa Retreat",
    subtitle: "Includes daily breakfast, 60-min couple spa & temple tour pass.",
    validUntil: "Expires in 7 days",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "promo-2",
    tag: "Romantic Getaway",
    discount: "Save $120",
    code: "HONEYMOONVIP",
    title: "Private Beach Villa Escape",
    subtitle: "Candlelight dinner on the beach, champagne & oceanfront suite.",
    validUntil: "Limited 10 Bookings",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "promo-3",
    tag: "Weekend Luxury",
    discount: "Free Upgrade",
    code: "WEEKENDPLUS",
    title: "Riverside Presidential Experience",
    subtitle: "Complimentary upgrade to Riverview Suite with VIP butler check-in.",
    validUntil: "Valid Friday - Sunday",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  },
];

export const MOCK_TESTIMONIALS = [
  {
    name: "Elena Rostova",
    role: "Travel Journalist, Luxury Escapes",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "RomduL Grand Palace is undoubtedly one of Southeast Asia's finest gems. The riverside views, attentive staff, and spa treatments exceeded all our expectations.",
    stayedAt: "Stayed at RomduL Grand Palace & Spa",
  },
  {
    name: "Alexander Hayes",
    role: "Architectural Designer, Singapore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "The architectural fusion of traditional Khmer heritage and modern luxury in Siem Reap is world-class. Waking up to lotus ponds was unforgettable.",
    stayedAt: "Stayed at RomduL Angkor Heritage Resort",
  },
  {
    name: "Sophie & Liam Miller",
    role: "Honeymoon Travelers, Australia",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "The private beachfront bungalow was heavenly! Candlelight dinner right on the sand with the sound of the ocean was the highlight of our honeymoon.",
    stayedAt: "Stayed at RomduL Serenity Beach Resort",
  },
];
