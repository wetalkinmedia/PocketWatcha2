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
    const { email, firstName, lastName } = await req.json()

    // Email template
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Smart Money Allocator!</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
            .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; }
            .content { padding: 40px 30px; }
            .welcome-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
            .feature { display: flex; align-items: flex-start; margin-bottom: 25px; }
            .feature-icon { font-size: 24px; margin-right: 15px; margin-top: 2px; }
            .feature-content h3 { margin: 0 0 8px 0; color: #1f2937; font-size: 18px; }
            .feature-content p { margin: 0; color: #6b7280; line-height: 1.5; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .stats { background: #f8fafc; padding: 25px; border-radius: 12px; margin: 30px 0; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; text-align: center; }
            .stat-item h4 { margin: 0; color: #667eea; font-size: 24px; font-weight: bold; }
            .stat-item p { margin: 5px 0 0 0; color: #6b7280; font-size: 14px; }
            .footer { background: #1f2937; color: white; padding: 30px; text-align: center; }
            .footer a { color: #667eea; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💰 Smart Money Allocator</h1>
                <p>Your Personal Finance Journey Starts Here!</p>
            </div>
            
            <div class="content">
                <div class="welcome-box">
                    <h2 style="margin: 0 0 15px 0;">🎉 Welcome ${firstName}!</h2>
                    <p style="margin: 0; font-size: 18px; opacity: 0.9;">
                        Thank you for joining thousands of users who are taking control of their financial future!
                    </p>
                </div>

                <h2 style="color: #1f2937; margin-bottom: 25px;">🚀 What You Can Do Now:</h2>
                
                <div class="feature">
                    <div class="feature-icon">🎯</div>
                    <div class="feature-content">
                        <h3>Get Your Personalized Money Plan</h3>
                        <p>Our AI-powered calculator creates custom budget allocations based on your age, location, and lifestyle. Get recommendations optimized for your specific situation!</p>
                    </div>
                </div>

                <div class="feature">
                    <div class="feature-icon">🌍</div>
                    <div class="feature-content">
                        <h3>Global Currency & City Support</h3>
                        <p>Choose from 12 major currencies and 60+ cities worldwide. Our system adjusts recommendations based on your local cost of living.</p>
                    </div>
                </div>

                <div class="feature">
                    <div class="feature-icon">📈</div>
                    <div class="feature-content">
                        <h3>Career Growth Suggestions</h3>
                        <p>Discover high-paying career opportunities in your area. Get personalized course recommendations to boost your income potential.</p>
                    </div>
                </div>

                <div class="feature">
                    <div class="feature-icon">🎓</div>
                    <div class="feature-content">
                        <h3>AI Learning Platform</h3>
                        <p>Access our comprehensive AI and Machine Learning courses. From beginner to advanced, with certificates and real-world projects.</p>
                    </div>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                    <a href="https://pocketwatcha.com" class="cta-button">
                        🚀 Start Your Financial Journey
                    </a>
                </div>

                <div class="stats">
                    <h3 style="text-align: center; margin-bottom: 25px; color: #1f2937;">📊 Join Our Growing Community</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <h4>500K+</h4>
                            <p>Active Users</p>
                        </div>
                        <div class="stat-item">
                            <h4>60+</h4>
                            <p>Global Cities</p>
                        </div>
                        <div class="stat-item">
                            <h4>12</h4>
                            <p>Currencies</p>
                        </div>
                        <div class="stat-item">
                            <h4>4.8★</h4>
                            <p>User Rating</p>
                        </div>
                    </div>
                </div>

                <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <h3 style="color: #92400e; margin: 0 0 10px 0;">💡 Pro Tips for Success:</h3>
                    <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                        <li>Start with our calculator to understand your current financial position</li>
                        <li>Review career suggestions to identify income growth opportunities</li>
                        <li>Take advantage of free courses to build valuable skills</li>
                        <li>Update your profile regularly as your situation changes</li>
                    </ul>
                </div>

                <h3 style="color: #1f2937;">🎯 Quick Start Guide:</h3>
                <ol style="color: #6b7280; line-height: 1.8;">
                    <li><strong>Complete your profile</strong> - Add your income, age, and location details</li>
                    <li><strong>Run the calculator</strong> - Get your personalized money allocation plan</li>
                    <li><strong>Explore career paths</strong> - Discover high-paying opportunities in your field</li>
                    <li><strong>Start learning</strong> - Enroll in courses that match your career goals</li>
                    <li><strong>Track progress</strong> - Return regularly to update and optimize your plan</li>
                </ol>

                <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                    <h3 style="color: #047857; margin: 0 0 10px 0;">🎁 Special Welcome Bonus!</h3>
                    <p style="color: #047857; margin: 0;">
                        As a new member, you get <strong>free access</strong> to our AI Fundamentals course (normally $99). 
                        Start building your AI skills today!
                    </p>
                </div>
            </div>

            <div class="footer">
                <h3 style="margin: 0 0 15px 0;">Need Help Getting Started?</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.8;">
                    Our platform is designed to be intuitive, but if you have any questions, 
                    we're here to help you succeed on your financial journey.
                </p>
                <p style="margin: 0; font-size: 14px; opacity: 0.7;">
                    Visit <a href="https://pocketwatcha.com">pocketwatcha.com</a> to get started<br>
                    This email was sent because you created an account with Smart Money Allocator.
                </p>
            </div>
        </div>
    </body>
    </html>
    `

    const emailText = `
Welcome to Smart Money Allocator, ${firstName}!

Thank you for joining thousands of users who are taking control of their financial future!

🚀 What You Can Do Now:

🎯 Get Your Personalized Money Plan
Our AI-powered calculator creates custom budget allocations based on your age, location, and lifestyle.

🌍 Global Currency & City Support  
Choose from 12 major currencies and 60+ cities worldwide with cost of living adjustments.

📈 Career Growth Suggestions
Discover high-paying career opportunities and get personalized course recommendations.

🎓 AI Learning Platform
Access comprehensive AI and Machine Learning courses with certificates.

Quick Start Guide:
1. Complete your profile with income, age, and location details
2. Run the calculator to get your personalized money allocation plan  
3. Explore career paths and discover high-paying opportunities
4. Start learning with courses that match your career goals
5. Track progress and return regularly to optimize your plan

🎁 Special Welcome Bonus!
As a new member, you get free access to our AI Fundamentals course (normally $99).

Visit https://pocketwatcha.com to get started!

Best regards,
The Smart Money Allocator Team
    `

    // In a real implementation, you would use a service like:
    // - Resend (resend.com)
    // - SendGrid 
    // - Mailgun
    // - AWS SES
    
    // For this example, we'll simulate sending the email
    console.log('Sending welcome email to:', email)
    console.log('Email content prepared for:', firstName, lastName)
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Welcome email sent successfully',
        recipient: email,
        emailSent: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error sending welcome email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to send welcome email',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})