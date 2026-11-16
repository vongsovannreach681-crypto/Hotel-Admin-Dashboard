import React, { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "Phnom Penh",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        destination: "Phnom Penh",
        message: "",
      });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3 border border-emerald-500/30">
            <i className="fa-solid fa-headset text-amber-400"></i>
            <span>24/7 Royal Concierge</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Connect With Our Guest Relations Team
          </h2>

          <p className="mt-3 text-base text-slate-300 font-light">
            Whether arranging private helicopter transfers, custom dining itineraries, or corporate celebrations, our dedicated concierge is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left Column: Direct Hotel Branch Cards */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-2">
              Direct Hotel Locations
            </h3>

            {[
              {
                city: "Phnom Penh Riverside",
                hotel: "RomduL Grand Palace & Spa",
                phone: "+855 (0) 23 888 991",
                email: "grandpalace@romdulhotels.com",
                addr: "Preah Sisowath Quay, Phnom Penh",
              },
              {
                city: "Siem Reap Angkor",
                hotel: "RomduL Angkor Heritage Resort",
                phone: "+855 (0) 63 969 888",
                email: "angkor@romdulhotels.com",
                addr: "Charles de Gaulle Blvd, Siem Reap",
              },
              {
                city: "Sihanoukville Beachfront",
                hotel: "RomduL Serenity Beach Resort",
                phone: "+855 (0) 34 933 777",
                email: "beach@romdulhotels.com",
                addr: "Otres Beachfront Avenue",
              },
              {
                city: "Kampot River Valley",
                hotel: "RomduL Riverview Boutique Retreat",
                phone: "+855 (0) 33 932 444",
                email: "kampot@romdulhotels.com",
                addr: "Tuek Chhou Road, Kampot",
              },
            ].map((loc, idx) => (
              <div
                key={idx}
                className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl transition-colors"
              >
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                  {loc.city}
                </span>
                <h4 className="font-bold text-white text-sm mt-0.5">
                  {loc.hotel}
                </h4>
                <div className="mt-2 text-xs text-slate-300 space-y-1">
                  <p className="flex items-center gap-2">
                    <i className="fa-solid fa-phone text-emerald-400 text-[10px]"></i>
                    <span>{loc.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <i className="fa-solid fa-envelope text-emerald-400 text-[10px]"></i>
                    <span>{loc.email}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold font-serif text-white mb-2">
              Send an Inquiry or Special Request
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Fill out the form below and our general manager or concierge will respond within 2 hours.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-900/40 border border-emerald-500/50 rounded-2xl text-emerald-200">
                <i className="fa-solid fa-circle-check text-4xl text-emerald-400 mb-3 animate-bounce"></i>
                <h4 className="text-lg font-bold text-white">
                  Message Sent Successfully!
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Thank you for reaching out. Our concierge team will contact you shortly at {formData.email || "your email"}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lady Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-500 text-xs rounded-xl px-4 py-3 outline-none focus:border-emerald-400 focus:bg-white/15 transition-colors font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-500 text-xs rounded-xl px-4 py-3 outline-none focus:border-emerald-400 focus:bg-white/15 transition-colors font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +855 12 345 678"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-500 text-xs rounded-xl px-4 py-3 outline-none focus:border-emerald-400 focus:bg-white/15 transition-colors font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Target Destination / Hotel
                    </label>
                    <select
                      value={formData.destination}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          destination: e.target.value,
                        })
                      }
                      className="w-full bg-slate-800 border border-white/20 text-white text-xs rounded-xl px-4 py-3 outline-none focus:border-emerald-400 transition-colors font-medium cursor-pointer"
                    >
                      <option value="Phnom Penh">RomduL Grand Palace (Phnom Penh)</option>
                      <option value="Siem Reap">RomduL Angkor Heritage (Siem Reap)</option>
                      <option value="Sihanoukville">RomduL Serenity Beach (Sihanoukville)</option>
                      <option value="Kampot">RomduL Riverview Retreat (Kampot)</option>
                      <option value="General">General Inquiry / VIP Events</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Your Message or Special Inquiries *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your upcoming visit, room preferences, airport transfer timing, or event requirements..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-500 text-xs rounded-xl p-4 outline-none focus:border-emerald-400 focus:bg-white/15 transition-colors font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Submit Inquiry to Concierge</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
