<script lang="ts">
	import { PUBLIC_MAP_BOX_ACCESS_TOKEN } from '$env/static/public';
	import { cn } from '$lib/utils';
	import { CloudCog } from 'lucide-svelte';
	import * as mapbox from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { onDestroy, onMount } from 'svelte';

	type MapProps = {
		lat?: number;
		lng?: number;
		zoom?: number;
		class?: string;
		userGeoLocate?: mapbox.GeolocateControl;
		enableUserGeoLocateControl?: boolean;
		enableMarkerControl?: boolean;
		setMarkerOnCenter?: boolean;
		onLocateUser?: (lat: number, lng: number) => void;
		onPointMarked?: (lat: number, lng: number) => void;
	};

	let {
		lat = -8.67051542691687,
		lng = 115.2126361637056,
		zoom = 10,
		class: className,
		userGeoLocate = $bindable(),
		enableUserGeoLocateControl = false,
		enableMarkerControl = false,
		setMarkerOnCenter = false,
		...prop
	}: MapProps = $props();

	let mapContainer = $state<HTMLDivElement>();
	let map = $state<mapbox.Map>();
	let marker: mapbox.Marker;

	const _userGeoLocate = new mapbox.GeolocateControl({
		positionOptions: {
			enableHighAccuracy: true
		},
		trackUserLocation: true,
		showUserHeading: true
	});

	function addMarker(longLat: [number, number]) {
		if (map) {
			marker.setLngLat(longLat).addTo(map);
		}
	}

	const fullScreenControl = new mapbox.FullscreenControl();

	onMount(() => {
		if (mapContainer) {
			map = new mapbox.Map({
				container: mapContainer,
				accessToken: PUBLIC_MAP_BOX_ACCESS_TOKEN,
				center: [lng, lat],
				zoom: zoom,
				style: 'mapbox://styles/mapbox/streets-v12',
				cooperativeGestures: true,
				attributionControl: false
			});

			marker = new mapbox.Marker();

			if (setMarkerOnCenter) {
				marker.setLngLat([lng, lat]).addTo(map);
			}

			if (enableUserGeoLocateControl) {
				map.addControl(_userGeoLocate);
			}

			userGeoLocate = _userGeoLocate;

			map.addControl(fullScreenControl);

			_userGeoLocate.on('geolocate', (e) => {
				const { coords } = e;
				const { latitude, longitude } = coords;
				prop.onLocateUser?.(latitude, longitude);
			});

			map.on('click', (e) => {
				if (enableMarkerControl) {
					addMarker([e.lngLat.lng, e.lngLat.lat]);
					prop.onPointMarked?.(e.lngLat.lat, e.lngLat.lng);
				}
			});
		}
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div class={cn('map-container', className)}>
	<div class="map" bind:this={mapContainer}></div>
</div>

<style scoped>
	.map-container {
		position: relative;
		width: 100%;
		height: 600px;
	}

	.map {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	@media (max-width: 768px) {
		.map-container {
			height: 300px;
		}
	}
</style>
