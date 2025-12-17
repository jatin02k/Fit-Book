import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/mail";

export async function GET(request: Request) {
  // 1. Security Check (Only allow Cron to call this)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = await createClient();
  
  // 2. Define the "Reminder Window" (e.g., sessions starting in 30-45 mins)
  const now = new Date();
  const windowStart = new Date(now.getTime() + 30 * 60000).toISOString();
  const windowEnd = new Date(now.getTime() + 45 * 60000).toISOString();

  // 3. Fetch confirmed appointments in that window
  const { data: upcoming } = await supabase
    .from('appointments')
    .select('*, services(name)')
    .eq('status', 'confirmed')
    .eq('reminder_sent', false)
    .gte('start_time', windowStart)
    .lte('start_time', windowEnd);

  if (!upcoming || upcoming.length === 0) return new Response('No reminders needed');

  // 4. Send Emails
  for (const appt of upcoming) {
    const time = new Date(appt.start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    
    await sendEmail({
      to: appt.email,
      subject: `🔔 Reminder: Your session starts at ${time}`,
      html: `
        <h1>See you soon, ${appt.customer_name}!</h1>
        <p>This is a friendly reminder that your <strong>${appt.services.name}</strong> starts in about 30 minutes.</p>
        <p><strong>Time:</strong> ${time}</p>
      `
    });

    // 5. Update database so we don't send again
    await supabase.from('appointments').update({ reminder_sent: true, status: appt.status, payment_url: appt.payment_url }).eq('id', appt.id);
  }

  return new Response(`Sent ${upcoming.length} reminders`);
}