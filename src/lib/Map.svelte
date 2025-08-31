<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import maplibregl, {
    type Map as MapType,
    type LngLatLike,
    type GeoJSONSource,
    type StyleSpecification,
    type MapMouseEvent,
    type MapGeoJSONFeature
  } from 'maplibre-gl';
  const {
    AttributionControl,
    Map,
    NavigationControl,
    Popup,
    GeolocateControl
  } = maplibregl;
  import 'maplibre-gl/dist/maplibre-gl.css';
  import markerImage from '$lib/assets/marker-hovered.png';
  import markerHoveredImage from '$lib/assets/marker-hovered.png';
  import styleJson from '$lib/data/pmtiles/style.json';
  const style = styleJson as StyleSpecification;
  import addMarkerImage from '$lib/assets/add-marker.png';
  import { activeMarkerCoords, addOverlayVisible } from '../stores';
  import type { FeatureCollection, Point, GeoJsonProperties } from 'geojson';

  let map: MapType;
  let mapContainer: HTMLDivElement;
  let isMomentLayerClicked = false;
  let hasShownFirstPopup = false;
  let currentFilter: string | null = null;

  const initialState = { lng: -0.1276, lat: 51.5074, zoom: 6 };

  const markerHeight = 39;
  const markerId = 'moments';
  const markerLayerId = 'moments-layer';
  const markerHoveredLayerId = 'moments-hovered-layer';
  const activeMarkerSourceId = 'active-marker-source';
  const activeMarkerLayerId = 'active-marker-layer';

  const activeMarkerGeoJSON: FeatureCollection<Point, GeoJsonProperties> = {
    type: 'FeatureCollection',
    features: []
  };

  // Function to filter data based on feeling
  async function filterData(feeling: string | null) {
    if (!map) return;

    const source = map.getSource(markerId) as GeoJSONSource;
    if (!source) return;

    if (feeling === null) {
      // Show all data
      source.setData('/moments');
    } else {
      // Fetch and filter data
      const response = await fetch('/moments');
      const data = await response.json();

                const filteredFeatures = data.features.filter((feature: { properties?: { feeling?: string } }) => {
            return feature.properties?.feeling === feeling;
          });

      source.setData({
        type: 'FeatureCollection',
        features: filteredFeatures
      });
    }
  }

  async function getMoment(id?: number | string) {
    try {
      const response = await fetch(`/moment/${id}`);
      const moment = await response.json();
      return moment.description;
    } catch (error) {
      console.error('Error fetching moment:', error);
      return '';
    }
  }

  async function loadImageAndAddToMap(
    map: MapType,
    imageUrl: string,
    imageId: string
  ) {
    try {
      const image = await map.loadImage(imageUrl);
      map.addImage(imageId, image.data);
    } catch (error) {
      console.error(`Error loading image (${imageUrl}):`, error);
    }
  }

  function addPinLayer(
    map: MapType,
    layerId: string,
    sourceId: string,
    iconImage: string,
    paint: object = {}
  ) {
    map.addLayer({
      id: layerId,
      type: 'symbol',
      source: sourceId,
      layout: {
        'icon-allow-overlap': true,
        'icon-image': iconImage,
        'icon-size': 0.45,
        'icon-anchor': 'bottom'
      },
      paint: paint
    });
  }

  onMount(() => {
    map = new Map({
      container: mapContainer,
      style: style,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
      minZoom: 0,
      maxZoom: 12,
      attributionControl: false
    });
    map.addControl(
      new AttributionControl({
        compact: true
      })
    );
    map.addControl(
      new NavigationControl({ showCompass: false }),
      'bottom-right'
    );
    map.addControl(
      new GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        }
      }),
      'bottom-right'
    );

    map.keyboard.enable();

    map.on('load', async () => {
      map.addSource(markerId, {
        type: 'geojson',
        data: '/moments'
      });

      try {
        await loadImageAndAddToMap(map, markerImage, 'marker');
        await loadImageAndAddToMap(map, markerHoveredImage, 'marker-hovered');
        await loadImageAndAddToMap(map, addMarkerImage, 'add-marker');
      } catch (error) {
        console.error('Error loading marker images:', error);
      }

      addPinLayer(map, markerLayerId, markerId, 'marker');
      addPinLayer(map, markerHoveredLayerId, markerId, 'marker-hovered', {
        'icon-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0
        ]
      });

      map.addSource(activeMarkerSourceId, {
        type: 'geojson',
        data: activeMarkerGeoJSON
      });
      addPinLayer(map, activeMarkerLayerId, activeMarkerSourceId, 'add-marker');

      map.on(
        'click',
        markerLayerId,
        function (e: MapMouseEvent & { features?: MapGeoJSONFeature[] }) {
          isMomentLayerClicked = true;
          if (!e.features || e.features.length === 0) {
            return;
          }

          const feature = e.features[0];
          if (feature.geometry.type !== 'Point') {
            return;
          }

          const coordinates = (feature.geometry as Point).coordinates;
          if (typeof feature.id !== 'number') {
            console.error('Invalid feature id:', feature.id);
            return;
          }

          // Use description from GeoJSON properties if available, otherwise fetch from API
          let description = feature.properties?.description;

          if (!description) {
            // Fallback to API call if description not in properties
            getMoment(feature.id)
              .then((text) => {
                description = text;
                showPopup(coordinates, description);
              })
              .catch((error) => {
                console.error('Error fetching moment:', error);
              });
          } else {
            showPopup(coordinates, description);
          }

          function showPopup(coords: number[], desc: string) {
            if (coords.length === 2) {
              // Get the feeling from the feature properties
              const feeling = feature.properties?.feeling;
              let emoji = '';
              if (feeling === 'happy') emoji = '🙂';
              else if (feeling === 'neutral') emoji = '😐';
              else if (feeling === 'sad') emoji = '🙁';

              const popupContent = emoji ? `${emoji} | ${desc}` : desc;

              new Popup({
                offset: [0, -markerHeight],
                anchor: 'bottom',
                maxWidth: 'none'
              })
                .setLngLat(coords as LngLatLike)
                .setHTML(popupContent)
                .addTo(map);
            } else {
              console.error('Invalid coordinates format');
            }
          }
        }
      );

      let hoveredFeatureId: number | null = null;

      const pointerHoverHandler = (
        e: MapMouseEvent & { features?: MapGeoJSONFeature[] }
      ) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features.length > 0) {
          const newHoveredFeatureId = e.features[0].id as number;
          if (
            hoveredFeatureId !== null &&
            hoveredFeatureId !== newHoveredFeatureId
          ) {
            map.setFeatureState(
              { source: markerId, id: hoveredFeatureId },
              { hover: false }
            );
          }
          hoveredFeatureId = newHoveredFeatureId;
          map.setFeatureState(
            { source: markerId, id: hoveredFeatureId },
            { hover: true }
          );
        }
      };
      map.on('mouseenter', markerLayerId, pointerHoverHandler);
      map.on('mousemove', markerLayerId, pointerHoverHandler);

      map.on('mouseleave', markerLayerId, function () {
        map.getCanvas().style.cursor = '';
        if (hoveredFeatureId !== null) {
          map.setFeatureState(
            { source: markerId, id: hoveredFeatureId },
            { hover: false }
          );
          hoveredFeatureId = null;
        }
      });

      map.on('click', (e: MapMouseEvent) => {
        if (isMomentLayerClicked) {
          isMomentLayerClicked = false;
          return;
        }

        const { lng, lat } = e.lngLat;
        activeMarkerCoords.set({ lng, lat });

        // Show the Add Your Story panel only on the first click on empty map area
        if (!hasShownFirstPopup) {
          addOverlayVisible.set(true);
          hasShownFirstPopup = true;
        }
      });
    });
  });

  $: {
    if ($activeMarkerCoords) {
      activeMarkerGeoJSON.features = [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [$activeMarkerCoords.lng, $activeMarkerCoords.lat]
          },
          properties: {}
        }
      ];

      const source = map?.getSource(activeMarkerSourceId) as GeoJSONSource;
      if (source) {
        source.setData(activeMarkerGeoJSON);
      }
    }
  }

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });
</script>

<div id="map" bind:this={mapContainer}></div>

<!-- Filter buttons -->
{#if !$addOverlayVisible}
  <div class="filter-buttons has-active">
    <button
      class="filter-btn {currentFilter === null ? 'active' : ''}"
      on:click={() => {
        currentFilter = null;
        filterData(null);
      }}
      title="All Stories"
    >
      All
    </button>
    <button
      class="filter-btn {currentFilter === 'happy' ? 'active' : ''}"
      on:click={() => {
        currentFilter = 'happy';
        filterData('happy');
      }}
      title="Happy Stories"
    >
      🙂
    </button>
    <button
      class="filter-btn {currentFilter === 'neutral' ? 'active' : ''}"
      on:click={() => {
        currentFilter = 'neutral';
        filterData('neutral');
      }}
      title="Neutral Stories"
    >
      😐
    </button>
    <button
      class="filter-btn {currentFilter === 'sad' ? 'active' : ''}"
      on:click={() => {
        currentFilter = 'sad';
        filterData('sad');
      }}
      title="Sad Stories"
    >
      🙁
    </button>
  </div>
{/if}

<style>
  #map {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  /* Filter buttons */
  .filter-buttons {
    position: fixed;
    top: 80px;
    right: 9px;
    z-index: 9998;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: all;
  }

  .filter-btn {
    background: var(--color-pink);
    border: 1px solid black;
    border-radius: 0.125rem;
    padding: 0;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: black;
    font-family: 'Apfel Grotezk', sans-serif;
    width: 46px;
    height: 46px;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    box-sizing: border-box;
  }

  .filter-btn:hover {
    background: #e6e6e6;
    border-color: #e6e6e6;
  }

  .filter-btn.active {
    background: #4a90e2;
    color: white;
    border: 1px solid black;
    opacity: 1;
    box-shadow:
      0 6px 12px -1px rgba(0, 0, 0, 0.2),
      0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  /* Fade out inactive buttons when any filter is active */
  .filter-buttons.has-active .filter-btn:not(.active) {
    opacity: 0.7;
  }

  /* Using pink markers */
</style>
