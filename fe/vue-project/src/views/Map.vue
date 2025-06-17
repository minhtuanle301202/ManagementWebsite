<template>
  <div id="map"></div>
  <button @click="goBack" class="back-button">
     Quay lại trang Admin
    </button>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import {useRoute,useRouter} from 'vue-router'; 
import { getAreaByCardId } from '@/API';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const route = useRoute();
const router = useRouter();
const cardId = route.params.id;
let polygonLayer = null;
let points = [];

const drawPolygon = async (cardId,map) => {
  try {
    const res = await getAreaByCardId(cardId);
    points = res;
    if (polygonLayer) map.removeLayer(polygonLayer); // Xóa đa giác cũ nếu có
    points = [...points,points[0]];
    polygonLayer = L.polygon(points).addTo(map).bindPopup("Khu vực cần giám sát");
  } catch (err) {
    console.log(err);
  }
}

onMounted(() => {
    const map = L.map('map', {
      zoomControl: false,
    }).setView([21.023673526885734, 106.07685094914261], 13);

    L.control.zoom({
      position: 'topleft'
    }).addTo(map);
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        osm.addTo(map);
        drawPolygon(cardId,map);

        let {lat,lng} = route.query;
        lat = parseFloat(lat);
        lng = parseFloat(lng);
    L.marker([lat, lng]).addTo(map).bindPopup("Vị trí của đối tượng").openPopup();
})

const goBack =() => {
    router.push({path: '/locations'});
}

</script>

<style>
#map {
    height: 100vh;
    width: 100%;
        }
.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000; 
  padding: 10px 16px;
  background-color: #ffffffdd;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  font-weight: 500;

}

.back-button:hover {
  background-color: #f0f0f0;
}

.leaflet-top.leaflet-left {
  top: 50px; 
  left: 5px;
}
</style> 
