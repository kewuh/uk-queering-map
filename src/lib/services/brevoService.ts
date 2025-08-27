import * as SibApiV3Sdk from '@getbrevo/brevo';

// Configure API key authorization
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY || '';

const contactsApi = new SibApiV3Sdk.ContactsApi();

export async function createBrevoContact(email: string, storyLocation?: string) {
  try {
    const createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = email;
    createContact.attributes = {
      // You can add custom attributes here
      SOURCE: 'UK Queering Map',
      SIGNUP_DATE: new Date().toISOString(),
      ...(storyLocation && { STORY_LOCATION: storyLocation })
    };
    
    // Add to a list (you'll need to create a list in Brevo first)
    // createContact.listIds = [2]; // Replace with your actual list ID
    
    const result = await contactsApi.createContact(createContact);
    console.log('Brevo contact created successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating Brevo contact:', error);
    return { success: false, error };
  }
}
