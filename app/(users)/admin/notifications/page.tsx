'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BellDot, CheckCheck, FileText, UserCheck, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

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

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admin/notifications?page=${page}&limit=20`);
      setNotifications(response.data.notifications);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      toast.error("Failed to load notifications.");
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage, fetchNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
    try {
      await axios.patch(`/api/admin/notifications/${notificationId}/read`);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const toastId = toast.loading("Marking all as read...");
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await axios.patch('/api/admin/notifications/read-all');
      toast.success("All notifications marked as read.", { id: toastId });
    } catch (error) {
      toast.error("Failed to mark all as read.", { id: toastId });
      console.error("Failed to mark all as read", error);
      fetchNotifications(currentPage);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LEAD_REJECTED_BY_PRO': return <FileText className="h-5 w-5 text-amber-600" />;
      case 'NEW_PROFESSIONAL_SIGNUP': return <UserCheck className="h-5 w-5 text-emerald-600" />;
      case 'NEW_LEAD_FOR_ASSIGNMENT': return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default: return <BellDot className="h-5 w-5 text-slate-600" />;
    }
  };

  const getRedirectLink = (notification: Notification): string => {
    switch (notification.type) {
      case 'LEAD_REJECTED_BY_PRO':
      case 'NEW_LEAD_FOR_ASSIGNMENT':
        return `/admin/lead-management?leadId=${notification.data?.leadId || ''}`;
      case 'NEW_PROFESSIONAL_SIGNUP':
        return `/admin/professionals?professionalId=${notification.data?.professionalId || ''}`;
      default:
        return '#'; 
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">All Notifications</h1>
        <button
          onClick={handleMarkAllAsRead}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <CheckCheck size={16} />
          Mark All as Read
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-slate-400" />
          <p className="mt-4 text-slate-500">Loading Notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-lg">
          <BellDot className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-700">No Notifications Yet</h3>
          <p className="mt-1 text-sm text-slate-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              href={getRedirectLink(notification)}
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              className={`block p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                notification.read
                  ? 'bg-white border-slate-200 hover:bg-slate-50'
                  : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800">{notification.message}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" title="Unread"></div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}