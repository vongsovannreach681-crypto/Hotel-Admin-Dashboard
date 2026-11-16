import React from "react";
import { MOCK_AMENITIES } from "../../data/mockData";

const AmenitiesSection = () => {
  return (
    <section id="amenities" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3 border border-emerald-500/30">
            <i className="fa-solid fa-sparkles text-amber-400"></i>
            <span>Unmatched Hospitality</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Curated Resort Amenities & Privileges
          </h2>

          <p className="mt-3 text-base text-slate-300 font-light">
            Every moment at RomduL is crafted to delight your senses — from revitalizing Ayurvedic therapies to exquisite sunset fine dining.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_AMENITIES.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white/5 hover:bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-2xl mb-6 shadow-md shadow-emerald-900/40 group-hover:scale-110 transition-transform duration-300">
                <i className={item.icon}></i>
              </div>

              <h3 className="text-xl font-bold font-serif text-white group-hover:text-emerald-300 transition-colors">
                {item.title}
              </h3>

              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                <span>Experience Privilege</span>
                <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
