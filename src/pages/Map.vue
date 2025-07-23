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
import { supabase } from '../lib/supabase'

// Types for Supabase landpoints
interface LandPoint {
  id: number
  latitude: number
  longitude: number
  [key: string]: any
}

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<Map | null>(null)
const clickedCoord = ref<string | null>(null)

// Rwanda center
const rwandaCenter = fromLonLat([29.9189, -1.9403])

const fetchLandPoints = async (mapInstance: Map) => {
  const { data, error } = await supabase.from('land_points').select('*')
  if (error) {
    console.error('Error fetching points:', error)
    return
  }

  const features = (data as LandPoint[]).map((point) => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([point.longitude, point.latitude]))
    })

    feature.setStyle(
      new Style({
        image: new Icon({
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          scale: 0.05
        })
      })
    )

    return feature
  })

  const layer = new VectorLayer({
    source: new VectorSource({
      features
    })
  })

  mapInstance.addLayer(layer)
}

onMounted(() => {
  if (!mapContainer.value) return

  const mapInstance = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: rwandaCenter,
      zoom: 8,
      minZoom: 7,
      maxZoom: 14
    }),
    controls: defaultControls()
  })

  map.value = mapInstance

  const marker = new Feature({ geometry: new Point(rwandaCenter) })
  marker.setStyle(
    new Style({
      image: new Icon({
        src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        scale: 0.05
      })
    })
  )

  const markerLayer = new VectorLayer({
    source: new VectorSource({ features: [marker] })
  })

  mapInstance.addLayer(markerLayer)

  mapInstance.on('click', (evt) => {
    const coord = evt.coordinate
    const lonLat = toLonLat(coord)
    clickedCoord.value = `Lon: ${lonLat[0].toFixed(5)}, Lat: ${lonLat[1].toFixed(5)}`
  })

  fetchLandPoints(mapInstance)
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}
.info-panel {
  background: #f8fafc;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  font-size: 1.1rem;
}
</style>
