import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as SibApiV3Sdk from '@getbrevo/brevo';

// Configure API key authorization
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY || '';

const contactsApi = new SibApiV3Sdk.ContactsApi();

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, storyLocation } = await request.json();

    if (!email || !email.trim()) {
      return json({ error: 'Email is required' }, { status: 400 });
    }

    const createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = email.trim();
    createContact.attributes = {
      SOURCE: 'UK Queering Map',
      SIGNUP_DATE: new Date().toISOString(),
      ...(storyLocation && { STORY_LOCATION: storyLocation })
    };

    const result = await contactsApi.createContact(createContact);
    console.log('Brevo contact created successfully:', result);
    
    return json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating Brevo contact:', error);
    return json({ error: 'Failed to create contact' }, { status: 500 });
  }
};
