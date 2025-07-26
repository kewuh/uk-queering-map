<script lang="ts">
  import { infoOverlayVisible } from '../stores';
  import CloseButton from './CloseButton.svelte';

  let root: HTMLElement;
  let active_tab = localStorage.getItem('active_tab')
    ? Number(localStorage.getItem('active_tab'))
    : 1;
  function closeInfoOverlay() {
    infoOverlayVisible.update(() => false);
    localStorage.removeItem('active_tab');
  }

  function showTabState(parameter: number) {
    active_tab = parameter;
    root.scrollTop = 0;
  }
</script>

<aside class="overlay overlay--info" bind:this={root}>
  <CloseButton functionOnClick={closeInfoOverlay}
    >close info overlay</CloseButton
  >

  <div class="header__menu__margin">
    <div class="info__tabs first__row">
      <button class:active={active_tab == 1} on:click={() => showTabState(1)}
        >About
      </button>
      <button
        class:active={active_tab == 2}
        style="border-right: 1px solid black;"
        on:click={() => showTabState(2)}
        >Support Us
      </button>
    </div>
    <div class="info__tabs">
      <button class:active={active_tab == 3} on:click={() => showTabState(3)}
        >Moderation
      </button>
      <button
        class:active={active_tab == 4}
        style="border-right: 1px solid black;"
        on:click={() => showTabState(4)}
        >Press
      </button>
    </div>
  </div>
  <CloseButton functionOnClick={closeInfoOverlay}
    >close info overlay</CloseButton
  >
  <div class="overlay__outer">
    <div class="overlay__content">
      <section style={active_tab !== 1 ? 'display: none;' : ''}>
        <h2 style="border-top: 0px;">About</h2>
        <div class="overlay__section-text">
          <p>
            Placemarked is a community-powered counter-mapping platform for
            archiving migrant experiences in relation to place.
          </p>

          <p>
            The platform offers a space to collectively trace how borders are
            lived: on the street, in schools, at train stations and GP surgeries.
            Whether it's a moment of kindness or a demand to "show your papers,"
            a housing rejection or an immigration raid, this map gathers
            fragments of migrant life that are too often ignored, criminalised,
            or erased.
          </p>

          <p>
            From displacement and documentation to resistance and resilience,
            Not A Stranger is a living archive of how migration is shaped, and
            how it shapes us. By mapping the emotional and political geographies
            of migration, we seek to reveal not just the violence of borders,
            but also the networks of care, solidarity, and survival that stretch
            beyond them.
          </p>

          <p>
            This platform is a project of Not A Stranger. It is inspired by and
            built upon Queering the Map's community-based platform, mapping
            memories and experiences across physical space.
          </p>

          <h2>Empire</h2>
          <div class="overlay__section-text">
            <p>
              Placemarked was created on land deeply shaped by empire,
              enclosure, and displacement. The UK's borders may be fixed on
              maps, but its wealth, institutions, and very idea of "nation" have
              been built through centuries of colonial extraction, forced
              migration, and the violent movement of people and resources.
            </p>

            <p>
              Many of us who migrate to the UK do so as a direct result of these
              histories: seeking refuge, opportunity, or survival in places
              shaped by the same empires that destabilised our own. As we map
              our experiences here, we must ask: Whose stories are still missing
              from the map?
            </p>

            <p>
              Migration justice must reckon with Britain's colonial past and its
              ongoing border regime. It must also be in solidarity with all who
              are displaced, whether by war, climate collapse, gentrification,
              or austerity, and with Indigenous peoples resisting erasure around
              the world.
            </p>
          </div>
        </div>
      </section>

      <section style={active_tab !== 2 ? 'display: none;' : ''}>
        <h2>Donate</h2>
        <div class="overlay__section-text">
          <p>
            This project is built upon Queering the Map, a grassroots endeavour
            that relies on donations. Please support them by making a donation
            through their Patreon below. Not A Stranger's charitable status is
            currently pending with the UK's Charity Commission.
          </p>
          <div class="button__fadein">
            <a
              href="https://www.patreon.com/queeringthemap"
              class="donate_button"
              target="_blank"
              rel="noopener">DONATE</a
            >
          </div>
        </div>

        <h2>Volunteer</h2>
        <div class="overlay__section-text">
          <p>
            If you would like to volunteer your time, please send us an email
            expressing your interest at david.norton [at] notastranger [dot] org
          </p>
        </div>
      </section>

      <section style={active_tab !== 3 ? 'display: none;' : ''}>
        <h2>Moderation Guidelines</h2>
        <div class="overlay__section-text">
          <p>
            Posts to Placemarked are moderated by a small group of
            volunteers before they appear publicly. This to ensure the following
            are not added to the platform:
          </p>

          <div class="partial_div-numbered">
            <span>1</span>
            <p>
              Breaches of Anonymity <br />
              We do not approve posts that breach your or anyone else's anonymity.
              This means posts containing last names, phone numbers, email addresses,
              social media handles, or exact addresses will not be approved.
            </p>
          </div>

          <div class="partial_div-numbered">
            <span>2</span>
            <p>
              Hate Speech <br />
              We do not approve posts that degrade or threaten a group of people
              based on race, ethnicity, citizenship, ability, sexuality, sex, gender,
              or class.
            </p>
          </div>
          <div class="partial_div-numbered">
            <span>3</span>
            <p>
              Spam/Advertising <br />
              We do not approve spam posts, or advertisements of any kind.
            </p>
          </div>

          <p style="margin-top: 0px;">
            The moderation process is to ensure the safety of the map, and is
            not about policing expressions or identities.
          </p>
        </div>

        <h2>Request Removal</h2>
        <div class="overlay__section-text removal_textarea">
          <p>
            If you would like something you posted to be removed, or see
            something on the map you feel shouldn't be there, please contact us
            at david.norton [at] notastranger [dot] org.
          </p>
        </div>
      </section>

      <section style={active_tab !== 5 ? 'display: none;' : ''}>
        <h2>Why can't I see my post on the map?</h2>
        <div class="overlay__section-text">
          <p>
            In 99.9% of cases, it is because it has not been reviewed by our
            moderation team yet. All posts are moderated by a small group of
            volunteers before appearing publicly on the map, in order to ensure
            they do not contain breaches of anonymity, hate speech, or
            spam/advertising. Rest assured that your post will be visible as
            soon as we reach it in the moderation queue.
          </p>
        </div>
        <h2>Can I delete my post?</h2>
        <div class="overlay__section-text">
          <p>
            Yes, of course! To delete your post, please email the text of the
            post you would like deleted to david.norton [at] notastranger [dot] org
            with the subject line 'Delete My Post'.
          </p>
        </div>
        <h2>How can I become a moderator?</h2>
        <div class="overlay__section-text">
          <p>
            We are always welcoming new volunteer moderators to our team. For
            information on upcoming moderator onboarding sessions, please email
            us at david.norton [at] notastranger [dot] org.
          </p>
        </div>
      </section>

      <section style={active_tab !== 4 ? 'display: none;' : ''}>
        <h2 style="margin-bottom:0px;">Press</h2>

        <div class="__press">
          <p>This project is inspired by and built upon Queering the Map's platform, particularly these stories. We'll list press for this site as it comes in.</p>

          <h2>The Nation</h2>
          <a
            href="https://www.thenation.com/article/world/gaza-queering-the-map/"
            title="Gaza's Queer Palestinians Fight to Be Remembered"
            rel="noopener noreferrer"
            target="_blank">Gaza's Queer Palestinians Fight to Be Remembered</a
          >
          <span> By Sarah O'Neal</span>

          <h2>Them</h2>
          <a
            href="https://www.them.us/story/queering-the-map-the-dyke-project-london-transit-ad-hack"
            title="Queer U.K. Activists Hacked London Transit Ads to Support LGBTQ+ Gazans"
            rel="noopener noreferrer"
            target="_blank"
            >Queer U.K. Activists Hacked London Transit Ads to Support LGBTQ+
            Gazans</a
          >
          <span> By Abby Monteil</span>
        </div>
      </section>

      <section style={active_tab !== 6 ? 'display: none;' : ''}>
        <h2>Terms of Use</h2>
        <div class="privacy_policy overlay__section-text">
          <p><small>Last Updated on April 15, 2024</small></p>

          <h2>Summary</h2>

          <p>

          <h2>Autostraddle</h2>
          <a
            href="https://www.autostraddle.com/here-queer-everywhere-queering-the-map-gives-voice-to-queer-spaces-worldwide-419732/"
            title="Here, Queer, Everywhere: 'Queering the Map' Gives Voice to Queer Spaces Worldwide"
            rel="noopener noreferrer"
            target="_blank"
            >Here, Queer, Everywhere: 'Queering the Map' Gives Voice to Queer
            Spaces Worldwide</a
          >
          <span> By Vanessa Pamela</span>

          <h2>Fugues</h2>
          <a
            href="https://www.fugues.com/252198-7240-7276-article-geolocaliser-nos-souvenirs-queer.html"
            title="Géolocaliser nos souvenirs queer"
            rel="noopener noreferrer"
            target="_blank">Géolocaliser nos souvenirs queer</a
          >
          <span> By Michel Joanny-Furtin</span>

          <h2>Numerama</h2>
          <a
            href="https://www.numerama.com/pop-culture/367351-sur-cette-carte-interactive-des-personnes-queer-faconnent-leur-histoire-collective.html"
            title="Sur cette carte interactive, des personnes queer façonnent leur histoire collective"
            rel="noopener noreferrer"
            target="_blank"
            >Sur cette carte interactive, des personnes queer façonnent leur
            histoire collective</a
          >
          <span> By Nelly Lesage</span>

          <h2>ZETT</h2>
          <a
            href="https://ze.tt/landkarte-queerer-momente-hier-hatte-ich-meinen-ersten-blowjob-von-einem-anderen-mann/"
            title="Landkarte queerer Momente: Hier hatte ich meinen ersten Blowjob von einem anderen Mann"
            rel="noopener noreferrer"
            target="_blank"
            >Landkarte queerer Momente: Hier hatte ich meinen ersten Blowjob von
            einem anderen Mann</a
          >
          <span> By Eva Reisinger</span>

          <h2>Komitid</h2>
          <a
            href="https://www.komitid.fr/2018/06/11/queering-the-map-cartographie-interview/"
            title="« Queering the Map » ou comment repenser le territoire quand on est invisibilisé.e.s"
            rel="noopener noreferrer"
            target="_blank"
            >« Queering the Map » ou comment repenser le territoire quand on est
            invisibilisé.e.s</a
          >
          <span> By Anne-Laure Pineau</span>

          <h2>McGill Daily</h2>
          <a
            href="https://www.mcgilldaily.com/2018/01/archiving-queer-histories/"
            title="Archiving Queer Histories"
            rel="noopener noreferrer"
            target="_blank">Archiving Queer Histories</a
          >
          <span> By Panayot Gaidov</span>

          <h2>Concordia</h2>
        </div>
      </section>

      <section style={active_tab !== 6 ? 'display: none;' : ''}>
        <h2>Terms of Use</h2>
        <div class="privacy_policy overlay__section-text">
          <p><small>Last Updated on 26 July 2025</small></p>

          <h2>Summary</h2>
          <p>
            It is important to us that you understand our Terms of Use, which,
            simply put, are the conditions and rules of using Placemarked. Because
            legal jargon is often intricate, lengthy and dull, we have created a
            summary of the key points to keep in mind while using this website.
          </p>
          <p>
            It's important to note that this summary is not intended to replace
            the complete Terms of Use, and we strongly recommend reviewing the
            full Terms before engaging with our website.
          </p>

          <p>
            By using the Placemarked website, application or other services
            ("Services"), you agree to our Terms of Use and our Privacy Policy.
            If you don't agree to our Terms or Privacy Policy, do not use our
            Services.
          </p>
          <p>
            We can change the Terms of Use and Privacy Policy at any time, so
            please check them regularly to ensure you're up to date.
          </p>

          <p>
            Our Services allow you to share User Content and you retain
            ownership of what you post—but by using the Services, you grant us
            and other users permission to use, modify, and share your User
            Content, both on the website and beyond. You confirm you own or have
            permission to share the content, and agree that Placemarked and
            others can use it in accordance with these terms.
          </p>

          <p>
            You may request that your User Content be removed at any time. To do
            so, contact us at david [dot] norton [at] notastranger [dot] org.
          </p>

          <p>
            User Content must comply with all laws and not include hate,
            violence, impersonation, commercial spam, harmful software, or
            personal identifying information.
          </p>

          <p>
            Placemarked operates under the Creative Commons
            Attribution-NonCommercial-ShareAlike 4.0 International License. You
            can share and adapt materials on the site, as long as you credit us,
            don't use it commercially, and share any modifications under the
            same license.
          </p>

          <p>Do not use our Services if you are under 13.</p>

          <p>
            Sometimes things break or go offline. We'll try to fix them, but we
            are not liable for any interruptions or data loss.
          </p>

          <p>
            Links to third-party sites or tech are not under our control, and we
            can't make any guarantees about them.
          </p>

          <p>
            This site is for personal use only—not for commercial or business
            purposes.
          </p>

          <p>
            For questions, contact us: david [dot] norton [at] notastranger
            [dot] org
          </p>
        </div>
      </section>
      <section style={active_tab !== 7 ? 'display: none;' : ''}>
        <h2>Privacy Policy</h2>
        <div class="privacy_policy overlay__section-text">
          <p><small>Last Updated on 26 July 2025</small></p>

          <p>
            This Privacy Policy outlines the collection, use, disclosure, and
            protection of your information when you access and use our platform.
            Your privacy is crucial to us, and we are committed to maintaining
            the confidentiality and security of the information you provide.
          </p>

          <p>
            By using Placemarked, you acknowledge that you have read and
            understood this Privacy Policy. Your continued use of the platform
            constitutes acceptance of any updates or changes to this policy. If
            you do not agree to this Privacy Policy, do not use Placemarked.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            User Content: Users may voluntarily provide User Content, such as
            personal stories, experiences, and other content, in text format.
          </p>
          <p>
            Location Data: Users may voluntarily select a location on the map
            where they would like their User Content to appear. We do not
            collect information about users' actual location.
          </p>
          <p>
            Time Data: We collect the time that a user's submission is made.
            This is so that we can organize submissions chronologically in our
            database.
          </p>

          <h2>2. Use of Information</h2>
          <p>
            Platform Functionality: We use the information collected to provide
            and improve the functionality of Placemarked, allowing users to
            share and explore migrant experiences globally.
          </p>

          <p>
            Research and Dissemination: We may analyze and use aggregated,
            non-personal data for research and artistic purposes to enhance the
            platform's overall experience and mission.
          </p>

          <h2>3. Disclosure of Information</h2>
          <p>
            Anonymity: Users contribute anonymously if they choose not to
            associate their contributions with identifiable information. Users
            cannot create accounts, so no usernames, passwords, phone numbers,
            email addresses, or social media handles are associated with
            contributions. We moderate all contributions for breaches of
            anonymity.
          </p>

          <p>
            Legal Compliance: We may disclose information in response to legal
            processes or when required to comply with applicable laws,
            regulations, or government requests.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>
            Placemarked may use third-party services for analytics, hosting,
            and other functionalities. These services may have their own
            privacy policies, and users are encouraged to review them.
          </p>

          <h2>5. Security</h2>
          <p>
            We implement reasonable measures to protect the information we
            collect from unauthorized access, disclosure, or alteration.
            However, no data transmission over the internet is entirely secure,
            and we cannot guarantee absolute security.
          </p>

          <h2>6. Children's Privacy</h2>
          <p>
            Placemarked is intended for users aged 13 and older. We do not
            knowingly collect information from individuals under the age of 13.
          </p>

          <h2>7. Changes to This Privacy Policy</h2>
          <p>
            We reserve the right to update or change our Privacy Policy at any
            time. Any changes will be effective immediately upon posting the
            updated Privacy Policy on the platform.
          </p>

          <h2>8. Preteens And Users Under 18</h2>
          <p>
            Placemarked is not intended for users under 13. If you are between
            13 and 18, you may use the platform only with parental or guardian
            consent, in accordance with applicable laws.
          </p>

          <h2>Contact Us</h2>
          <p>
            For answers to any questions you may have about our Terms of Use or
            Privacy Policy, email us at: david [dot] norton [at] notastranger
            [dot] org
          </p>
        </div>
      </section>
      <section style={active_tab !== 8 ? 'display: none;' : ''}>
        <h2>Contact</h2>
        <div class="overlay__section-text">
          <p>
            Get in touch at david [dot] norton [at] notastranger [dot] org.
          </p>
        </div>
      </section>
    </div>
    <div class="footer__menu__margin">
      <div class="info__tabs first__row">
        <button class:active={active_tab == 5} on:click={() => showTabState(5)}
          >FAQs
        </button>
        <button
          class:active={active_tab == 6}
          style="border-right: unset;"
          on:click={() => showTabState(6)}
          >Terms of Use
        </button>
      </div>
      <div class="info__tabs">
        <button class:active={active_tab == 7} on:click={() => showTabState(7)}
          >Privacy Policy
        </button>
        <button
          class:active={active_tab == 8}
          style="border-right: unset;"
          on:click={() => showTabState(8)}
          >Contact
        </button>
      </div>
    </div>
  </div>
</aside>

<style>
  a {
    cursor: pointer;
  }
  ul {
    list-style-type: disc;
    margin-top: -5px;

    padding-right: 1em;
  }
  ul.voidcircle li {
    margin-top: -5px;
    padding-bottom: 10px;
  }
  ul.voidcircle {
    padding-left: 3.5em;
    padding-right: 1.5em;
    list-style-type: circle;
  }
  .__press h2.divider {
    border-top: 1.01px solid var(--color-dark);
    padding-top: 1em;
    padding-left: 2.05rem;
    font-weight: bold !important;
  }
  .__press {
    display: flex;
    flex-direction: column;
  }
  .__press span {
    padding-left: 10px;
    margin-top: 10px;
    display: none;
    /* hides press names */
  }
  .__press a {
    padding-left: 1em;
    padding-right: 1em;
    padding-top: 0px;
    font-size: 15px;
  }
  .__press h2 {
    font-size: 15.1px;
    border-top: 0px;
    padding-top: 4px;
    padding-left: 1em;
    padding-bottom: 0px;
    margin-bottom: 0px;
    font-weight: 400 !important;
  }
  .footer__menu__margin {
    margin-top: 20px;
    width: calc((40vw));
    position: sticky;
    bottom: 0px;
    background: var(--color-pink);
  }
  .header__menu__margin {
    width: calc((40% - 43px));
    left: 54px;
    position: fixed;
    background: var(--color-pink);
  }

  .info__tabs {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: center;
  }
  .info__tabs button {
    width: 50%;
    border: 1.01px solid var(--color-dark);
    height: 22.5px;
    font-size: 0.9rem;
    font-weight: 500;
    background: transparent;
    cursor: pointer;
    color: var(--color-dark);
  }
  .info__tabs button.active {
    background-color: var(--color-dark);
    color: var(--color-pink);
  }
  .info__tabs button:hover {
    background-color: black;
    color: var(--color-pink);
    transition-duration: 300ms;
    transition-timing-function: ease;
  }
  .info__tabs button:nth-child(odd) {
    border-left: 0px solid black;
    border-right: unset;
  }

  .info__tabs.first__row button {
    border-bottom: 0px;
  }
  .partial_div-numbered {
    display: flex;
    gap: 8px;
  }
  .partial_div-numbered p {
    margin-top: 0px;
  }
  .partial_div-numbered span {
    border: 1.01px solid var(--color-dark);
    border-radius: 50%;
    min-width: 22px;
    height: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .overlay {
    height: 100%;
    position: fixed;
    z-index: var(--overlay-z-index);
    top: 0;
    background-color: var(--color-pink);
    overflow-x: hidden;
  }

  .overlay__outer section p {
    padding-left: 1em;
    padding-right: 1em;
  }
  .overlay__outer section ul p {
    padding-left: 0em;
    padding-right: 0em;
  }

  .overlay__outer section .donate_button {
    width: calc(100% - 2em);
    margin: auto;
    display: flex;
    justify-content: center;
  }

  section {
    margin-top: 2em;
  }

  h2 {
    text-decoration: none;
    font-size: 15px;
    color: var(--color-dark);
    display: block;
    font-weight: 500;
    padding-bottom: 4px;
    border-top: 1px solid var(--color-dark);
    padding-left: 2.05rem;
  }
  .overlay__content h2 {
    font-weight: bold;
    font-size: 15px;
  }
  @media (min-width: 800px) {
    h2 {
      font-size: 15px;
      padding-top: 1em;
    }
  }

  .overlay__section-text {
    text-decoration: none;
    color: var(--color-dark);
    display: block;
    margin-top: 1em;
    font-size: 15px;
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

  a:not(.closebtn):hover,
  a:not(.closebtn):focus {
    color: var(--color-pink-bright);
    text-decoration-color: var(--color-pink-bright);
  }

  .overlay--info {
    left: 0;
    z-index: 99999;
  }
  .overlay--info::-webkit-scrollbar {
    display: none;
  }

  .overlay--info {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .overlay__outer {
    padding-top: 11px;
  }
  @media (max-width: 800px) {
    h2 {
      padding-top: 1.05em;
      padding-bottom: 0px;
    }
    .overlay--info {
      margin-top: 9px;
      margin-left: 9px;
      margin-right: 9px;
      max-height: 98vh;
      background: transparent;
      width: calc(100vw - 18px);
    }
    .overlay__outer {
      background: var(--color-pink);
      border: 1.01px solid var(--color-dark);
      border-bottom: 0px;
    }
    .header__menu__margin {
      width: calc((100% - 63px));
      left: 54px;
    }
    .footer__menu__margin {
      width: 100%;
    }
  }

  @media (min-width: 800px) {
    .overlay__outer {
      width: calc(40vw);
      padding-top: 12px;
    }

    .overlay--info {
      left: 9px;
      top: 9px;
      border-right: var(--color-dark) solid 1px;
      border-left: var(--color-dark) solid 1px;
      box-shadow: 4px 0px 6px 0px rgba(0, 0, 0, 0.5);
      max-height: calc(100vh - 18px);
      height: unset;
    }

    .overlay__content {
      margin: 0;
      height: 125%;
    }
  }

  .donate_button {
    display: inline-block;
    border: 1.01px solid var(--color-dark);
    background: var(--color-pink);
    color: var(--color-dark);
    box-shadow: 0 0 5px -1px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    padding: 10px 0px;
    text-align: center;
    font-size: 30px;
    text-transform: uppercase;
    text-decoration: none;
    transition-property: color, border-color, background-color;
    transition-duration: 300ms;
    transition-timing-function: ease;
    width: 100%;
    text-transform: uppercase;
    font-size: 20px;
    text-decoration: none !important;
    min-width: calc(100% - 1.5em);
  }

  .button__fadein .donate_button:hover {
    background: var(--color-dark);
    color: var(--color-pink) !important;
    transition-property: color, border-color, background-color;
    transition-duration: 300ms;
    transition-timing-function: ease;
    border: 1.01px solid var(--color-dark);
  }
</style>
