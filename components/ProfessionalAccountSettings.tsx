export default function AccountSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" className="w-full rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" className="w-full rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" className="w-full rounded-md border border-[#e5e7eb] bg-[#ffffff] px-3 py-2 text-sm text-[#0f172a] outline-none transition-colors duration-150 focus:border-[#2563eb]" />
          </div>
          <div className="pt-2">
            <button className="cursor-pointer rounded-md bg-[#25252b] px-4 py-2 text-sm text-[#ffffff] transition-all duration-150 hover:brightness-110 active:scale-[0.98]">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}