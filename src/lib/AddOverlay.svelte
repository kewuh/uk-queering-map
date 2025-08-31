<script lang="ts">
  import {
    addOverlayVisible,
    infoOverlayVisible,
    infoOverlayActiveTab
  } from '../stores';
  import ActionButton from './ActionButton.svelte';
  import CloseButton from './CloseButton.svelte';
  import { activeMarkerCoords } from '../stores';
  import { PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';

  import { SvelteToast, toast } from '@zerodevx/svelte-toast';
  import { onMount } from 'svelte';

  let momentDescription = 'This is where...';
  let userEmail = 'Email address (optional)';
  let selectedFeeling = '';
  let isAddButtonDisabled = true;
  let turnstileToken = '';
  let showActionModal = false;

  function closeAddOverlay() {
    addOverlayVisible.update(() => false);
  }

  function redirectToEmailDrafter() {
    // Create URL parameters based on the submitted data
    const params = new URLSearchParams();
    
    if (userEmail && userEmail !== 'Email address (optional)' && userEmail.trim() !== '') {
      params.append('email', userEmail);
    }
    
    if (momentDescription && momentDescription !== 'This is where...') {
      params.append('story', momentDescription);
    }
    
    if (selectedFeeling) {
      params.append('feeling', selectedFeeling);
    }
    
    // Redirect to the Re:Immigration Email Drafter with parameters
    window.open(`https://re-immigration.notastranger.org/?${params.toString()}`, '_blank');
    showActionModal = false;
  }

  function openInfoOverlay(tabActive: number) {
    infoOverlayVisible.update(() => true);
    infoOverlayActiveTab(tabActive);
  }

  const showSubmissionSuccessNotification = () => {
    toast.push(
      'Your story was successfully submitted and is now visible on the map!',
      {
        theme: {
          '--toastBarHeight': 0
        },

        duration: 5000
      }
    );
  };

  $: isAddButtonDisabled =
    !$activeMarkerCoords?.lng ||
    !$activeMarkerCoords?.lat ||
    !momentDescription ||
    !turnstileToken;

  // Global callback function for Turnstile
  function onSubmit(token: string) {
    turnstileToken = token;
  }

  // Make onSubmit globally available for Turnstile
  onMount(() => {
    (window as { onSubmit?: (token: string) => void }).onSubmit = onSubmit;
  });

  // Load Turnstile script
  onMount(() => {
    if (!(window as { turnstile?: unknown }).turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  async function handleAddMoment() {
    const payload = JSON.stringify({
      lng: $activeMarkerCoords?.lng,
      lat: $activeMarkerCoords?.lat,
      description: momentDescription,
      email: userEmail,
      feeling: selectedFeeling,
      turnstileToken: turnstileToken
    });

    const response = await fetch('moments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    });

    if (response.status === 201) {
      // Create Brevo contact if email is provided and not the default text
      if (
        userEmail &&
        userEmail !== 'Email address (optional)' &&
        userEmail.trim() !== ''
      ) {
        try {
          const storyLocation = `${Math.round(($activeMarkerCoords?.lng || 0) * 10000) / 10000}, ${Math.round(($activeMarkerCoords?.lat || 0) * 10000) / 10000}`;

          const brevoResponse = await fetch('/api/brevo-contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: userEmail,
              storyLocation: storyLocation
            })
          });

          if (brevoResponse.ok) {
            console.log('Contact added to Brevo successfully');
          } else {
            console.error('Failed to add contact to Brevo');
          }
        } catch (error) {
          console.error('Error creating Brevo contact:', error);
        }
      }

      showActionModal = true;
      showSubmissionSuccessNotification();
    } else {
      const result = await response.json();
      alert(`Error: ${result.error}`);
    }
  }

  new SvelteToast({
    target: document.body
  });
</script>

<!-- Action Modal -->
{#if showActionModal}
<div class="action-modal-overlay">
  <div class="action-modal">
    <div class="action-modal-content">
      <h2>Thank you for sharing your story.</h2>
      <p>Your experience is now part of the map. But it can also help change immigration policy.</p>
      
      <p>With our Re:Immigration Email Drafter, you can:</p>
      <ul>
        <li>Send your story directly to your MP.</li>
        <li>Submit it to the government's immigration consultation.</li>
      </ul>
      
      <div class="action-modal-buttons">
        <button class="action-btn primary" on:click={redirectToEmailDrafter}>
          Use my story to take action ➜
        </button>
        <button class="action-btn secondary" on:click={() => showActionModal = false}>
          Maybe later
        </button>
      </div>
    </div>
  </div>
</div>
{/if}

<aside class="overlay overlay--add">
  <div class="action-button-container">
    <div>
      <div class="bordered"></div>
      <div class="bordered"></div>
    </div>
    <div>
      <div class="bordered" style="border-right: 0px;"></div>
      <div class="bordered" style="border-right: 0px;"></div>
    </div>

    <CloseButton functionOnClick={closeAddOverlay} position="right"
      >close add overlay</CloseButton
    >
  </div>
  <div class="overlay__outer">
    <div class="overlay__content">
      <section>
        <div class="overlay__section-title">Add Your Story</div>
        <div class="overlay__section-text">
          <div class="partial_div-numbered">
            <span>1</span>Share your story in the text box below.
          </div>
          <div class="partial_div-numbered">
            <span>2</span>Optionally add your email address and mark how you
            feel.
          </div>
          <div class="partial_div-numbered">
            <span>3</span>Click the Add button.
          </div>
          <form>
            <textarea
              bind:value={momentDescription}
              id="txt_contents"
              class="subform"
              placeholder="Share your story here"
              on:click={() => {
                if (momentDescription === 'This is where...') {
                  momentDescription = '';
                }
              }}
            ></textarea>

            <input
              type="text"
              bind:value={userEmail}
              class="email-input"
              placeholder="Email address (optional)"
              on:click={() => {
                if (userEmail === 'Email address (optional)') {
                  userEmail = '';
                }
              }}
            />

            <div class="feeling-section">
              <label for="feeling-options"
                >How does this memory make you feel? (optional)</label
              >
              <div class="feeling-options" id="feeling-options">
                {#if !selectedFeeling || selectedFeeling === 'happy'}
                  <button
                    type="button"
                    class="feeling-btn {selectedFeeling === 'happy'
                      ? 'selected'
                      : ''}"
                    on:click={() =>
                      (selectedFeeling =
                        selectedFeeling === 'happy' ? '' : 'happy')}
                  >
                    🙂
                  </button>
                {/if}
                {#if !selectedFeeling || selectedFeeling === 'neutral'}
                  <button
                    type="button"
                    class="feeling-btn {selectedFeeling === 'neutral'
                      ? 'selected'
                      : ''}"
                    on:click={() =>
                      (selectedFeeling =
                        selectedFeeling === 'neutral' ? '' : 'neutral')}
                  >
                    😐
                  </button>
                {/if}
                {#if !selectedFeeling || selectedFeeling === 'sad'}
                  <button
                    type="button"
                    class="feeling-btn {selectedFeeling === 'sad'
                      ? 'selected'
                      : ''}"
                    on:click={() =>
                      (selectedFeeling =
                        selectedFeeling === 'sad' ? '' : 'sad')}
                  >
                    🙁
                  </button>
                {/if}
              </div>
            </div>

            <div class="recaptcha-text">
              By submitting I agree to the <a
                href="/"
                on:click|preventDefault={() => openInfoOverlay(6)}
                target="_blank"
                rel="noopener">Terms of Use</a
              >
              and
              <a
                href="/"
                on:click|preventDefault={() => openInfoOverlay(7)}
                target="_blank"
                rel="noopener">Privacy Policy</a
              >.
            </div>
            <div class="email-note">
              You don't have to leave your email, but if you do, we'll use this
              to keep you updated on how you can get involved.
            </div>

            <!-- Cloudflare Turnstile CAPTCHA -->
            <div
              class="cf-turnstile"
              data-sitekey={PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
              data-size="invisible"
              data-callback="onSubmit"
            ></div>

            <ActionButton
              functionOnClick={handleAddMoment}
              isDisabled={isAddButtonDisabled}>Add</ActionButton
            >
          </form>
        </div>
      </section>
    </div>
  </div>
</aside>

<style>
  .partial_div-numbered span {
    border: 1.01px solid var(--color-dark);
    border-radius: 50%;
    min-width: 22px;
    height: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
    margin-top: 5px;
    margin-right: 10px;
  }

  .overlay__section-text .partial_div-numbered {
    min-height: 39px;
  }

  .overlay {
    position: fixed;
    z-index: var(--overlay-z-index);
    top: 0;
    background-color: var(--color-pink);
    overflow-x: hidden;
  }

  .overlay__outer {
    width: calc(40vw);
    padding: 0.8em;
  }

  .overlay__section-title {
    text-decoration: none;
    font-size: 15px;
    color: var(--color-dark);
    display: block;
    font-weight: 500;
    padding-bottom: 4px;
    padding-top: 1em;
    padding-left: 2.05rem;
    font-weight: bold;
  }

  .feeling-section {
    margin: 1rem 0;
  }

  .feeling-section label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 15px;
    color: var(--color-dark);
  }

  .feeling-options {
    display: flex;
    gap: 0.5rem;
  }

  .feeling-btn {
    background: var(--color-pink);
    border: 1px solid black;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    color: black;
    opacity: 1;
    box-sizing: border-box;
  }

  .feeling-btn:hover {
    background: #e6e6e6;
    border-color: #e6e6e6;
  }

  .feeling-btn.selected {
    background: #4a90e2;
    color: white;
    border: 1px solid black;
    opacity: 1;
    box-shadow:
      0 6px 12px -1px rgba(0, 0, 0, 0.2),
      0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .overlay__section-text {
    text-decoration: none;
    color: var(--color-dark);
    display: block;
    margin-top: 1em;
    font-size: 15px;
  }

  .overlay__section-text > div {
    display: flex;
    align-items: center;
  }

  .overlay__section-text > *:first-child {
    margin-top: 0;
  }

  .overlay__section-text > *:last-child {
    margin-bottom: 0;
  }

  a {
    text-decoration: underline;
    text-decoration-color: var(--color-dark);
    color: var(--color-dark);
  }

  @media (max-width: 800px) {
    .overlay__section-title {
      padding-left: 1.05rem;
    }

    .partial_div-numbered {
      padding-left: 0.5em;
    }
    .overlay--add,
    .overlay__outer {
      width: 100%;
    }
    .overlay__outer {
      max-width: 100% !important;
      padding-top: 0px;
      box-sizing: border-box;
    }
    .overlay__content {
      max-width: 100%;
    }
    .overlay--add textarea {
      padding: 10px;
      width: 99%;
      height: 125px;
      margin-top: 10px;
    }
    .overlay--add .email-input {
      padding: 10px;
      width: 99%;
      margin-top: 10px;
    }
    .overlay--add {
      border: 1.01px solid var(--color-dark);
      position: fixed;
      top: unset;
      width: calc(100vw - 18px);
      left: 50%;
      bottom: 1%;
      transform: translateX(-50%);
      z-index: 999999;
    }
  }

  @media (min-width: 800px) {
    .overlay__outer {
      width: calc(40vw);
      padding: 0em;
    }

    .overlay__outer form {
      padding: 0.8em;
      margin-bottom: 0.8em;
    }

    .overlay--add {
      border-top: none;
      border-left: var(--color-dark) solid 1px;
      box-shadow: -4px 0px 6px 0px rgba(0, 0, 0, 0.5);
      top: 9px;
      right: 9px !important;
      border: 1.01px solid;
      z-index: 199;
    }

    .overlay__content {
      margin: 0;
      height: 125%;
      left: 9px;
      top: 9px;
      max-height: 97vh;
      height: unset;
    }
  }

  .recaptcha-text {
    margin-top: 0.5em;
    font-size: 0.75em;
  }

  .email-input {
    margin-top: 0.5em;
    padding: 8px;
    width: 100%;
    font-size: 12pt;
    background-color: #4a90e2;
    border: 1.01px solid var(--color-dark);
    font-family: 'Apfel Grotezk', sans-serif;
    box-sizing: border-box;
  }

  .email-note {
    margin-top: 0.5em;
    font-size: 0.75em;
    color: var(--color-dark);
    font-style: italic;
  }

  .cf-turnstile {
    margin-top: 1em;
    display: flex;
    justify-content: center;
  }

  .subform {
    margin: auto;
    text-align: left;
    padding-left: 0;
    padding-top: 0;
    padding-bottom: 0.4em;
    padding-right: 0.4em;
    width: 100%;
    font-size: 12pt;
    height: 12em;
    background-color: #4a90e2;
    border: 1.01px solid var(--color-dark);
  }

  textarea {
    font-family: 'Apfel Grotezk', sans-serif;
    resize: vertical;
  }

  .action-button-container {
    right: 0;
  }
  .action-button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .action-button-container > div {
    width: 50%;
  }
  .action-button-container .bordered {
    border-right: 1.01px solid var(--color-dark);
    border-bottom: 1.01px solid var(--color-dark);
    height: 21px;
  }
  .overlay--add textarea {
    box-sizing: border-box !important;
    padding: 10px !important;
  }

  /* Action Modal Styles */
  .action-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  .action-modal {
    background: var(--color-pink);
    border: 1px solid black;
    border-radius: 8px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    margin: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }

  .action-modal-content h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    color: var(--color-dark);
  }

  .action-modal-content p {
    margin: 0 0 1rem 0;
    color: var(--color-dark);
    line-height: 1.5;
  }

  .action-modal-content ul {
    margin: 0 0 1.5rem 0;
    padding-left: 1.5rem;
    color: var(--color-dark);
  }

  .action-modal-content li {
    margin: 0.5rem 0;
    line-height: 1.4;
  }

  .action-modal-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .action-btn {
    padding: 0.75rem 1.5rem;
    border: 1px solid black;
    border-radius: 4px;
    font-family: 'Apfel Grotezk', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
    min-width: 120px;
  }

  .action-btn.primary {
    background: #4a90e2;
    color: white;
  }

  .action-btn.primary:hover {
    background: #357abd;
  }

  .action-btn.secondary {
    background: var(--color-pink);
    color: var(--color-dark);
  }

  .action-btn.secondary:hover {
    background: #e6e6e6;
  }

  @media (max-width: 600px) {
    .action-modal {
      padding: 1.5rem;
      margin: 0.5rem;
    }
    
    .action-modal-buttons {
      flex-direction: column;
    }
    
    .action-btn {
      width: 100%;
    }
  }
</style>
