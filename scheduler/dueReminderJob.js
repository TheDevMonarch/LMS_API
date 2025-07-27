// /cronJobs/dueReminderJob.js
import cron from 'node-cron';
import { sendDueDateReminders } from './sendDueDateReminders.js'; // adjust path if needed

// Run every day at 9:30 AM IST
cron.schedule('30 09 * * *', async () => {
  console.log('⏰ Running daily due-date reminder job at 9:30 AM');
  await sendDueDateReminders();
});
