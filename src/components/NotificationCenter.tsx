import type React from "react"
import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { getNotifications, markNotificationAsRead } from "../api/notifications"

interface Notification {
  id: number
  message: string
  type: "info" | "warning" | "success"
  read: boolean
  createdAt: string
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await getNotifications()
        setNotifications(fetchedNotifications)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    fetchNotifications()
    // Set up a polling mechanism to check for new notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000)

    return () => clearInterval(intervalId)
  }, [])

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10">
          <div className="py-2">
            <div className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold">Notifications</div>
            {notifications.length === 0 ? (
              <div className="px-4 py-2 text-gray-500">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-2 hover:bg-gray-100 ${notification.read ? "opacity-50" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm ${notification.read ? "text-gray-500" : "text-gray-800"}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationCenter

