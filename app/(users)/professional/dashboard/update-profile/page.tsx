"use client"

import { useState } from "react"
import { User, Lock, Bell } from "lucide-react"
import ProfessionalUpdateProfile from "@/components/ProfessionalUpdateProfile"
import AccountSettings from "@/components/ProfessionalAccountSettings"
import NotificationSettings from "@/components/ProfessionalNotificationSettings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const TabButton = ({ tabName, label, icon: Icon }: { tabName: string, label: string, icon: React.ElementType }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
        activeTab === tabName
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfessionalUpdateProfile />
      case 'account':
        return <AccountSettings />
      case 'notifications':
        return <NotificationSettings />
      default:
        return null
    }
  }

  return (
    <main className="min-h-dvh bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#e5e7eb] bg-[#ffffff]/95 backdrop-blur supports-[backdrop-filter]:bg-[#ffffff]/75">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-balance text-lg font-semibold text-[#0f172a]">Settings</h1>
          </div>
          <a href="#" className="text-sm text-[#2563eb] underline-offset-4 hover:underline cursor-pointer">
            View public profile
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <nav className="flex flex-col gap-2">
              <TabButton tabName="profile" label="Your Profile" icon={User} />
              <TabButton tabName="account" label="Account & Security" icon={Lock} />
              <TabButton tabName="notifications" label="Notifications" icon={Bell} />
            </nav>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </main>
  )
}