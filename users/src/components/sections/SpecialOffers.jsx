import React, { useState } from "react";
import { MOCK_OFFERS } from "../../data/mockData";

const SpecialOffers = ({ onClaimOffer }) => {
  const [copiedCode, setCopiedCode] = useState("");

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 3000);
  };

  return (
    <section id="offers" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest mb-3 border border-amber-200">
            <i className="fa-solid fa-gift text-amber-600"></i>
            <span>Exclusive Packages</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Special Seasonal Offers & Getaways
          </h2>

          <p className="mt-3 text-base text-slate-600 font-light">
            Unlock exclusive rates, romantic honeymoon packages, and complimentary culinary upgrades when you book directly with RomduL.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              {/* Image banner */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <span className="absolute top-4 left-4 bg-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {offer.tag}
                </span>

                <span className="absolute bottom-3 right-4 text-white text-lg font-extrabold font-serif">
                  {offer.discount}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {offer.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {offer.subtitle}
                  </p>

                  <div className="mt-4 flex items-center justify-between bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Promo Code
                      </span>
                      <span className="font-mono font-bold text-emerald-700 text-xs tracking-wider">
                        {offer.code}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(offer.code)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <i className="fa-solid fa-check text-emerald-600"></i>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-regular fa-copy text-slate-400"></i>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <i className="fa-regular fa-clock text-amber-500"></i>
                    <span>{offer.validUntil}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onClaimOffer(offer)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    Claim Offer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
