// Service Worker for handling background notifications
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, tag } = event.data;

    self.registration.showNotification(title, {
      body,
      icon,
      tag,
      requireInteraction: true,
      actions: [
        {
          action: 'open',
          title: 'Solve Problem'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    // Open the problem URL in a new window
    const problemUrl = event.notification.data?.url;
    if (problemUrl) {
      clients.openWindow(problemUrl);
    }
  }
});
