"use client";

export default function TopBar({ userName = "Didik Kiswoyo", role = "Admin" }) {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
      {/* Search */}
      <div className="flex-grow max-w-xl">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></span>
          <input
            type="text"
            placeholder="TEMUKAN DISINI"
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm font-medium tracking-wide text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900 uppercase">{userName}</p>
          <p className="text-xs text-gray-500 uppercase">{role}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm overflow-hidden">
          {userName.charAt(0)}
        </div>
      </div>
    </header>
  );
}
