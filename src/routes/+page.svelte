<script lang="ts">
  import '$lib/style.css';
  import '$lib/maplibre_style.css';
  import '$lib/navbar_buttons.css';
  import AddOverlay from '$lib/AddOverlay.svelte';
  import InfoOverlay from '$lib/InfoOverlay.svelte';
  import Map from '$lib/Map.svelte';
  import NavBar from '$lib/NavBar.svelte';
  import { addOverlayVisible, infoOverlayVisible } from '../stores';

  import DonatePopup from '$lib/DonatePopup.svelte';
</script>

<svelte:head>
  <title>Placemarked</title>
  <meta
    name="description"
    content="The border isn't a line. It's a system. Not just at airports, but in classrooms, clinics, break rooms, and back seats of police vans. Placemarked maps its reach: where care is denied, lives are questioned, and joy still insists on showing up."
  />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://migrant-d0hmw57eq-davids-projects-b5d97cc3.vercel.app/" />
  <meta property="og:title" content="Placemarked" />
  <meta
    property="og:description"
    content="The border isn't a line. It's a system. Not just at airports, but in classrooms, clinics, break rooms, and back seats of police vans. Placemarked maps its reach: where care is denied, lives are questioned, and joy still insists on showing up."
  />
  <meta property="og:site_name" content="Placemarked" />
  <meta property="og:locale" content="en_US" />
  <meta
    name="google-site-verification"
    content="J-oUgPBYWRXkPhvqF8XBrDtrA-qu8pXiMiYPd3QrfhE"
  />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Placemarked" />
  <meta
    name="twitter:description"
    content="The border isn't a line. It's a system. Not just at airports, but in classrooms, clinics, break rooms, and back seats of police vans. Placemarked maps its reach: where care is denied, lives are questioned, and joy still insists on showing up."
  />
</svelte:head>

<NavBar></NavBar>
{#if $infoOverlayVisible}
  <InfoOverlay></InfoOverlay>
{/if}
{#if $addOverlayVisible}
  <AddOverlay></AddOverlay>
{/if}
<Map></Map>
<DonatePopup></DonatePopup>
