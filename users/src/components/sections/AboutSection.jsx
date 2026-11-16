import React from "react";
import { MOCK_TESTIMONIALS } from "../../data/mockData";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Story & Vision */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-4">
              <i className="fa-solid fa-feather text-emerald-600"></i>
              <span>Our Heritage & Story</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-[1.2]">
              Rooted in Cambodian Grace, Elevated by Royal Luxury
            </h2>

            <p className="mt-6 text-base text-slate-600 leading-relaxed">
              Named after Cambodia&apos;s revered national flower, <strong>RomduL Hotels & Resorts</strong> embodies the delicate fragrance, timeless elegance, and heartfelt hospitality that define the Kingdom of Wonder.
            </p>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              From our riverfront palace in Phnom Penh to the sanctuary temples of Angkor and private coastal islands, each property is an architectural tribute to Khmer artistry, modern sustainability, and world-class luxury standards.
            </p>

            {/* Core Values Checklist */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Authentic Heritage", desc: "Handcrafted teak woodwork & stone carvings" },
                { title: "Culinary Mastery", desc: "Organic farm-to-table & royal Khmer recipes" },
                { title: "Holistic Wellness", desc: "Ancient Ayurvedic & herbal spa rituals" },
                { title: "Eco-Conscious Stays", desc: "Plastic-free & renewable energy initiatives" },
              ].map((val, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{val.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Collage */}
          <div className="relative">
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                alt="Luxury Hotel Exterior"
                className="rounded-3xl object-cover h-64 sm:h-72 w-full shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
                alt="Resort Pool"
                className="rounded-3xl object-cover h-64 sm:h-72 w-full mt-8 shadow-lg"
              />
            </div>

            {/* Experience Card Overlay */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-slate-800 max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <i className="fa-solid fa-crown text-amber-400 text-2xl"></i>
                <div>
                  <span className="text-2xl font-extrabold font-serif">15+</span>
                  <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Global Luxury Awards
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Recognized as Southeast Asia&apos;s leading boutique luxury hotel group.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-24 pt-12 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="text-3xl sm:text-4xl font-serif font-extrabold text-emerald-700 block">
              4
            </span>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider mt-1 block">
              Luxury Destinations
            </span>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-serif font-extrabold text-emerald-700 block">
              98%
            </span>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider mt-1 block">
              Guest Satisfaction
            </span>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-serif font-extrabold text-emerald-700 block">
              50,000+
            </span>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider mt-1 block">
              Memorable Stays
            </span>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-serif font-extrabold text-emerald-700 block">
              24/7
            </span>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider mt-1 block">
              Personalized Butler Care
            </span>
          </div>
        </div>

        {/* Guest Reviews Section */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
              Guest Stories & Reviews
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Loved by Discerning Travelers Worldwide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_TESTIMONIALS.map((review, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">
                      {review.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 block">
                      {review.role}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 block">
                      {review.stayedAt}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
