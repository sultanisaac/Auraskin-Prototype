import { NextResponse } from 'next/server';
import { sendAdminNewRequestEmail, sendClientRequestReceivedEmail } from '@/lib/email';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientName, patientEmail, patientPhone, treatment, date, time } = body;

    // Basic validation
    if (!patientName || !patientEmail || !treatment || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Send emails in parallel
    const [adminResult, clientResult] = await Promise.all([
      sendAdminNewRequestEmail(patientName, patientEmail, patientPhone || '-', treatment, date, time),
      sendClientRequestReceivedEmail(patientEmail, patientName, treatment, date, time)
    ]);

    if (!adminResult.success || !clientResult.success) {
      console.error('Email sending failed', { adminResult, clientResult });
      return NextResponse.json(
        { success: false, error: 'Failed to send some emails' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Notify API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
