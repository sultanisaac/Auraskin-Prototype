import nodemailer from 'nodemailer';
import { getConfirmedEmailHtml, getDeclinedEmailHtml, getCancelledEmailHtml, getAdminNewRequestHtml, getClientRequestReceivedHtml } from './emailTemplates';
import { format, parseISO } from 'date-fns';

// Create a reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function formatDisplayDate(dateStr: string) {
  try {
    // Attempt to format "2026-07-09" to "09 July 2026"
    return format(parseISO(dateStr), "dd MMMM yyyy");
  } catch (e) {
    return dateStr;
  }
}

/**
 * Sends an appointment confirmation email to the patient.
 */
export async function sendConfirmationEmail(toEmail: string, patientName: string, treatment: string, date: string, time: string) {
  try {
    const formattedDate = formatDisplayDate(date);
    const info = await transporter.sendMail({
      from: `"AuraSkin" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Your AuraSkin Appointment is Confirmed! ✨',
      html: getConfirmedEmailHtml(patientName, treatment, formattedDate, time),
    });
    console.log('Confirmation email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error };
  }
}

/**
 * Sends an appointment declined email to the patient (when a new request is rejected).
 */
export async function sendDeclinedEmail(toEmail: string, patientName: string, treatment: string, date: string, adminNote?: string) {
  try {
    const formattedDate = formatDisplayDate(date);
    const info = await transporter.sendMail({
      from: `"AuraSkin" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Action Required: Regarding your AuraSkin Appointment Request',
      html: getDeclinedEmailHtml(patientName, treatment, formattedDate, adminNote),
    });
    console.log('Declined email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending declined email:', error);
    return { success: false, error };
  }
}

/**
 * Sends an appointment cancelled email to the patient (when an existing appointment is cancelled).
 */
export async function sendCancelledEmail(toEmail: string, patientName: string, treatment: string, date: string, time: string, adminNote?: string) {
  try {
    const formattedDate = formatDisplayDate(date);
    const info = await transporter.sendMail({
      from: `"AuraSkin" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Update: Your AuraSkin Appointment has been Cancelled',
      html: getCancelledEmailHtml(patientName, treatment, formattedDate, time, adminNote),
    });
    console.log('Cancelled email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending cancelled email:', error);
    return { success: false, error };
  }
}

/**
 * Sends an internal notification email to the admin when a new request is made.
 */
export async function sendAdminNewRequestEmail(patientName: string, patientEmail: string, patientPhone: string, treatment: string, date: string, time: string) {
  try {
    const formattedDate = formatDisplayDate(date);
    const info = await transporter.sendMail({
      from: `"AuraSkin System" <${process.env.EMAIL_USER}>`,
      to: 'business@asimetrilab.com', // Internal business email
      subject: `Action Required: New AuraSkin Booking Request from ${patientName}`,
      html: getAdminNewRequestHtml(patientName, patientEmail, patientPhone, treatment, formattedDate, time),
    });
    console.log('Admin new request email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending admin new request email:', error);
    return { success: false, error };
  }
}

/**
 * Sends an acknowledgment email to the patient when they make a new request.
 */
export async function sendClientRequestReceivedEmail(toEmail: string, patientName: string, treatment: string, date: string, time: string) {
  try {
    const formattedDate = formatDisplayDate(date);
    const info = await transporter.sendMail({
      from: `"AuraSkin" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "We've Received Your Appointment Request ✨",
      html: getClientRequestReceivedHtml(patientName, treatment, formattedDate, time),
    });
    console.log('Client request received email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending client request received email:', error);
    return { success: false, error };
  }
}
