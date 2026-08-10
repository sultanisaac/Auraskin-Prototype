const fs = require('fs');
const path = require('path');

// 1. Append to ecommerceEmailTemplates.ts
const ecommerceTemplatesPath = path.join(__dirname, 'src', 'lib', 'ecommerceEmailTemplates.ts');
let templatesContent = fs.readFileSync(ecommerceTemplatesPath, 'utf8');

const newTemplate = `

export function getAdminNewOrderEmailHtml(data: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  courierName: string;
  courierService: string;
  items: any[];
  customerAddress: string;
  customerCityZip: string;
  trackingNumber: string;
  biteshipOrderId: string;
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  const itemsHtml = data.items.map(item => \`
    <tr>
        <td style="padding-bottom: 8px; width: 65%;">\${item.name}</td>
        <td align="center" style="padding-bottom: 8px; width: 15%; font-weight: 500;">x\${item.quantity}</td>
        <td align="right" style="padding-bottom: 8px; width: 20%; font-weight: 500; color: #1F2937;">Rp \${formatPrice(item.price)}</td>
    </tr>
  \`).join('');

  return \`<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>New Order Paid & Processed - AuraSkin</title>

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
            .summary-table td { font-size: 14px !important; }
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
                                    Admin Notification System
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" bgcolor="#FAF8F4">
                                <img src="https://placehold.co/600x120/FAF8F4/0F4C5C?text=New+Order+Paid&font=playfair-display" width="600" alt="New Order Paid" style="display: block; width: 100%; max-width: 600px; height: auto; font-family: 'Playfair Display', serif; font-size: 24px; line-height: 120px; color: #0F4C5C; text-align: center;" />
                            </td>
                        </tr>

                        <tr>
                            <td class="fluid-pad" style="padding: 40px 50px; background-color: #FFFFFF;">
                                
                                <p class="body-font" style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #1F2937; font-weight: 500;">
                                    Hello Admin,
                                </p>
                                
                                <p class="body-font" style="margin: 0 0 30px 0; font-size: 15px; line-height: 24px; color: #4B5563;">
                                    A new order has been successfully paid and automatically processed by the system. Biteship has been notified to pick up the package.
                                </p>

                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 20px;">
                                    <tr>
                                        <td style="padding: 20px 25px;">
                                            <h3 class="brand-font" style="margin: 0 0 15px 0; font-size: 16px; color: #0F4C5C;">Order Details</h3>
                                            
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="body-font data-table" style="font-size: 14px; line-height: 24px; color: #1F2937;">
                                                <tr>
                                                    <td width="140" class="data-label" style="padding-bottom: 8px; color: #6B7280;"><strong>Order Number:</strong></td>
                                                    <td class="data-value" style="padding-bottom: 8px; font-weight: 600; color: #0F4C5C;">#\${data.orderNumber}</td>
                                                </tr>
                                                <tr>
                                                    <td width="140" class="data-label" style="padding-bottom: 8px; color: #6B7280;"><strong>Customer:</strong></td>
                                                    <td class="data-value" style="padding-bottom: 8px;">
                                                        <strong>\${data.customerName}</strong><br>
                                                        <a href="mailto:\${data.customerEmail}" style="color: #4B5563; text-decoration: none;">\${data.customerEmail}</a> | \${data.customerPhone}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="140" class="data-label" style="padding-bottom: 8px; color: #6B7280;"><strong>Total Value:</strong></td>
                                                    <td class="data-value" style="padding-bottom: 8px; font-weight: 500;">Rp \${formatPrice(data.total)}</td>
                                                </tr>
                                                <tr>
                                                    <td width="140" class="data-label" style="padding-bottom: 0; color: #6B7280;"><strong>Courier Requested:</strong></td>
                                                    <td class="data-value" style="padding-bottom: 0; font-weight: 500;">\${data.courierName} - \${data.courierService}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF8F4; border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 20px;">
                                    <tr>
                                        <td style="padding: 20px 25px;">
                                            <h3 class="brand-font" style="margin: 0 0 15px 0; font-size: 16px; color: #0F4C5C; border-bottom: 1px solid #D4B483; padding-bottom: 10px;">Items to Prepare</h3>
                                            
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="body-font summary-table" style="font-size: 14px; line-height: 24px; color: #4B5563;">
                                                \${itemsHtml}
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                    <tr>
                                        <td valign="top" style="padding-bottom: 20px;">
                                            
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 20px;">
                                                <tr>
                                                    <td style="padding: 20px 25px;">
                                                        <h3 class="brand-font" style="margin: 0 0 10px 0; font-size: 15px; color: #0F4C5C;">Shipping Destination</h3>
                                                        <p class="body-font" style="margin: 0; font-size: 14px; line-height: 22px; color: #4B5563;">
                                                            \${data.customerAddress}<br>
                                                            \${data.customerCityZip}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>

                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-left: 4px solid #22C55E; border-radius: 0 8px 8px 0;">
                                                <tr>
                                                    <td style="padding: 20px 25px;">
                                                        <h3 class="brand-font" style="margin: 0 0 10px 0; font-size: 15px; color: #166534;">Biteship Status</h3>
                                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" class="body-font" style="font-size: 14px; line-height: 22px; color: #15803D;">
                                                            <tr>
                                                                <td width="130" style="padding-bottom: 4px;"><strong>Tracking ID:</strong></td>
                                                                <td style="padding-bottom: 4px; font-weight: 600;">\${data.trackingNumber}</td>
                                                            </tr>
                                                            <tr>
                                                                <td width="130"><strong>Order ID:</strong></td>
                                                                <td>\${data.biteshipOrderId}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>

                                        </td>
                                    </tr>
                                </table>

                                <p class="body-font" style="margin: 0 0 25px 0; font-size: 15px; line-height: 24px; color: #4B5563;">
                                    Log in to your Admin Dashboard to view full details.
                                </p>
                                
                                <table border="0" cellpadding="0" cellspacing="0" class="button-wrapper" style="margin-bottom: 35px; width: 100%;">
                                    <tr>
                                        <td align="center">
                                            <a href="https://auraskin-prototype.vercel.app/admin/product" target="_blank" class="body-font button" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #FFFFFF; background-color: #0F4C5C; text-decoration: none; border: 1px solid #0F4C5C; border-radius: 6px;">
                                                Admin Dashboard
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>

                        <tr>
                            <td class="fluid-pad" style="padding: 30px 50px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB; text-align: center;">
                                <p class="body-font" style="margin: 0 0 10px 0; font-size: 12px; line-height: 18px; color: #6B7280;">
                                    This is an automated system notification. Please do not reply to this email.
                                </p>
                                <p class="body-font" style="margin: 0; font-size: 12px; line-height: 18px; color: #6B7280;">
                                    For system support, contact the <a href="mailto:support@auraskin.id" style="color: #0F4C5C; text-decoration: underline;">technical team</a>.
                                </p>
                                
                                <p class="body-font" style="margin: 20px 0 0 0; font-size: 11px; line-height: 16px; color: #9CA3AF;">
                                    © 2026 AuraSkin Jakarta. Admin Communication.<br>
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
  "import { getOrderCreatedEmailHtml, getPaymentConfirmedEmailHtml, getOrderShippedEmailHtml } from './ecommerceEmailTemplates';",
  "import { getOrderCreatedEmailHtml, getPaymentConfirmedEmailHtml, getOrderShippedEmailHtml, getAdminNewOrderEmailHtml } from './ecommerceEmailTemplates';"
);

const newEmailFunction = `

/**
 * Sends a notification email to the admin when a new e-commerce order is paid.
 */
export async function sendAdminNewOrderEmail(data: any) {
  try {
    const info = await transporter.sendMail({
      from: \`"AuraSkin System" <\${process.env.EMAIL_USER}>\`,
      to: 'business@asimetrilab.com',
      subject: \`🚨 NEW PAID ORDER: #\${data.orderNumber} - Rp \${new Intl.NumberFormat('id-ID').format(data.total)}\`,
      html: getAdminNewOrderEmailHtml(data),
    });
    console.log('Admin new order email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending admin new order email:', error);
    return { success: false, error };
  }
}
`;
fs.writeFileSync(emailPath, emailContent + newEmailFunction);

console.log('Added template 4');
