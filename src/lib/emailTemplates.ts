export function getConfirmedEmailHtml(patientName: string, treatment: string, date: string, time: string) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Your Appointment at AuraSkin is Confirmed</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

    <style>
        html, body {
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            background-color: #E5E7EB;
        }
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }
        .ExternalClass {
            width: 100%;
        }
        table, td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }
        table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
        }
        h1, h2, h3, .brand-font {
            font-family: 'Playfair Display', Georgia, serif !important;
        }
        p, a, li, td, .body-font {
            font-family: 'Inter', Arial, sans-serif !important;
        }
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: auto !important;
                border-radius: 0 !important;
            }
            .fluid-pad {
                padding: 20px !important;
            }
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
                            <td bgcolor="#0F4C5C" align="center" style="padding: 40px 20px; background-color: #0F4C5C;">
                                <h1 class="brand-font" style="margin: 0; color: #D4B483; font-size: 36px; font-weight: 700; letter-spacing: 1px;">
                                    <span style="font-size: 28px; vertical-align: middle; margin-right: 8px;">✨</span>AuraSkin
                                </h1>
                                <p class="body-font" style="margin: 8px 0 0 0; color: #E8DCCB; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 3px;">
                                    Natural Beauty. Expert Results.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" bgcolor="#FAF8F4">
                                <img src="https://placehold.co/600x120/FAF8F4/0F4C5C?text=Appointment+Confirmed&font=playfair-display" width="600" height="120" alt="Appointment Confirmed" style="display: block; width: 100%; max-width: 600px; height: auto; font-family: 'Playfair Display', serif; font-size: 24px; line-height: 120px; color: #0F4C5C; text-align: center;" />
                            </td>
                        </tr>

                        <tr>
                            <td class="fluid-pad" style="padding: 40px 50px; background-color: #FFFFFF;">
                                
                                <p class="body-font" style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #1F2937; font-weight: 500;">
                                    Hello ${patientName},
                                </p>
                                
                                <p class="body-font" style="margin: 0 0 30px 0; font-size: 16px; line-height: 26px; color: #4B5563;">
                                    We are thrilled to confirm your upcoming appointment at <strong style="color: #0F4C5C;">AuraSkin</strong>! We look forward to providing you with an exceptional and relaxing experience.
                                </p>

                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF8F4; border-left: 4px solid #D4B483; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                                    <tr>
                                        <td style="padding: 25px;">
                                            <h3 class="brand-font" style="margin: 0 0 15px 0; font-size: 18px; color: #0F4C5C;">Your Appointment Details</h3>
                                            
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="body-font" style="font-size: 15px; line-height: 24px; color: #1F2937;">
                                                <tr>
                                                    <td width="20" valign="top" style="color: #D4B483; padding-bottom: 8px;">•</td>
                                                    <td style="padding-bottom: 8px;"><strong>Treatment:</strong> ${treatment}</td>
                                                </tr>
                                                <tr>
                                                    <td width="20" valign="top" style="color: #D4B483; padding-bottom: 8px;">•</td>
                                                    <td style="padding-bottom: 8px;"><strong>Date:</strong> ${date}</td>
                                                </tr>
                                                <tr>
                                                    <td width="20" valign="top" style="color: #D4B483; padding-bottom: 0;">•</td>
                                                    <td style="padding-bottom: 0;"><strong>Time:</strong> ${time}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <p class="body-font" style="margin: 30px 0; font-size: 15px; line-height: 24px; color: #4B5563;">
                                    If you need to make any changes to your schedule, please kindly reply to this email at least <strong>24 hours in advance</strong>.
                                </p>

                                <p class="body-font" style="margin: 0; font-size: 16px; line-height: 24px; color: #1F2937;">
                                    See you soon!<br><br>
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
                                    For system support, contact the <a href="mailto:business@asimetrilab.com" style="color: #0F4C5C; text-decoration: underline;">technical team</a>.
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
</html>`;
}

export function getDeclinedEmailHtml(patientName: string, treatment: string, date: string, adminNote: string = "") {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Update Regarding Your Appointment Request at AuraSkin</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

    <style>
        html, body {
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            background-color: #E5E7EB;
        }
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }
        .ExternalClass {
            width: 100%;
        }
        table, td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }
        table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
        }
        h1, h2, h3, .brand-font {
            font-family: 'Playfair Display', Georgia, serif !important;
        }
        p, a, li, td, .body-font {
            font-family: 'Inter', Arial, sans-serif !important;
        }
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: auto !important;
                border-radius: 0 !important;
            }
            .fluid-pad {
                padding: 20px !important;
            }
            .button-wrapper {
                width: 100% !important;
            }
            .button {
                width: 100% !important;
                box-sizing: border-box;
            }
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
                            <td bgcolor="#0F4C5C" align="center" style="padding: 40px 20px; background-color: #0F4C5C;">
                                <h1 class="brand-font" style="margin: 0; color: #D4B483; font-size: 36px; font-weight: 700; letter-spacing: 1px;">
                                    <span style="font-size: 28px; vertical-align: middle; margin-right: 8px;">✨</span>AuraSkin
                                </h1>
                                <p class="body-font" style="margin: 8px 0 0 0; color: #E8DCCB; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 3px;">
                                    Natural Beauty. Expert Results.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" bgcolor="#FAF8F4">
                                <img src="https://placehold.co/600x120/FAF8F4/0F4C5C?text=Appointment+Update&font=playfair-display" width="600" height="120" alt="Appointment Update" style="display: block; width: 100%; max-width: 600px; height: auto; font-family: 'Playfair Display', serif; font-size: 24px; line-height: 120px; color: #0F4C5C; text-align: center;" />
                            </td>
                        </tr>

                        <tr>
                            <td class="fluid-pad" style="padding: 40px 50px; background-color: #FFFFFF;">
                                
                                <p class="body-font" style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #1F2937; font-weight: 500;">
                                    Hello ${patientName},
                                </p>
                                
                                <p class="body-font" style="margin: 0 0 20px 0; font-size: 16px; line-height: 26px; color: #4B5563;">
                                    Thank you so much for requesting an appointment with <strong style="color: #0F4C5C;">AuraSkin</strong> for the <strong>${treatment}</strong> on <strong>${date}</strong>.
                                </p>
                                
                                <p class="body-font" style="margin: 0 0 30px 0; font-size: 16px; line-height: 26px; color: #4B5563;">
                                    Unfortunately, we are unable to accommodate your request at this specific time.
                                </p>

                                ${adminNote ? `
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FEF2F2; border-left: 4px solid #EF4444; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <p class="body-font" style="margin: 0; font-size: 14px; line-height: 22px; color: #991B1B;">
                                                <strong>Admin Note:</strong> ${adminNote}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                ` : ''}

                                <p class="body-font" style="margin: 30px 0 25px 0; font-size: 16px; line-height: 26px; color: #4B5563;">
                                    We would love to find another time that works beautifully for your schedule. Please feel free to reply directly to this email, or visit our website to request an alternative time slot.
                                </p>
                                
                                <table border="0" cellpadding="0" cellspacing="0" class="button-wrapper" style="margin-bottom: 35px;">
                                    <tr>
                                        <td align="center" bgcolor="#0F4C5C" style="border-radius: 6px;">
                                            <a href="https://auraskin-prototype.vercel.app/" target="_blank" class="body-font button" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #FFFFFF; text-decoration: none; border: 1px solid #0F4C5C; border-radius: 6px;">
                                                Reschedule Appointment
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p class="body-font" style="margin: 0; font-size: 16px; line-height: 24px; color: #1F2937;">
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
                                    For system support, contact the <a href="mailto:business@asimetrilab.com" style="color: #0F4C5C; text-decoration: underline;">technical team</a>.
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
</html>`;
}

export function getCancelledEmailHtml(patientName: string, treatment: string, date: string, time: string, adminNote: string = "") {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Notice of Cancellation: Your Appointment at AuraSkin</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

    <style>
        html, body {
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            background-color: #E5E7EB;
        }
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }
        .ExternalClass {
            width: 100%;
        }
        table, td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }
        table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
        }
        h1, h2, h3, .brand-font {
            font-family: 'Playfair Display', Georgia, serif !important;
        }
        p, a, li, td, .body-font {
            font-family: 'Inter', Arial, sans-serif !important;
        }
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: auto !important;
                border-radius: 0 !important;
            }
            .fluid-pad {
                padding: 20px !important;
            }
            .button-wrapper {
                width: 100% !important;
            }
            .button {
                width: 100% !important;
                box-sizing: border-box;
            }
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
                            <td bgcolor="#0F4C5C" align="center" style="padding: 40px 20px; background-color: #0F4C5C;">
                                <h1 class="brand-font" style="margin: 0; color: #D4B483; font-size: 36px; font-weight: 700; letter-spacing: 1px;">
                                    <span style="font-size: 28px; vertical-align: middle; margin-right: 8px;">✨</span>AuraSkin
                                </h1>
                                <p class="body-font" style="margin: 8px 0 0 0; color: #E8DCCB; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 3px;">
                                    Natural Beauty. Expert Results.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" bgcolor="#FAF8F4">
                                <img src="https://placehold.co/600x120/FAF8F4/0F4C5C?text=Appointment+Cancelled&font=playfair-display" width="600" height="120" alt="Appointment Cancelled" style="display: block; width: 100%; max-width: 600px; height: auto; font-family: 'Playfair Display', serif; font-size: 24px; line-height: 120px; color: #0F4C5C; text-align: center;" />
                            </td>
                        </tr>

                        <tr>
                            <td class="fluid-pad" style="padding: 40px 50px; background-color: #FFFFFF;">
                                
                                <p class="body-font" style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #1F2937; font-weight: 500;">
                                    Hello ${patientName},
                                </p>
                                
                                <p class="body-font" style="margin: 0 0 30px 0; font-size: 16px; line-height: 26px; color: #4B5563;">
                                    This email is to officially notify you that your upcoming appointment for the <strong>${treatment}</strong> on <strong>${date}</strong> at <strong>${time}</strong> has been cancelled.
                                </p>

                                ${adminNote ? `
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FEF2F2; border-left: 4px solid #EF4444; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <p class="body-font" style="margin: 0; font-size: 14px; line-height: 22px; color: #991B1B;">
                                                <strong>Admin Note:</strong> ${adminNote}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                ` : ''}

                                <p class="body-font" style="margin: 30px 0 25px 0; font-size: 16px; line-height: 26px; color: #4B5563;">
                                    If you would like to reschedule for a future date, we would be more than happy to assist you.
                                </p>
                                
                                <table border="0" cellpadding="0" cellspacing="0" class="button-wrapper" style="margin-bottom: 35px;">
                                    <tr>
                                        <td align="center" bgcolor="#0F4C5C" style="border-radius: 6px;">
                                            <a href="https://auraskin-prototype.vercel.app/" target="_blank" class="body-font button" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #FFFFFF; text-decoration: none; border: 1px solid #0F4C5C; border-radius: 6px;">
                                                Reschedule Appointment
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p class="body-font" style="margin: 0; font-size: 16px; line-height: 24px; color: #1F2937;">
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
                                    For system support, contact the <a href="mailto:business@asimetrilab.com" style="color: #0F4C5C; text-decoration: underline;">technical team</a>.
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
</html>`;
}

export function getAdminNewRequestHtml(patientName: string, patientEmail: string, patientPhone: string, treatment: string, date: string, time: string) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>New Appointment Request - AuraSkin</title>

    <!-- Google Fonts: Playfair Display (Headings) and Inter (Body) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

    <style>
        /* Reset styles */
        html, body {
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            background-color: #E5E7EB; /* Canvas background for preview */
        }

        /* What it does: Stops email clients resizing small text. */
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        /* What it does: Forces Outlook.com to display emails full width. */
        .ExternalClass {
            width: 100%;
        }

        /* What it does: Stops Outlook from adding extra spacing to tables. */
        table, td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }

        /* What it does: Fixes webkit padding issue. */
        table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
        }

        /* Typography fallbacks for email clients that strip web fonts */
        h1, h2, h3, .brand-font {
            font-family: 'Playfair Display', Georgia, serif !important;
        }
        p, a, li, td, .body-font {
            font-family: 'Inter', Arial, sans-serif !important;
        }

        /* Responsive Styles */
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: auto !important;
                border-radius: 0 !important;
            }
            .fluid-pad {
                padding: 20px !important;
            }
            .button-wrapper {
                width: 100% !important;
            }
            .button {
                width: 100% !important;
                box-sizing: border-box;
            }
            .data-table td {
                display: block;
                width: 100%;
            }
            .data-label {
                padding-bottom: 2px !important;
            }
            .data-value {
                padding-bottom: 12px !important;
            }
        }
    </style>
</head>

<body width="100%" style="margin: 0; padding: 40px 0; background-color: #E5E7EB;">
    <center style="width: 100%; background-color: #E5E7EB;">
        <!-- Email Background Container (Brand: Warm Ivory) -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F4" style="max-width: 800px; padding: 40px 0; border-radius: 12px;">
            <tr>
                <td align="center" valign="top">
                    
                    <!-- Main Email Body (Brand: White Background for contrast) -->
                    <table width="600" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="email-container" style="width: 600px; max-width: 600px; margin: auto; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                        
                        <!-- HEADER -->
                        <tr>
                            <td bgcolor="#0F4C5C" align="center" style="padding: 40px 20px; background-color: #0F4C5C;">
                                <!-- Logo Text -->
                                <h1 class="brand-font" style="margin: 0; color: #D4B483; font-size: 36px; font-weight: 700; letter-spacing: 1px;">
                                    <span style="font-size: 28px; vertical-align: middle; margin-right: 8px;">✨</span>AuraSkin
                                </h1>
                                <!-- Tagline -->
                                <p class="body-font" style="margin: 8px 0 0 0; color: #E8DCCB; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 3px;">
                                    Admin Notification System
                                </p>
                            </td>
                        </tr>

                        <!-- BANNER IMAGE -->
                        <tr>
                            <td align="center" bgcolor="#FAF8F4">
                                <img src="https://placehold.co/600x120/FAF8F4/0F4C5C?text=New+Request&font=playfair-display" width="600" height="120" alt="New Appointment Request" style="display: block; width: 100%; max-width: 600px; height: auto; font-family: 'Playfair Display', serif; font-size: 24px; line-height: 120px; color: #0F4C5C; text-align: center;" />
                            </td>
                        </tr>

                        <!-- BODY CONTENT -->
                        <tr>
                            <td class="fluid-pad" style="padding: 40px 50px; background-color: #FFFFFF;">
                                
                                <p class="body-font" style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #1F2937; font-weight: 500;">
                                    Hello Aura Skin Admin,
                                </p>
                                
                                <p class="body-font" style="margin: 0 0 30px 0; font-size: 16px; line-height: 26px; color: #4B5563;">
                                    A new appointment request has just been submitted and is waiting for your review.
                                </p>

                                <!-- PATIENT DETAILS CARD -->
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 20px;">
                                    <tr>
                                        <td style="padding: 20px 25px;">
                                            <h3 class="brand-font" style="margin: 0 0 15px 0; font-size: 16px; color: #0F4C5C;">Patient Details</h3>
                                            
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="body-font data-table" style="font-size: 14px; line-height: 24px; color: #1F2937;">
                                                <tr>
                                                    <td width="100" class="data-label" style="padding-bottom: 8px; color: #6B7280;"><strong>Name:</strong></td>
                                                    <td class="data-value" style="padding-bottom: 8px; font-weight: 500;">${patientName}</td>
                                                </tr>
                                                <tr>
                                                    <td width="100" class="data-label" style="padding-bottom: 8px; color: #6B7280;"><strong>Email:</strong></td>
                                                    <td class="data-value" style="padding-bottom: 8px;"><a href="mailto:${patientEmail}" style="color: #0F4C5C; text-decoration: underline;">${patientEmail}</a></td>
                                                </tr>
                                                <tr>
                                                    <td width="100" class="data-label" style="padding-bottom: 0; color: #6B7280;"><strong>Phone:</strong></td>
                                                    <td class="data-value" style="padding-bottom: 0;">${patientPhone}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- APPOINTMENT DETAILS CARD -->
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF8F4; border-left: 4px solid #D4B483; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                                    <tr>
                                        <td style="padding: 20px 25px;">
                                            <h3 class="brand-font" style="margin: 0 0 15px 0; font-size: 16px; color: #0F4C5C;">Requested Appointment</h3>
                                            
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="body-font data-table" style="font-size: 14px; line-height: 24px; color: #1F2937;">
                                                <tr>
                                                    <td width="100" class="data-label" style="padding-bottom: 8px; color: #6B7280;"><strong>Treatment:</strong></td>
                                                    <td class="data-value" style="padding-bottom: 8px; font-weight: 500;">${treatment}</td>
                                                </tr>
                                                <tr>
                                                    <td width="100" class="data-label" style="padding-bottom: 8px; color: #6B7280;"><strong>Date:</strong></td>
                                                    <td class="data-value" style="padding-bottom: 8px;">${date}</td>
                                                </tr>
                                                <tr>
                                                    <td width="100" class="data-label" style="padding-bottom: 0; color: #6B7280;"><strong>Time:</strong></td>
                                                    <td class="data-value" style="padding-bottom: 0;">${time}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <p class="body-font" style="margin: 0 0 25px 0; font-size: 15px; line-height: 24px; color: #4B5563;">
                                    Please log in to the Admin Dashboard to confirm, decline, or suggest a new time for this request.
                                </p>
                                
                                <!-- CTA BUTTON -->
                                <table border="0" cellpadding="0" cellspacing="0" class="button-wrapper" style="margin-bottom: 35px;">
                                    <tr>
                                        <td align="center" bgcolor="#0F4C5C" style="border-radius: 6px;">
                                            <a href="https://admin-auraskin-prototype.vercel.app/" target="_blank" class="body-font button" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #FFFFFF; text-decoration: none; border: 1px solid #0F4C5C; border-radius: 6px;">
                                                Admin Dashboard
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p class="body-font" style="margin: 0; font-size: 16px; line-height: 24px; color: #1F2937;">
                                    Best,<br>
                                    <strong style="color: #0F4C5C; font-size: 18px; font-family: 'Playfair Display', serif;">AuraSkin Automated System</strong>
                                </p>
                            </td>
                        </tr>

                        <!-- FOOTER -->
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
                    <!-- End Main Email Body -->

                </td>
            </tr>
        </table>
    </center>
</body>
</html>`;
}

export function getClientRequestReceivedHtml(patientName: string, treatment: string, date: string, time: string) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Appointment Request Received - AuraSkin</title>

    <!-- Google Fonts: Playfair Display (Headings) and Inter (Body) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

    <style>
        /* Reset styles */
        html, body {
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            background-color: #E5E7EB; /* Canvas background for preview */
        }

        /* What it does: Stops email clients resizing small text. */
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        /* What it does: Forces Outlook.com to display emails full width. */
        .ExternalClass {
            width: 100%;
        }

        /* What it does: Stops Outlook from adding extra spacing to tables. */
        table, td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }

        /* What it does: Fixes webkit padding issue. */
        table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
        }

        /* Typography fallbacks for email clients that strip web fonts */
        h1, h2, h3, .brand-font {
            font-family: 'Playfair Display', Georgia, serif !important;
        }
        p, a, li, td, .body-font {
            font-family: 'Inter', Arial, sans-serif !important;
        }

        /* Responsive Styles */
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: auto !important;
                border-radius: 0 !important;
            }
            .fluid-pad {
                padding: 20px !important;
            }
            .button-wrapper {
                width: 100% !important;
            }
            .button {
                width: 100% !important;
                box-sizing: border-box;
            }
        }
    </style>
</head>

<body width="100%" style="margin: 0; padding: 40px 0; background-color: #E5E7EB;">
    <center style="width: 100%; background-color: #E5E7EB;">
        <!-- Email Background Container (Brand: Warm Ivory) -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FAF8F4" style="max-width: 800px; padding: 40px 0; border-radius: 12px;">
            <tr>
                <td align="center" valign="top">
                    
                    <!-- Main Email Body (Brand: White Background for contrast) -->
                    <table width="600" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="email-container" style="width: 600px; max-width: 600px; margin: auto; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                        
                        <!-- HEADER -->
                        <tr>
                            <td bgcolor="#0F4C5C" align="center" style="padding: 40px 20px; background-color: #0F4C5C;">
                                <!-- Logo Text -->
                                <h1 class="brand-font" style="margin: 0; color: #D4B483; font-size: 36px; font-weight: 700; letter-spacing: 1px;">
                                    <span style="font-size: 28px; vertical-align: middle; margin-right: 8px;">✨</span>AuraSkin
                                </h1>
                                <!-- Tagline -->
                                <p class="body-font" style="margin: 8px 0 0 0; color: #E8DCCB; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 3px;">
                                    Natural Beauty. Expert Results.
                                </p>
                            </td>
                        </tr>

                        <!-- BANNER IMAGE -->
                        <tr>
                            <td align="center" bgcolor="#FAF8F4">
                                <img src="https://placehold.co/600x120/FAF8F4/0F4C5C?text=Request+Received&font=playfair-display" width="600" height="120" alt="Request Received" style="display: block; width: 100%; max-width: 600px; height: auto; font-family: 'Playfair Display', serif; font-size: 24px; line-height: 120px; color: #0F4C5C; text-align: center;" />
                            </td>
                        </tr>

                        <!-- BODY CONTENT -->
                        <tr>
                            <td class="fluid-pad" style="padding: 40px 50px; background-color: #FFFFFF;">
                                
                                <p class="body-font" style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #1F2937; font-weight: 500;">
                                    Hi ${patientName},
                                </p>
                                
                                <p class="body-font" style="margin: 0 0 20px 0; font-size: 16px; line-height: 26px; color: #4B5563;">
                                    Thank you for choosing <strong style="color: #0F4C5C;">AuraSkin</strong>!
                                </p>

                                <p class="body-font" style="margin: 0 0 25px 0; font-size: 16px; line-height: 26px; color: #4B5563;">
                                    We have successfully received your appointment request. Here are the details you submitted:
                                </p>

                                <!-- APPOINTMENT DETAILS CARD -->
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #FAF8F4; border-left: 4px solid #D4B483; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                                    <tr>
                                        <td style="padding: 25px;">
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="body-font" style="font-size: 15px; line-height: 24px; color: #1F2937;">
                                                <tr>
                                                    <td width="20" valign="top" style="color: #D4B483; padding-bottom: 8px;">•</td>
                                                    <td style="padding-bottom: 8px;"><strong>Treatment:</strong> ${treatment}</td>
                                                </tr>
                                                <tr>
                                                    <td width="20" valign="top" style="color: #D4B483; padding-bottom: 8px;">•</td>
                                                    <td style="padding-bottom: 8px;"><strong>Date:</strong> ${date}</td>
                                                </tr>
                                                <tr>
                                                    <td width="20" valign="top" style="color: #D4B483; padding-bottom: 0;">•</td>
                                                    <td style="padding-bottom: 0;"><strong>Time:</strong> ${time}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <p class="body-font" style="margin: 0 0 20px 0; font-size: 15px; line-height: 24px; color: #4B5563;">
                                    Please note that our team is currently reviewing our schedule to ensure we can accommodate you perfectly. You will receive a separate Confirmation Email shortly once your appointment is finalized.
                                </p>

                                <p class="body-font" style="margin: 0 0 30px 0; font-size: 15px; line-height: 24px; color: #4B5563;">
                                    If you need to make any immediate changes or have questions, please feel free to reply directly to this email.
                                </p>

                                <p class="body-font" style="margin: 0 0 30px 0; font-size: 16px; line-height: 24px; color: #1F2937;">
                                    We look forward to treating you!
                                </p>
                                
                                <!-- CTA BUTTON -->
                                <table border="0" cellpadding="0" cellspacing="0" class="button-wrapper" style="margin-bottom: 35px;">
                                    <tr>
                                        <td align="center" bgcolor="#0F4C5C" style="border-radius: 6px;">
                                            <a href="https://auraskin-prototype.vercel.app/" target="_blank" class="body-font button" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #FFFFFF; text-decoration: none; border: 1px solid #0F4C5C; border-radius: 6px;">
                                                Visit AuraSkin
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p class="body-font" style="margin: 0; font-size: 16px; line-height: 24px; color: #1F2937;">
                                    Warmly,<br>
                                    <strong style="color: #0F4C5C; font-size: 18px; font-family: 'Playfair Display', serif;">The AuraSkin Team</strong>
                                </p>
                            </td>
                        </tr>

                        <!-- FOOTER -->
                        <tr>
                            <td class="fluid-pad" style="padding: 30px 50px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB; text-align: center;">
                                <p class="body-font" style="margin: 0 0 10px 0; font-size: 12px; line-height: 18px; color: #6B7280;">
                                    Please do not reply to this email.
                                </p>
                                <p class="body-font" style="margin: 0; font-size: 12px; line-height: 18px; color: #6B7280;">
                                    For system support, contact the <a href="mailto:support@auraskin.id" style="color: #0F4C5C; text-decoration: underline;">technical team</a>.
                                </p>
                                
                                <!-- Brand Address / Contact -->
                                <p class="body-font" style="margin: 20px 0 0 0; font-size: 11px; line-height: 16px; color: #9CA3AF;">
                                    © 2026 AuraSkin Jakarta. All rights reserved.<br>
                                    SCBD Tower 2, Jl. Jend. Sudirman, Jakarta Selatan 12190
                                </p>
                            </td>
                        </tr>

                    </table>
                    <!-- End Main Email Body -->

                </td>
            </tr>
        </table>
    </center>
</body>
</html>`;
}
