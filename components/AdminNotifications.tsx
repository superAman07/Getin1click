"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BellDot, X, Check, FileText, UserCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
  data?: {
    leadId?: string;
    professionalId?: string;
  };
}

export default function AdminNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user?.id) return;
      
      setLoading(true);
      try {
        const response = await axios.get('/api/admin/notifications');
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [session?.user?.id]);

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/api/admin/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LEAD_REJECTED_BY_PRO':
        return <FileText className="h-5 w-5 text-amber-600" />;
      case 'NEW_PROFESSIONAL_SIGNUP':
        return <UserCheck className="h-5 w-5 text-emerald-600" />;
      case 'NEW_LEAD_FOR_ASSIGNMENT':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <BellDot className="h-5 w-5 text-slate-600" />;
    }
  };

  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getRedirectLink = (notification: Notification) => {
    switch (notification.type) {
      case 'LEAD_REJECTED_BY_PRO':
      case 'NEW_LEAD_FOR_ASSIGNMENT':
        return `/admin/lead-management?leadId=${notification.data?.leadId}`;
      case 'NEW_PROFESSIONAL_SIGNUP':
        return `/admin/professionals?id=${notification.data?.professionalId}`;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
      >
        <BellDot className="w-6 h-6 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Admin Notifications</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="max-h-[480px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-500">
                <div className="animate-spin w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full mx-auto mb-2" />
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <BellDot className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-600">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const redirectLink = getRedirectLink(notification);
                const NotificationContent = (
                  <div className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notification.read ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{formatDate(notification.createdAt)}</p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="p-1 hover:bg-blue-50 rounded-md text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );

                return redirectLink ? (
                  <Link key={notification.id} href={redirectLink}>
                    {NotificationContent}
                  </Link>
                ) : (
                  <div key={notification.id}>{NotificationContent}</div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}