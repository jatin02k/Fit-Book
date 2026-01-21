
export function baseLayout({ 
  title, 
  content, 
  themeColor = "#1f2937", // Gray-800 default
  infoBoxColor = "#f9fafb", // Gray-50 default
  infoBoxBorderColor = "#e5e7eb" // Gray-200 default
}: { 
  title: string; 
  content: string; 
  themeColor?: string; 
  infoBoxColor?: string;
  infoBoxBorderColor?: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 40px 20px;
            -webkit-font-smoothing: antialiased;
            color: #374151;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          .header {
            background-color: ${themeColor};
            padding: 48px 32px 32px;
            text-align: center;
          }
          .logo-text {
            color: #ffffff;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.025em;
            margin: 0;
            text-transform: uppercase;
          }
          .content {
            padding: 40px 32px;
            background: #ffffff;
          }
          .title {
            color: #111827;
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 16px 0;
            letter-spacing: -0.025em;
            text-align: center;
          }
          .subtitle {
            font-size: 16px;
            color: #6b7280;
            margin: 0 0 32px 0;
            text-align: center;
            line-height: 1.5;
          }
          .footer {
            background-color: #f9fafb;
            padding: 32px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            font-size: 13px;
            color: #9ca3af;
            margin: 0;
            line-height: 1.5;
          }
          .info-box {
            background-color: ${infoBoxColor};
            border: 1px solid ${infoBoxBorderColor};
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(0,0,0,0.05);
          }
          .info-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .info-row:first-child {
            padding-top: 0;
          }
          .label {
            color: #4b5563; /* Gray-600 for good contrast on light bg */
            font-size: 14px;
            font-weight: 500;
          }
          .value {
            color: #111827; /* Gray-900 for sharp text */
            font-size: 14px;
            font-weight: 600;
          }
          .btn-container {
            text-align: center;
            margin-top: 32px;
          }
          .button {
            display: inline-block;
            background-color: ${themeColor};
            color: #ffffff;
            padding: 14px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: opacity 0.2s;
          }
          .button:hover {
            opacity: 0.9;
          }
          a {
            color: ${themeColor};
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo-text">Appointor</h1>
          </div>
          <div class="content">
            <h2 class="title">${title}</h2>
            ${content}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Appointor. All rights reserved.<br>
            The modern booking solution for your business.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}