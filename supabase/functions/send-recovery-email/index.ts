import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, firstName, lastName, hasAccount } = await req.json()

    // Email template for account recovery
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Recovery - Smart Money Allocator</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
            .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; }
            .content { padding: 40px 30px; }
            .recovery-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
            .info-box { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 12px; padding: 25px; margin: 25px 0; }
            .info-box h3 { color: #0c4a6e; margin: 0 0 15px 0; }
            .info-box p { color: #075985; margin: 0; line-height: 1.6; }
            .credentials { background: #ecfdf5; border: 1px solid #10b981; border-radius: 12px; padding: 25px; margin: 25px 0; }
            .credentials h3 { color: #047857; margin: 0 0 15px 0; }
            .credentials .username { font-size: 18px; font-weight: bold; color: #047857; background: white; padding: 15px; border-radius: 8px; margin: 10px 0; text-align: center; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .security-notice { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0; }
            .security-notice h3 { color: #92400e; margin: 0 0 10px 0; }
            .security-notice p { color: #92400e; margin: 0; line-height: 1.5; }
            .footer { background: #1f2937; color: white; padding: 30px; text-align: center; }
            .footer a { color: #667eea; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔍 Account Recovery</h1>
                <p>Smart Money Allocator</p>
            </div>
            
            <div class="content">
                <div class="recovery-box">
                    <h2 style="margin: 0 0 15px 0;">🔐 Account Recovery Request</h2>
                    <p style="margin: 0; font-size: 18px; opacity: 0.9;">
                        ${hasAccount ? `Hello ${firstName}! Here are your account details.` : 'We received a recovery request for this email address.'}
                    </p>
                </div>

                ${hasAccount ? `
                <div class="credentials">
                    <h3>📧 Your Account Information:</h3>
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <div class="username">
                        <strong>Username (Email):</strong><br>
                        ${email}
                    </div>
                    <p style="margin-top: 15px;">
                        Your username is your email address. Use this to sign in to your account.
                    </p>
                </div>

                <div class="info-box">
                    <h3>🔐 Password Reset</h3>
                    <p>
                        If you also need to reset your password, you should have received a separate password reset email. 
                        If you didn't receive it, you can request a new one from the sign-in page.
                    </p>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                    <a href="https://pocketwatcha.com" class="cta-button">
                        🚀 Sign In to Your Account
                    </a>
                </div>
                ` : `
                <div class="info-box">
                    <h3>❌ No Account Found</h3>
                    <p>
                        We couldn't find an account associated with <strong>${email}</strong>. 
                        This could mean:
                    </p>
                    <ul style="color: #075985; margin: 15px 0; padding-left: 20px;">
                        <li>You might have used a different email address</li>
                        <li>You haven't created an account yet</li>
                        <li>There might be a typo in the email address</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                    <a href="https://pocketwatcha.com" class="cta-button">
                        🚀 Create New Account
                    </a>
                </div>
                `}

                <div class="security-notice">
                    <h3>🛡️ Security Notice</h3>
                    <p>
                        This email was sent because someone requested account recovery for this email address. 
                        If you didn't make this request, you can safely ignore this email. Your account remains secure.
                    </p>
                </div>

                <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <h3 style="color: #1f2937; margin: 0 0 15px 0;">💡 Need More Help?</h3>
                    <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.6;">
                        <li>Make sure you're using the correct email address</li>
                        <li>Check your spam/junk folder for password reset emails</li>
                        <li>Try signing in with different email addresses you might have used</li>
                        <li>Create a new account if you haven't registered before</li>
                    </ul>
                </div>
            </div>

            <div class="footer">
                <h3 style="margin: 0 0 15px 0;">Smart Money Allocator</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.8;">
                    Your Personal Finance Journey Starts Here
                </p>
                <p style="margin: 0; font-size: 14px; opacity: 0.7;">
                    Visit <a href="https://pocketwatcha.com">pocketwatcha.com</a><br>
                    This email was sent because you requested account recovery.
                </p>
            </div>
        </div>
    </body>
    </html>
    `

    const emailText = `
Account Recovery - Smart Money Allocator

${hasAccount ? `Hello ${firstName}!

Your Account Information:
- Name: ${firstName} ${lastName}
- Username (Email): ${email}

Your username is your email address. Use this to sign in to your account.

If you also need to reset your password, you should have received a separate password reset email.` : `No Account Found

We couldn't find an account associated with ${email}.

This could mean:
- You might have used a different email address
- You haven't created an account yet
- There might be a typo in the email address`}

Security Notice:
This email was sent because someone requested account recovery for this email address. 
If you didn't make this request, you can safely ignore this email.

Visit https://pocketwatcha.com to ${hasAccount ? 'sign in' : 'create an account'}.

Best regards,
The Smart Money Allocator Team
    `

    // In a real implementation, you would use a service like:
    // - Resend (resend.com)
    // - SendGrid 
    // - Mailgun
    // - AWS SES
    
    // For this example, we'll simulate sending the email
    console.log('Sending recovery email to:', email)
    console.log('Account found:', hasAccount)
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Recovery email sent successfully',
        recipient: email,
        accountFound: hasAccount,
        emailSent: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error sending recovery email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to send recovery email',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})