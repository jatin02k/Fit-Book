// lib/mail/templates/baseLayout.ts
export function baseLayout({ title, content }: { title: string; content: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; background-color: #f9fafb; padding: 24px; }
          .container { max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb; }
          h1 { font-size: 22px; color: #111827; margin: 0; }
          .footer { font-size: 12px; color: #9ca3af; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 style="margin-bottom: 16px;">FitBook</h1>
          <h2 style="color: #111827;">${title}</h2>
          <div>${content}</div>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p class="footer">This is an automated message from FitBook. Please do not reply.</p>
        </div>
      </body>
    </html>
  `;
}