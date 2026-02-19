import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("content-type") !== "application/json") {
    return new Response(
      JSON.stringify({ error: "Invalid content type" }),
      { status: 400 }
    );
  }

  try {
    const data = await request.json();
    const { name, email, title, category, content, bio, socialLinks, agreement } = data;

    // Validate required fields
    if (!name || !email || !title || !category || !content || !agreement) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400 }
      );
    }

    // Get Resend API key from environment variables
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500 }
      );
    }

    // Handle file upload if present
    let attachmentInfo = '';
    const contentType = request.headers.get("content-type");
    
    if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file-upload") as File;
      
      if (file) {
        // Convert file to base64 for email attachment
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = file.type || 'application/octet-stream';
        
        attachmentInfo = `
          {
            "filename": "${file.name}",
            "content": "${base64}",
            "type": "${mimeType}"
          }
        `;
      }
    }

    // Send notification email to admin
    const adminEmail = {
      from: 'noreply@miawoezɔ.com',
      to: ['admin@miawoezɔ.com'],
      subject: `New Guest Post Submission: ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
            New Guest Post Submission
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Submission Details:</h3>
            
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Title:</strong> ${title}</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h4 style="color: #333; margin-top: 0;">Story Content:</h4>
              <div style="color: #666; line-height: 1.6; white-space: pre-wrap;">${content}</div>
            </div>
            
            ${bio ? `
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h4 style="color: #333; margin-top: 0;">Author Bio:</h4>
              <div style="color: #666;">${bio}</div>
            </div>
            ` : ''}
            
            ${socialLinks ? `
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h4 style="color: #333; margin-top: 0;">Social Links:</h4>
              <div style="color: #666;">${socialLinks}</div>
            </div>
            ` : ''}
            
            ${attachmentInfo ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h4 style="color: #333; margin-top: 0;">📎 File Attachment:</h4>
              <p style="color: #666; font-size: 14px;">
                <strong>${attachmentInfo.includes('filename') ? JSON.parse(attachmentInfo).filename : 'Unknown file'}</strong>
              </p>
            </div>
            ` : ''}
            
            <p style="color: #888; font-size: 12px; margin-top: 20px;">
              <em>Submitted on: ${new Date().toLocaleString()}</em>
            </p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p style="color: #666; margin: 0;">
              This submission was made through the guest post form on Mia woezɔ blog.
            </p>
          </div>
        </div>
      `,
      attachments: attachmentInfo ? [JSON.parse(attachmentInfo)] : []
    };

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminEmail)
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      return new Response(
        JSON.stringify({ error: "Failed to send notification", details: errorData }),
        { status: 500 }
      );
    }

    // Send confirmation email to submitter
    const confirmationEmail = {
      from: 'noreply@miawoezɔ.com',
      to: [email],
      subject: 'Thank you for your story submission!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Thank You!</h2>
          
          <div style="background: #f0f8ff; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #333; margin-top: 0;">Your Story Has Been Received</h3>
            <p style="color: #666; line-height: 1.6;">
              Thank you for submitting your story "<strong>${title}</strong>" to Mia woezɔ! 
              We appreciate your contribution and will review it carefully.
            </p>
            ${attachmentInfo ? `
            <p style="color: #666; line-height: 1.6;">
              <strong>📎 File uploaded:</strong> ${JSON.parse(attachmentInfo).filename}
            </p>
            ` : ''}
            <p style="color: #666; line-height: 1.6;">
              <strong>What happens next:</strong><br>
              • We'll review your submission within 3-5 days<br>
              • You'll receive an email about our decision<br>
              • If accepted, we'll work with you on publishing<br>
              • We reserve the right to edit for clarity and length
            </p>
            <p style="color: #888; font-size: 12px; margin-top: 20px;">
              <em>We look forward to reading your story!</em>
            </p>
          </div>
        </div>
      `
    };

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(confirmationEmail)
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Submission received successfully! Check your email for confirmation." 
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
