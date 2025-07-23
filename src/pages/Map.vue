<template>
  <div class="map-container">
    <div ref="mapContainer" class="ol-map"></div>
    <div class="info-panel">
      <p v-if="clickedCoord">Clicked coordinates: {{ clickedCoord }}</p>
      <p v-else>Click on the map to select a location in Rwanda.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { fromLonLat, toLonLat } from 'ol/proj'
import { defaults as defaultControls } from 'ol/control'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Style, Icon } from 'ol/style'

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<Map | null>(null)
const clickedCoord = ref<string | null>(null)

// Rwanda's approximate center
const rwandaCenter = fromLonLat([29.9189, -1.9403])

onMounted(() => {
  // Create the map
  map.value = new Map({
    target: mapContainer.value as HTMLElement,
    layers: [
      new TileLayer({ source: new OSM() })
    ],
    view: new View({
      center: rwandaCenter,
      zoom: 8,
      minZoom: 7,
      maxZoom: 14
    }),
    controls: defaultControls()
  })

  // Add a marker at the center of Rwanda
  const marker = new Feature({ geometry: new Point(rwandaCenter) })
  marker.setStyle(new Style({
    image: new Icon({
      src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      scale: 0.05
    })
  }))
  const vectorLayer = new VectorLayer({
    source: new VectorSource({ features: [marker] })
  })
  map.value.addLayer(vectorLayer)

  // Handle map click
  map.value.on('click', (evt) => {
    const coord = evt.coordinate
    const lonLat = toLonLat(coord)
    clickedCoord.value = `Lon: ${lonLat[0].toFixed(5)}, Lat: ${lonLat[1].toFixed(5)}`
    // Placeholder: Here you can add business logic for land selection, etc.
  })
})

onBeforeUnmount(() => {
  map.value?.setTarget(undefined)
})
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 80vh;
  margin-top: 2rem;
}
.ol-map {
  width: 90vw;
  height: 60vh;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}
.info-panel {
  background: #f8fafc;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  font-size: 1.1rem;
}
</style> 