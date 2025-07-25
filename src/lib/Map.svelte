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
  import markerImage from '$lib/assets/marker.png';
  import markerHoveredImage from '$lib/assets/marker-hovered.png';
  import styleJson from '$lib/data/pmtiles/style.json';
  const style = styleJson as StyleSpecification;
  import addMarkerImage from '$lib/assets/add-marker.png';
  import { activeMarkerCoords } from '../stores';
  import type { FeatureCollection, Point, GeoJsonProperties } from 'geojson';

  let map: MapType;
  let mapContainer: HTMLDivElement;
  let isMomentLayerClicked = false;

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
      minZoom: 3,
      maxZoom: 18,
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

          getMoment(feature.id)
            .then((text) => {
              const description = text;
              if (coordinates.length === 2) {
                new Popup({
                  offset: [0, -markerHeight],
                  anchor: 'bottom',
                  maxWidth: 'none'
                })
                  .setLngLat(coordinates as LngLatLike)
                  .setHTML(description)
                  .addTo(map);
              } else {
                console.error('Invalid coordinates format');
              }
            })
            .catch((error) => {
              console.error('Error fetching moment:', error);
            });
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

<style>
  #map {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
