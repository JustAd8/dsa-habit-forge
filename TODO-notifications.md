# TODO: Add Browser and Email Notifications for Alarms

## Steps to Complete
- [x] Install notification dependencies (EmailJS for email notifications)
- [x] Create service worker for browser notifications
- [x] Create notification service for managing permissions and sending notifications
- [x] Create alarm checking service that runs periodically
- [x] Add email notification functionality
- [x] Update alarm triggering logic to send notifications
- [x] Add notification settings to user profile
- [x] Test notification functionality

## Notes
- Browser notifications will use the Notification API
- Email notifications will use EmailJS service
- Alarm checking will run in the background using setInterval or similar
- Need to handle notification permissions properly
- Should respect user's notification preferences
- Test button added to alarm cards for manual testing
