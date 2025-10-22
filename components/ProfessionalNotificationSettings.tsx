'use client'
import { useState } from 'react'

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [appNotifications, setAppNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  const Toggle = ({ enabled, setEnabled, label, description }: { 
    enabled: boolean, 
    setEnabled: (value: boolean) => void, 
    label: string, 
    description: string 
  }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <h4 className="font-medium text-gray-800">{label}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button 
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
      >
        <span 
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} 
        />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
      <div className="space-y-4 divide-y divide-gray-100">
        <Toggle 
          enabled={emailNotifications}
          setEnabled={setEmailNotifications}
          label="New Leads" 
          description="Get notified about new job opportunities in your area."
        />
        <Toggle 
          enabled={smsNotifications}
          setEnabled={setSmsNotifications}
          label="New Messages" 
          description="Receive alerts when a customer sends you a message."
        />
        <Toggle 
          enabled={appNotifications}
          setEnabled={setAppNotifications}
          label="Payment Confirmations" 
          description="Get notified when a payment is successfully processed."
        />
        <Toggle 
          enabled={marketingEmails}
          setEnabled={setMarketingEmails}
          label="Weekly Summary" 
          description="Receive a weekly email with your performance stats."
        />
      </div>
    </div>
  )
}