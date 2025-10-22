'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface NotificationSettingsData {
  notifyOnNewLead: boolean;
  notifyOnNewMessage: boolean;
  notifyOnPayment: boolean;
  notifyWeeklySummary: boolean;
}

const Toggle = ({ enabled, setEnabled, label, description, disabled }: { 
  enabled: boolean, 
  setEnabled: (value: boolean) => void, 
  label: string, 
  description: string,
  disabled?: boolean
}) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <h4 className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-800'}`}>{label}</h4>
      <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
    </div>
    <button 
      onClick={() => setEnabled(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'} disabled:bg-gray-200`}
    >
      <span 
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} 
      />
    </button>
  </div>
);

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get<NotificationSettingsData>('/api/professional/notifications/settings');
        setSettings(data);
      } catch (error) {
        toast.error("Could not load notification settings.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    const toastId = toast.loading("Saving settings...");
    try {
      await axios.patch('/api/professional/notifications/settings', settings);
      toast.success("Settings saved!", { id: toastId });
    } catch (error) {
      toast.error("Failed to save settings.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof NotificationSettingsData, value: boolean) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
      <div className="space-y-4 divide-y divide-gray-100">
        <Toggle 
          enabled={settings?.notifyOnNewLead ?? true}
          setEnabled={(value) => updateSetting('notifyOnNewLead', value)}
          label="New Leads" 
          description="Get notified about new job opportunities."
          disabled={!settings}
        />
        <Toggle 
          enabled={settings?.notifyOnNewMessage ?? true}
          setEnabled={(value) => updateSetting('notifyOnNewMessage', value)}
          label="New Messages" 
          description="Receive alerts when a customer sends you a message."
          disabled={!settings}
        />
        <Toggle 
          enabled={settings?.notifyOnPayment ?? true}
          setEnabled={(value) => updateSetting('notifyOnPayment', value)}
          label="Payment Confirmations" 
          description="Get notified when a payment is processed."
          disabled={!settings}
        />
        <Toggle 
          enabled={settings?.notifyWeeklySummary ?? false}
          setEnabled={(value) => updateSetting('notifyWeeklySummary', value)}
          label="Weekly Summary" 
          description="Receive a weekly email with performance stats."
          disabled={!settings}
        />
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving || !settings}
          className="cursor-pointer rounded-md bg-[#25252b] px-4 py-2 text-sm text-[#ffffff] transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Preferences
        </button>
      </div>
    </div>
  );
}