import { supabase } from "@/integrations/supabase/client";
import { notificationService } from "./notificationService";

export interface Alarm {
  id: string;
  user_id: string;
  problem_title: string;
  problem_url: string;
  problem_difficulty?: string;
  scheduled_time: string;
  recurrence: string[];
  is_active: boolean;
  last_triggered?: string;
  created_at?: string;
  updated_at?: string;
}

export class AlarmService {
  private static instance: AlarmService;
  private checkInterval: number | null = null;
  private readonly CHECK_INTERVAL = 60000; // Check every minute

  private constructor() {}

  static getInstance(): AlarmService {
    if (!AlarmService.instance) {
      AlarmService.instance = new AlarmService();
    }
    return AlarmService.instance;
  }

  startAlarmChecking(): void {
    if (this.checkInterval) {
      return; // Already running
    }

    console.log('Starting alarm checking service...');
    this.checkInterval = window.setInterval(() => {
      this.checkAlarms();
    }, this.CHECK_INTERVAL);

    // Initial check
    this.checkAlarms();
  }

  stopAlarmChecking(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('Stopped alarm checking service');
    }
  }

  private async checkAlarms(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return; // User not logged in
      }

      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      const currentDay = now.toLocaleLowerCase('en-US', { weekday: 'long' });

      // Get active alarms for the current user
      const { data: alarms, error } = await supabase
        .from('alarms')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching alarms:', error);
        return;
      }

      if (!alarms || alarms.length === 0) {
        return;
      }

      // Get user profile for email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', session.user.id)
        .single();

      const userEmail = profile?.email || session.user.email;

      for (const alarm of alarms) {
        if (this.shouldTriggerAlarm(alarm, currentTime, currentDay)) {
          await this.triggerAlarm(alarm, userEmail);
        }
      }
    } catch (error) {
      console.error('Error checking alarms:', error);
    }
  }

  private shouldTriggerAlarm(alarm: Alarm, currentTime: string, currentDay: string): boolean {
    // Check if the scheduled time matches
    if (alarm.scheduled_time !== currentTime) {
      return false;
    }

    // Check if today is in the recurrence
    if (!alarm.recurrence || !alarm.recurrence.includes(currentDay)) {
      return false;
    }

    // Check if already triggered today (to prevent multiple triggers)
    if (alarm.last_triggered) {
      const lastTriggered = new Date(alarm.last_triggered);
      const today = new Date();

      // If triggered today, don't trigger again
      if (
        lastTriggered.getDate() === today.getDate() &&
        lastTriggered.getMonth() === today.getMonth() &&
        lastTriggered.getFullYear() === today.getFullYear()
      ) {
        return false;
      }
    }

    return true;
  }

  private async triggerAlarm(alarm: Alarm, userEmail?: string): Promise<void> {
    try {
      console.log(`Triggering alarm: ${alarm.problem_title}`);

      // Send notifications
      await notificationService.sendNotification(
        userEmail || '',
        alarm.problem_title,
        alarm.problem_url,
        alarm.scheduled_time
      );

      // Update last_triggered timestamp
      const { error } = await supabase
        .from('alarms')
        .update({ last_triggered: new Date().toISOString() })
        .eq('id', alarm.id);

      if (error) {
        console.error('Error updating alarm last_triggered:', error);
      }

      console.log(`Alarm triggered successfully: ${alarm.problem_title}`);
    } catch (error) {
      console.error('Error triggering alarm:', error);
    }
  }

  // Method to manually trigger an alarm (for testing)
  async triggerAlarmManually(alarmId: string): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('User not authenticated');
      }

      const { data: alarm, error } = await supabase
        .from('alarms')
        .select('*')
        .eq('id', alarmId)
        .eq('user_id', session.user.id)
        .single();

      if (error || !alarm) {
        throw new Error('Alarm not found');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', session.user.id)
        .single();

      const userEmail = profile?.email || session.user.email;

      await this.triggerAlarm(alarm, userEmail);
    } catch (error) {
      console.error('Error manually triggering alarm:', error);
      throw error;
    }
  }
}

export const alarmService = AlarmService.getInstance();
