"use client";

export default function TopBar({ userName = "Didik Kiswoyo", role = "Admin" }) {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">

      {/* User Info */}
      <div className="flex items-center gap-3 shrink-0 ml-auto">
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
