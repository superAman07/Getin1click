"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BellDot, X, Check } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
  data?: any;
}

export default function ProfessionalNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();

  // Fetch notifications on mount and periodically
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user?.id) return;
      
      setLoading(true);
      try {
        const response = await axios.get('/api/professional/notifications');
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [session?.user?.id]);

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.put(`/api/professional/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Date().getTime() - date.getTime() < 86400000 
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString();
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    
    // Mark all as read when opening
    if (!isOpen && unreadCount > 0) {
      const markAllAsRead = async () => {
        try {
          await axios.put('/api/professional/notifications/read-all');
          setNotifications(notifications.map(n => ({ ...n, read: true })));
          setUnreadCount(0);
        } catch (error) {
          console.error("Failed to mark all notifications as read", error);
        }
      };
      markAllAsRead();
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={toggleOpen}
        className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all duration-200 relative"
      >
        <BellDot className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-slate-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-slate-500">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 border-b border-slate-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm text-slate-900">{notification.type}</span>
                    <span className="text-xs text-slate-500">{formatDate(notification.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{notification.message}</p>
                  
                  {notification.type === 'NEW_LEAD' && (
                    <div className="flex justify-end gap-2">
                      <Link
                        href="/professional/leads"
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        View Lead
                      </Link>
                    </div>
                  )}
                  
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      <Check className="w-3 h-3" /> Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 border-t border-slate-200 bg-slate-50">
              <Link 
                href="/professional/notifications"
                className="text-xs text-center block w-full text-blue-600 hover:underline py-1"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}