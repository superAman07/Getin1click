import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

// We will use a placeholder for the email sending function.
// You can replace this with your actual email service (e.g., Nodemailer, SendGrid, Resend).
async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  console.log(`--- PASSWORD RESET (SIMULATION) ---`);
  console.log(`Email sent to: ${email}`);
  console.log(`Reset Link: ${resetLink}`);
  console.log(`------------------------------------`);

  // **ACTION REQUIRED**: Replace this simulation with your email provider.
  // Example using a hypothetical email service:
  /*
  await emailService.send({
    from: 'noreply@getin1click.com',
    to: email,
    subject: 'Reset Your Password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
  */
  return Promise.resolve();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return a success message to prevent email enumeration attacks.
    if (!user) {
      return NextResponse.json({ message: 'If an account with this email exists, a reset link has been sent.' });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600 * 1000); // Token expires in 1 hour

    // Store the token in the database
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // Send the email (using our placeholder function)
    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ message: 'If an account with this email exists, a reset link has been sent.' });

  } catch (error) {
    console.error('FORGOT_PASSWORD_ERROR', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}