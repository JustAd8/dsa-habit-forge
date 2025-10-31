import emailjs from '@emailjs/browser';

export class NotificationService {
  private static instance: NotificationService;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Initialize EmailJS with your service ID
    // Note: You'll need to add these to your environment variables
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '');
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  getNotificationPermission(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  async showBrowserNotification(
    title: string,
    body: string,
    problemUrl?: string,
    icon?: string
  ): Promise<void> {
    const permission = this.getNotificationPermission();

    if (permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    if (this.serviceWorkerRegistration) {
      // Use service worker for background notifications
      this.serviceWorkerRegistration.active?.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        body,
        icon: icon || '/favicon.ico',
        tag: 'dsa-alarm',
        data: { url: problemUrl }
      });
    } else {
      // Fallback to direct notification
      const notification = new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        tag: 'dsa-alarm',
        requireInteraction: true,
        data: { url: problemUrl }
      });

      notification.onclick = () => {
        if (problemUrl) {
          window.open(problemUrl, '_blank');
        }
        notification.close();
      };
    }
  }

  async sendEmailNotification(
    toEmail: string,
    problemTitle: string,
    problemUrl: string,
    scheduledTime: string
  ): Promise<void> {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    if (!serviceId || !templateId) {
      throw new Error('EmailJS configuration missing');
    }

    const templateParams = {
      to_email: toEmail,
      problem_title: problemTitle,
      problem_url: problemUrl,
      scheduled_time: scheduledTime,
      subject: `DSA Practice Reminder: ${problemTitle}`
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams);
      console.log('Email notification sent successfully');
    } catch (error) {
      console.error('Failed to send email notification:', error);
      throw error;
    }
  }

  async sendNotification(
    userEmail: string,
    problemTitle: string,
    problemUrl: string,
    scheduledTime: string,
    enableBrowserNotification: boolean = true,
    enableEmailNotification: boolean = true
  ): Promise<void> {
    const notifications = [];

    if (enableBrowserNotification) {
      try {
        await this.showBrowserNotification(
          'DSA Practice Time!',
          `Time to solve: ${problemTitle}`,
          problemUrl
        );
        console.log('Browser notification sent');
      } catch (error) {
        console.error('Browser notification failed:', error);
      }
    }

    if (enableEmailNotification && userEmail) {
      try {
        await this.sendEmailNotification(userEmail, problemTitle, problemUrl, scheduledTime);
        console.log('Email notification sent');
      } catch (error) {
        console.error('Email notification failed:', error);
      }
    }
  }
}

export const notificationService = NotificationService.getInstance();
