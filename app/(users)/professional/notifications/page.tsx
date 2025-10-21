"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Bell, 
  MessageSquare, 
  Briefcase, 
  DollarSign,
  AlertCircle,
  Calendar,
  Check,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { FaTruckLoading } from "react-icons/fa";
import { format } from "date-fns";

type Notification = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
  relatedId?: string;
  relatedType?: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/professional/notifications");
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);
  
  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/api/professional/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };
  
  const filteredNotifications = activeTab === "all"
    ? notifications
    : activeTab === "unread"
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === activeTab);
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case "lead":
        return <Briefcase className="h-5 w-5 text-purple-600" />;
      case "payment":
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case "appointment":
        return <Calendar className="h-5 w-5 text-orange-600" />;
      case "system":
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case "message": return "bg-blue-50";
      case "lead": return "bg-purple-50";
      case "payment": return "bg-green-50";
      case "appointment": return "bg-orange-50";
      case "system": return "bg-gray-50";
      default: return "bg-gray-50";
    }
  };
  
  const getRelatedLink = (notification: Notification) => {
    if (!notification.relatedId || !notification.relatedType) return null;
    
    switch (notification.relatedType) {
      case "lead":
        return `/professional/leads/${notification.relatedId}`;
      case "job":
        return `/professional/jobs/${notification.relatedId}`;
      case "message":
        return `/professional/messages/${notification.relatedId}`;
      case "appointment":
        return `/professional/appointments/${notification.relatedId}`;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <FaTruckLoading size={48} />
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
      <div className="flex items-center mb-8">
        <Link href="/professional/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "unread"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setActiveTab("message")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "message"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab("lead")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "lead"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Leads
          </button>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === "all" 
              ? "You don't have any notifications yet." 
              : activeTab === "unread" 
                ? "You don't have any unread notifications." 
                : `You don't have any ${activeTab} notifications.`}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredNotifications.map((notification) => {
            const relatedLink = getRelatedLink(notification);
            const NotificationContent = (
              <div className="flex">
                <div className={`flex-shrink-0 mr-4 p-2 rounded-full ${getNotificationBgColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow">
                  <p className={`text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(notification.createdAt), "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      markAsRead(notification.id);
                    }}
                    className="ml-4 text-blue-600 hover:text-blue-800"
                    title="Mark as read"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                )}
              </div>
            );
            
            return (
              <div key={notification.id} className={`py-6 ${!notification.read ? 'bg-blue-50' : ''}`}>
                {relatedLink ? (
                  <Link 
                    href={relatedLink}
                    className="block hover:bg-gray-50 -mx-4 px-4 py-3 transition-colors duration-150 rounded-lg"
                  >
                    {NotificationContent}
                  </Link>
                ) : (
                  <div className="px-4 py-3">
                    {NotificationContent}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}