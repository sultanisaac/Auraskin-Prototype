const fs = require('fs');
const path = require('path');

// 1. Append to ecommerceEmailTemplates.ts
const ecommerceTemplatesPath = path.join(__dirname, 'src', 'lib', 'ecommerceEmailTemplates.ts');
let templatesContent = fs.readFileSync(ecommerceTemplatesPath, 'utf8');

const newTemplate = `

export function getOrderShippedEmailHtml(data: {
  customerName: string;
  orderNumber: string;
  courierName: string;
  courierService: string;
  trackingNumber: string;
  trackingUrl: string;
}) {
  return \`<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Your Order Has Shipped - AuraSkin</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

    <style>
        html, body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; background-color: #E5E7EB; }
        * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
        .ExternalClass { width: 100%; }
        table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
        table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; }
        h1, h2, h3, .brand-font { font-family: 'Playfair Display', Georgia, serif !important; }
        p, a, li, td, .body-font { font-family: 'Inter', Arial, sans-serif !important; }
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: auto !important; border-radius: 0 !important; }
            .fluid-pad { padding: 20px !important; }
            .button-wrapper { width: 100% !important; }
            .button { width: 100% !important; box-sizing: border-box; }
            .data-table td { display: block; width: 100%; }
            .data-label { padding-bottom: 2px !important; }
            .data-value { padding-bottom: 12px !important; }
        }
    </style>
</head>

<body width="100%" style="margin: 0; padding: 40px 0; background-color: #E5E7EB;">
    <center style="width: 100%; background-color: #E5E7EB;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F4" style="max-width: 800px; padding: 40px 0; border-radius: 12px;">
            <tr>
                <td align="center" valign="top">
                    
                    <table width="600" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="email-container" style="width: 600px; max-width: 600px; margin: auto; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                        
                        <tr>
                            <td bgcolor="#0F4C5C" align="center" style="padding: 24px 20px; background-color: #0F4C5C;">
                                <h1 class="brand-font" style="margin: 0; color: #D4B483; font-size: 32px; font-weight: 700; letter-spacing: 1px;">
                                    <span style="font-size: 24px; vertical-align: middle; margin-right: 8px;">✨</span>AuraSkin
                                </h1>
                                <p class="body-font" style="margin: 6px 0 0 0; color: #E8DCCB; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 3px;">
                                    Natural Beauty. Expert Results.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" bgcolor="#FAF8F4">
                                <img src="https://placehold.co/600x120/FAF8F4/0F4C5C?text=Order+Shipped&font=playfair-display" width="600" alt="Order Shipped" style="display: block; width: 100%; max-width: 600px; height: auto; font-family: 'Playfair Display', serif; font-size: 24px; line-height: 120px; color: #0F4C5C; text-align: center;" />
                            </td>
                        </tr>

                        <tr>
                            <td class="fluid-pad" style="padding: 40px 50px; background-color: #FFFFFF;">
                                
                                <p class="body-font" style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #1F2937; font-weight: 500;">
                                    Hi \${data.customerName},
                                </p>
                                
                                <p class="body-font" style="margin: 0 0 20px 0; font-size: 16px; line-height: 26px; color: #4B5563;">
                                    Your glow-up is officially on the way! ✨
                                </p>

                                <p class="body-font" style="margin: 0 0 30px 0; font-size: 16px; line-height: 26px; color: #4B5563;">
                                    Your order <strong style="color: #1F2937;">#\${data.orderNumber}</strong> has been picked up by <strong>\${data.courierName}</strong> and is currently out for delivery.
                                </p>

                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF8F4; border-left: 4px solid #D4B483; border-radius: 0 8px 8px 0; margin-bottom: 40px;">
                                    <tr>
                                        <td style="padding: 20px 25px;">
                                            <h3 class="brand-font" style="margin: 0 0 15px 0; font-size: 16px; color: #0F4C5C;">Tracking Details</h3>
                                            
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="body-font data-table" style="font-size: 14px; line-height: 24px; color: #1F2937;">
                                                <tr>
                                                    <td width="130" class="data-label" style="padding-bottom: 8px; color: #6B7280;"><strong>Courier:</strong></td>
                                                    <td class="data-value" style="padding-bottom: 8px; font-weight: 500;">\${data.courierName} <span style="color: #9CA3AF; font-size: 13px;">(\${data.courierService})</span></td>
                                                </tr>
                                                <tr>
                                                    <td width="130" class="data-label" style="padding-bottom: 0; color: #6B7280;"><strong>Tracking Number:</strong></td>
                                                    <td class="data-value" style="padding-bottom: 0; font-weight: 600; color: #0F4C5C; font-size: 15px;">\${data.trackingNumber}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <p class="body-font" style="margin: 0 0 25px 0; font-size: 15px; line-height: 24px; color: #4B5563;">
                                    Estimated delivery is usually <strong>3-7 business days</strong> depending on your location.
                                </p>

                                <p class="body-font" style="margin: 0 0 30px 0; font-size: 15px; line-height: 24px; color: #4B5563;">
                                    If you have any questions or if there are any issues with your delivery, reply to this email and our team will be happy to assist you.
                                </p>

                                <table border="0" cellpadding="0" cellspacing="0" class="button-wrapper" style="margin-bottom: 40px; width: 100%;">
                                    <tr>
                                        <td align="center">
                                            <a href="\${data.trackingUrl}" target="_blank" class="body-font button" style="display: inline-block; padding: 12px 28px; font-size: 15px; font-weight: 600; color: #FFFFFF; background-color: #0F4C5C; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(15, 76, 92, 0.2);">
                                                Track My Package
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p class="body-font" style="margin: 0; font-size: 16px; line-height: 24px; color: #1F2937;">
                                    Enjoy your new skincare!<br>
                                    <strong style="color: #0F4C5C; font-size: 18px; font-family: 'Playfair Display', serif; padding-top: 5px; display: inline-block;">The AuraSkin Team</strong>
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td class="fluid-pad" style="padding: 30px 50px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB; text-align: center;">
                                <p class="body-font" style="margin: 0 0 10px 0; font-size: 12px; line-height: 18px; color: #6B7280;">
                                    Please do not reply to this email.
                                </p>
                                <p class="body-font" style="margin: 0; font-size: 12px; line-height: 18px; color: #6B7280;">
                                    For system support, contact the <a href="mailto:support@auraskin.id" style="color: #0F4C5C; text-decoration: underline;">technical team</a>.
                                </p>
                                
                                <p class="body-font" style="margin: 20px 0 0 0; font-size: 11px; line-height: 16px; color: #9CA3AF;">
                                    © 2026 AuraSkin Jakarta. All rights reserved.<br>
                                    SCBD Tower 2, Jl. Jend. Sudirman, Jakarta Selatan 12190
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>\`;
}`;

fs.writeFileSync(ecommerceTemplatesPath, templatesContent + newTemplate);

// 2. Add to email.ts
const emailPath = path.join(__dirname, 'src', 'lib', 'email.ts');
let emailContent = fs.readFileSync(emailPath, 'utf8');

emailContent = emailContent.replace(
  "import { getOrderCreatedEmailHtml, getPaymentConfirmedEmailHtml } from './ecommerceEmailTemplates';",
  "import { getOrderCreatedEmailHtml, getPaymentConfirmedEmailHtml, getOrderShippedEmailHtml } from './ecommerceEmailTemplates';"
);

const newEmailFunction = `

/**
 * Sends an email when an order is shipped.
 */
export async function sendOrderShippedEmail(toEmail: string, data: any) {
  try {
    const info = await transporter.sendMail({
      from: \`"AuraSkin" <\${process.env.EMAIL_USER}>\`,
      to: toEmail,
      subject: \`🚚 Your AuraSkin Order is on the way! (#\${data.orderNumber})\`,
      html: getOrderShippedEmailHtml(data),
    });
    console.log('Order shipped email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending order shipped email:', error);
    return { success: false, error };
  }
}
`;
fs.writeFileSync(emailPath, emailContent + newEmailFunction);

console.log('Added template 3');
