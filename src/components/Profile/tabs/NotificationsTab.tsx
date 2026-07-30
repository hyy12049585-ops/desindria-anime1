// components/Profile/tabs/NotificationsTab.tsx

import React from 'react';
import { useProfile } from "../../../contexts/ProfileContext";

const NotificationsTab: React.FC = () => {
  const { state, markNotificationRead, markAllNotificationsRead, computed } = useProfile();

  return (
    <div className="notifications-tab">
      <div className="tab-header">
        <h3>اعلان‌ها</h3>
        <div className="notifications-actions">
          {computed.unreadNotifications > 0 && (
            <>
              <span className="unread-badge">{computed.unreadNotifications} خوانده نشده</span>
              <button className="btn-mark-all" onClick={markAllNotificationsRead}>
                خواندن همه
              </button>
            </>
          )}
        </div>
      </div>

      {state.notifications.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔔</span>
          <p>اعلانی وجود ندارد</p>
        </div>
      ) : (
        <div className="notifications-list">
          {state.notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${notification.read ? 'read' : 'unread'}`}
              onClick={() => {
                if (!notification.read) markNotificationRead(notification.id);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !notification.read) {
                  markNotificationRead(notification.id);
                }
              }}
            >
              <div className="notification-icon">
                {notification.type === 'system' && '⚙️'}
                {notification.type === 'achievement' && '🏆'}
                {notification.type === 'recommendation' && '💡'}
                {notification.type === 'update' && '🔄'}
                {notification.type === 'social' && '👥'}
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.timestamp).toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {!notification.read && <div className="unread-dot" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsTab;
