import { create } from "zustand";
import { Notification } from "@/types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setIsOpen: (isOpen: boolean) => void;
  updateUnreadCount: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isOpen: false,
  setNotifications: (notifications) => {
    set({ notifications });
    get().updateUnreadCount();
  },
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
    get().updateUnreadCount();
  },
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
    get().updateUnreadCount();
  },
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
    get().updateUnreadCount();
  },
  setIsOpen: (isOpen) => set({ isOpen }),
  updateUnreadCount: () => {
    const unread = get().notifications.filter((n) => !n.isRead).length;
    set({ unreadCount: unread });
  },
}));
