const fs = require('fs');
const path = require('path');

// 1. Append to ecommerceEmailTemplates.ts
const ecommerceTemplatesPath = path.join(__dirname, 'src', 'lib', 'ecommerceEmailTemplates.ts');
let templatesContent = fs.readFileSync(ecommerceTemplatesPath, 'utf8');

const newTemplate = `

export function getPaymentConfirmedEmailHtml(data: {
  customerName: string;
  orderNumber: string;
  items: any[];
  subtotal: number;
  shippingCost: number;
  courier: string;
  total: number;
  customerPhone: string;
  customerAddress: string;
  customerCityZip: string;
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  const itemsHtml = data.items.map(item => \`
    <tr>
        <td style="padding-bottom: 12px; width: 70%;">\${item.name} <span style="color: #9CA3AF; font-size: 13px;">x\${item.quantity}</span></td>
        <td align="right" style="padding-bottom: 12px; font-weight: 500; color: #1F2937;">Rp \${formatPrice(item.price * item.quantity)}</td>
    </tr>
  \`).join('');

  return \`<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Payment Received - AuraSkin</title>

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
                                    Natural Beauty. Expert Results.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" bgcolor="#FAF8F4">
                                <img src="https://placehold.co/600x120/FAF8F4/0F4C5C?text=Payment+Received&font=playfair-display" width="600" alt="Payment Received" style="display: block; width: 100%; max-width: 600px; height: auto; font-family: 'Playfair Display', serif; font-size: 24px; line-height: 120px; color: #0F4C5C; text-align: center;" />
                            </td>
                        </tr>

                        <tr>
                            <td class="fluid-pad" style="padding: 40px 50px; background-color: #FFFFFF;">
                                
                                <p class="body-font" style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #1F2937; font-weight: 500;">
                                    Hi \${data.customerName},
                                </p>
                                
                                <p class="body-font" style="margin: 0 0 20px 0; font-size: 16px; line-height: 26px; color: #4B5563;">
                                    Great news! We have successfully received your payment of <strong style="color: #0F4C5C;">Rp \${formatPrice(data.total)}</strong>.
                                </p>

                                <p class="body-font" style="margin: 0 0 30px 0; font-size: 16px; line-height: 26px; color: #4B5563;">
                                    Your order <strong style="color: #1F2937;">#\${data.orderNumber}</strong> is now confirmed and our team at the Luxury28 Warehouse in Bukittinggi is preparing it for shipment.
                                </p>

                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF8F4; border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 25px;">
                                    <tr>
                                        <td style="padding: 25px;">
                                            <h3 class="brand-font" style="margin: 0 0 20px 0; font-size: 18px; color: #0F4C5C; border-bottom: 1px solid #D4B483; padding-bottom: 10px;">Official Receipt</h3>
                                            
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="body-font summary-table" style="font-size: 15px; line-height: 24px; color: #4B5563;">
                                                
                                                \${itemsHtml}
                                                
                                                <tr>
                                                    <td colspan="2" style="padding-top: 10px; border-top: 1px dashed #D1D5DB;"></td>
                                                </tr>

                                                <tr>
                                                    <td style="padding-top: 10px; padding-bottom: 8px;">Subtotal</td>
                                                    <td align="right" style="padding-top: 10px; padding-bottom: 8px; font-weight: 500; color: #1F2937;">Rp \${formatPrice(data.subtotal)}</td>
                                                </tr>
                                                
                                                <tr>
                                                    <td style="padding-bottom: 15px;">Shipping <span style="color: #9CA3AF; font-size: 13px;">(via \${data.courier})</span></td>
                                                    <td align="right" style="padding-bottom: 15px; font-weight: 500; color: #1F2937;">Rp \${formatPrice(data.shippingCost)}</td>
                                                </tr>

                                                <tr>
                                                    <td style="padding-top: 15px; border-top: 1px solid #D1D5DB; font-weight: 600; color: #166534; font-size: 16px;">Total Paid</td>
                                                    <td align="right" style="padding-top: 15px; border-top: 1px solid #D1D5DB; font-weight: 700; color: #166534; font-size: 18px;">Rp \${formatPrice(data.total)}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 30px;">
                                    <tr>
                                        <td style="padding: 25px;">
                                            <h3 class="brand-font" style="margin: 0 0 15px 0; font-size: 16px; color: #0F4C5C;">Shipping Address</h3>
                                            
                                            <p class="body-font" style="margin: 0; font-size: 15px; line-height: 24px; color: #1F2937;">
                                                <strong>\${data.customerName}</strong><br>
                                                <span style="color: #6B7280; font-size: 14px;">\${data.customerPhone}</span><br>
                                                \${data.customerAddress}<br>
                                                \${data.customerCityZip}
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <p class="body-font" style="margin: 0 0 30px 0; font-size: 15px; line-height: 24px; color: #4B5563;">
                                    We will send you another update as soon as your package is handed over to the courier.
                                </p>

                                <p class="body-font" style="margin: 0; font-size: 16px; line-height: 24px; color: #1F2937;">
                                    Thank you for choosing <strong style="color: #0F4C5C;">AuraSkin</strong>! ✨<br><br>
                                    Warmly,<br>
                                    <strong style="color: #0F4C5C; font-size: 18px; font-family: 'Playfair Display', serif;">The AuraSkin Team</strong>
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
  "import { getOrderCreatedEmailHtml } from './ecommerceEmailTemplates';",
  "import { getOrderCreatedEmailHtml, getPaymentConfirmedEmailHtml } from './ecommerceEmailTemplates';"
);

const newEmailFunction = `

/**
 * Sends an email when a payment is officially confirmed by Xendit.
 */
export async function sendPaymentConfirmedEmail(toEmail: string, data: any) {
  try {
    const info = await transporter.sendMail({
      from: \`"AuraSkin" <\${process.env.EMAIL_USER}>\`,
      to: toEmail,
      subject: \`✅ Payment Confirmed — AuraSkin Order #\${data.orderNumber}\`,
      html: getPaymentConfirmedEmailHtml(data),
    });
    console.log('Payment confirmed email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending payment confirmed email:', error);
    return { success: false, error };
  }
}
`;
fs.writeFileSync(emailPath, emailContent + newEmailFunction);

console.log('Added template 2');
