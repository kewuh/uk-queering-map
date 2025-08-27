import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BREVOKEY } from '$env/static/private';

// Use fetch directly instead of the SDK to avoid module issues
const BREVO_API_KEY = BREVOKEY || '';
const BREVO_CONTACTS_API_URL = 'https://api.brevo.com/v3/contacts';
const BREVO_SMTP_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, storyLocation } = await request.json();

    if (!email || !email.trim()) {
      return json({ error: 'Email is required' }, { status: 400 });
    }

    if (!BREVO_API_KEY) {
      console.error('BREVOKEY not configured');
      return json({ error: 'Brevo API not configured' }, { status: 500 });
    }

    const contactData = {
      email: email.trim(),
      attributes: {
        SOURCE: 'UK Queering Map',
        SIGNUP_DATE: new Date().toISOString(),
        ...(storyLocation && { STORY_LOCATION: storyLocation })
      }
    };

    // First, create the contact
    const contactResponse = await fetch(BREVO_CONTACTS_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(contactData)
    });

    if (!contactResponse.ok) {
      const errorData = await contactResponse.text();
      console.error('Brevo contact creation error:', contactResponse.status, errorData);
      return json({ error: 'Failed to create contact' }, { status: 500 });
    }

    const contactResult = await contactResponse.json();
    console.log('Brevo contact created successfully:', contactResult);

    // Then, send a welcome email
    const emailData = {
      sender: {
        name: 'Not A Stranger',
        email: 'david.william.norton2@gmail.com'
      },
      to: [
        {
          email: email.trim(),
          name: email.trim().split('@')[0] // Use part before @ as name
        }
      ],
      subject: 'Your story is on the map — invite a friend to add theirs',
      htmlContent: `
        <html>
          <head></head>
          <body>
            <p>Hi,</p>
            <p>Thank you for adding your story to Placemarked. Every fragment helps weave together a living archive of migrant experiences.</p>
            <p>Could you do one more thing?</p>
            <p>👉 Share this page with a friend who might want to add their own story: <a href="https://placemarked.notastranger.org/">https://placemarked.notastranger.org/</a></p>
            <p>The more voices on the map, the stronger our collective picture of how migration is lived: the challenges, the solidarities, and the everyday places that shape our journeys.</p>
            <p>Thank you for helping us grow this archive.</p>
            <p>In solidarity,<br>The Not A Stranger team</p>
          </body>
        </html>
      `,
      tags: ['welcome-email', 'placemarked']
    };

    const emailResponse = await fetch(BREVO_SMTP_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    if (emailResponse.ok) {
      const emailResult = await emailResponse.json();
      console.log('Welcome email sent successfully:', emailResult);
      return json({ 
        success: true, 
        contact: contactResult,
        email: emailResult,
        message: 'Contact created and welcome email sent'
      });
    } else {
      const emailErrorData = await emailResponse.text();
      console.error('Brevo email sending error:', emailResponse.status, emailErrorData);
      // Still return success for contact creation, but log email error
      return json({ 
        success: true, 
        contact: contactResult,
        emailError: 'Failed to send welcome email',
        message: 'Contact created but email failed'
      });
    }
  } catch (error) {
    console.error('Error in Brevo integration:', error);
    return json({ error: 'Failed to process request' }, { status: 500 });
  }
};
