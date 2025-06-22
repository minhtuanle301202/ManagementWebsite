<template>
    <div id="map"></div>
    <button @click="goBack" class="back-button">
       Quay lại trang Admin
      </button>
      <div class="action-buttons">
        <button @click="undoPoint">↩️ Undo</button>
        <button @click="resetMap">🔄 Reset</button>
        <button v-if="points.length === 5" @click="savePoints">💾 Lưu</button>
    </div>
  </template>
  
<script setup>
import { ref,onMounted } from 'vue';
import { useRouter,useRoute} from 'vue-router'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAreaByCardId } from '@/API';

// Import ảnh thủ công từ node_modules
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Cập nhật đường dẫn ảnh cho icon mặc định của Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


let router = useRouter();
const route = useRoute();
let map;
let points = ref([]);
let markers = [];
let polygonLayer = null;

const cardId = route.query.cardId;

const drawPolygonFromCardId = async (map) => {
  try {
    const formInfor = JSON.parse(localStorage.getItem('formInfor'));
    points.value = formInfor.points;
    for (const point of points.value) {
        let latlng = [point[0],point[1]];
        let marker = L.marker(latlng).addTo(map);
        markers.push(marker);
    }
    drawPolygon();
  } catch (err) {
    console.log(err);
  }
}

onMounted(async () => {
    map = L.map('map', {
        zoomControl: false,
    }).setView([21.023673526885734, 106.07685094914261], 13);

    L.control.zoom({
        position: 'topleft'
    }).addTo(map);
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        osm.addTo(map);
    map.on('click',onMapClick);
    
    if (cardId) {
        drawPolygonFromCardId(map);
    }
    
})


const onMapClick = (e) => {
    if (points.value.length < 5) {
        let latlng = [e.latlng.lat, e.latlng.lng];
        points.value.push(latlng);
        let marker = L.marker(e.latlng).addTo(map);
        markers.push(marker);

        if (points.value.length === 5) {
            drawPolygon();
        }
    }
}

const drawPolygon = () => {
    if (polygonLayer) {
        map.removeLayer(polygonLayer);
        polygonLayer = null;
    }

    const closedPoints = [...points.value, points.value[0]];

    polygonLayer = L.polygon(closedPoints, {
        color: '#03bafc',
        fillColor: '#3399ff',
        fillOpacity: 0.3
    }).addTo(map);
}

const resetMap = (e) => {
    L.DomEvent.stopPropagation(e);
    points.value = [];
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    if (polygonLayer) {
        map.removeLayer(polygonLayer);
        polygonLayer = null;
    }
}

const undoPoint = (e) => {
    L.DomEvent.stopPropagation(e);
    if (points.value.length > 0) {
        points.value.pop();
    }
    let marker = markers.pop();
    if (marker) map.removeLayer(marker);

    if (polygonLayer) {
        map.removeLayer(polygonLayer);
        polygonLayer = null;
    }
}

const savePoints =() => {
    const formInfor = JSON.parse(localStorage.getItem('formInfor'));
    formInfor.points = points.value;
    localStorage.setItem('formInfor',JSON.stringify(formInfor));
    if (cardId) {
        router.push({
            path: `/edit-user/${cardId}`,
            state: {
                from: 'edit-user-map'
            }
        })
    } else {
        router.push({
            path: '/create-user',
            state: {
                from: 'create-user-map'
            }
        });
    }
}

const goBack =() => {
    if (cardId) {
        router.push({
            path: `/edit-user/${cardId}`,
            state: {
                from: 'edit-user-map'
            }
        })
    } else {
        router.push({
            path: '/create-user',
            state: {
                from: 'create-user-map'
            }
        });
    }
}

</script>
  
  <style>
  .action-buttons {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.action-buttons button {
  padding: 10px 16px;
  background-color: #ffffffdd;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.action-buttons button:hover {
  background-color: #f0f0f0;
}

</style> 
  