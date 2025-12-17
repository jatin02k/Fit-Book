import { sendEmail } from "@/lib/mail";
import { createClient } from "@/lib/supabase/client";

export async function GET(request: Request) {
  // Verify Secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = await createClient();
  
  // Window: 30 to 45 minutes from now
  const now = new Date();
  const startWindow = new Date(now.getTime() + 30 * 60000).toISOString();
  const endWindow = new Date(now.getTime() + 45 * 60000).toISOString();

  const { data: upcoming } = await supabase
    .from('appointments')
    .select('*, services(name)')
    .eq('status', 'confirmed')
    .eq('reminder_sent', false) // Don't double-send
    .gte('start_time', startWindow)
    .lte('start_time', endWindow);

  if (!upcoming || upcoming.length === 0) return new Response('No reminders');

  for (const appt of upcoming) {
    // IMPORTANT: Skip render() if your template returns a string from baseLayout
    // Passing a string into render() causes the "Raw HTML" error in Gmail


    await sendEmail({
      to: appt.email,
      subject: "🔔 Reminder: Your session starts in 30 mins!",
      html:  `
        <h1>See you soon, ${appt.customer_name}!</h1>
        <p>This is a friendly reminder that your <strong>${appt.services.name}</strong> starts in about 30 minutes.</p>
        <p><strong>Time:</strong> ${new Date(appt.start_time).toLocaleTimeString('en-IN')}</p>
      `// Ensure lib/mail.ts uses the 'html' field
    });

    await supabase.from('appointments').update({ reminder_sent: true }).eq('id', appt.id);
  }

  return new Response('Reminders Sent');
}