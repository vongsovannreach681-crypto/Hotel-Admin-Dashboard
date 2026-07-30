const Header = () => {
  return (
    <header className="bg-[var(--bg-primary)] p-5 px-10 flex justify-between">
      <div className="flex items-center gap-2">
        {/* Menu toggle */}
        <button
          type="button"
          className="bg-white/50 backdrop-blur-sm p-2.5 rounded-lg shadow-sm cursor-pointer transition-all duration-150 hover:bg-white/80 hover:shadow-md active:scale-95"
        >
          <i className="fa-solid fa-bars text-green-700 text-xl"></i>
        </button>

        {/* Search */}
        <div className="relative font-poppins w-[400px]">
          <div className="relative w-full font-sans">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-green-800 text-sm"></i>
            <input
              type="search"
              placeholder="Search something here......."
              className="w-full poppins bg-white/60 backdrop-blur-sm rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none border border-transparent shadow-sm transition-all duration-200 placeholder:text-green-900 focus:bg-white focus:border-green-700/40 focus:shadow-md focus:ring-2 focus:ring-green-700/10"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
         <button
          type="button"
          className="bg-white/50 backdrop-blur-sm p-2.5 rounded-lg shadow-sm cursor-pointer transition-all duration-150 hover:bg-white/80 hover:shadow-md active:scale-95"
        >
          <i className="fa-solid fa-moon text-green-700 text-xl"></i>
           <span className="poppins text-green-900">
            Dark Mode
          </span>
        </button>
         <button
          type="button"
          className="bg-white/50 backdrop-blur-sm p-2.5 rounded-lg shadow-sm cursor-pointer transition-all duration-150 hover:bg-white/80 hover:shadow-md active:scale-95"
        >
          <i className="fa-solid fa-bell text-green-700 text-xl"></i>
          <span className="poppins text-green-900">
            Notification
          </span>
        </button>
    
      </div>
    </header>
  );
};

export default Header;
