import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BedDouble,
  CalendarDays,
  ChevronDown,
  CreditCard,
  Hotel,
  LayoutDashboard,
  ListChecks,
  Plus,
  Users,
  UserCog,
} from "lucide-react";
import logo from "../assets/images/RomduLLogo.png";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Hotel",
    icon: Hotel,
    children: [
      { to: "/hotels", label: "Manage Hotel", icon: ListChecks },
      { to: "/hotels/add", label: "Add Hotel", icon: Plus },
    ],
  },
  {
    label: "Room",
    icon: BedDouble,
    children: [
      { to: "/rooms", label: "Manage Room", icon: ListChecks },
      { to: "/rooms/add", label: "Add Room", icon: Plus },
    ],
  },
  {
    label: "Booking",
    icon: CalendarDays,
    children: [
      { to: "/bookings", label: "Manage Booking", icon: ListChecks },
      { to: "/bookings/add", label: "Add Booking", icon: Plus },
    ],
  },
  {
    label: "Payment",
    icon: CreditCard,
    children: [{ to: "/payments", label: "Manage Payment", icon: ListChecks },
      {to:"/payments/add",label: "Add Payments", icon: Plus}
    ],
  },
  {
    label: "User",
    icon: Users,
    children: [
      { to: "/users", label: "Manage User", icon: ListChecks },
      { to: "/users/add", label: "Add User", icon: Plus },
    ],
  },
  {
    label: "Staff",
    icon: UserCog,
    children: [
      { to: "/staff", label: "Manage Staff", icon: ListChecks },
      { to: "/staff/add", label: "Add Staff", icon: Plus },
    ],
  },
];

const linkClasses = ({ isActive }) =>
  `poppins group flex items-center gap-3 rounded-r-lg px-6 py-3 text-lg font-semibold transition-all duration-150 ${
    isActive
      ? "bg-[var(--bg-primary)] text-white border-l-8 border-green-800 shadow shadow-green-800/30"
      : "text-gray-500 border-l-8 border-transparent hover:text-[var(--bg-primary)] hover:border-green-800/40"
  }`;

const Sidebar = () => {
  const location = useLocation();
  const [openItem, setOpenItem] = useState(null);

  // Which parent (if any) owns the currently active route
  const activeParentLabel = navItems.find(
    (item) =>
      item.children &&
      item.children.some(
        (child) =>
          location.pathname === child.to ||
          location.pathname.startsWith(`${child.to}/`),
      ),
  )?.label;

  const toggleItem = (label) => {
    setOpenItem((prev) => (prev === label ? null : label));
  };

  return (
    <div className="w-[15%] min-w-[240px] bg-white m-1 shadow h-screen">
      <aside>
        {/* logo */}
        <div className="m-auto flex justify-center rounded-xl p-3">
          <img className="w-60" src={logo} alt="RomduL logo" />
        </div>

        <section className="mt-5 p-1">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              // Dashboard: plain link, no dropdown
              if (!item.children) {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={linkClasses}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              }

              const isOpen = openItem === item.label || activeParentLabel === item.label;
              const isParentActive = activeParentLabel === item.label;

              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => toggleItem(item.label)}
                    className={`poppins group flex w-full items-center gap-3 rounded-r-lg px-6 py-3 text-lg font-semibold transition-all duration-150 border-l-8 ${
                      isParentActive
                        ? "bg-[var(--bg-primary)] text-white border-green-800 shadow shadow-green-800/30"
                        : isOpen
                          ? "text-[var(--bg-primary)] border-green-800/40"
                          : "text-gray-500 border-transparent hover:text-[var(--bg-primary)] hover:border-green-800/40"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isOpen ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            `poppins flex items-center gap-2 rounded-r-lg py-2.5 pl-14 pr-6 text-sm font-medium transition-all duration-150 border-l-8 ${
                              isActive
                                ? "bg-[var(--bg-primary)]/10 text-[var(--bg-primary)] border-green-800"
                                : "text-gray-400 border-transparent hover:text-[var(--bg-primary)] hover:border-green-800/40"
                            }`
                          }
                        >
                          <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                          <span>{child.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </section>
      </aside>
    </div>
  );
};

export default Sidebar;
