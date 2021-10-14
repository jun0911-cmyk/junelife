import marker from "./setMarker.js";
import component from "../modules/mapList.js";

let distanceOverlay = 0;
let defaultLength = 500;

var drawingCircle;

const overlay = document.getElementById("overlay");

const mapCircle = () => {
  drawingCircle = new kakao.maps.Circle({
    strokeWeight: 1,
    strokeColor: "#00a0e9",
    strokeOpacity: 0.1,
    strokeStyle: "solid",
    fillColor: "#00a0e9",
    fillOpacity: 0.2,
  });
};

const setCircle = (map, centerLatLng) => {
  const options = {
    center: centerLatLng,
    radius: defaultLength,
  };
  overlay.innerHTML = `지도 검색 반경 : ${defaultLength}m`;
  drawingCircle.setOptions(options);
  drawingCircle.setMap(map);
};

const getLength = (map, centerLatLng) => {
  window.map = map;
  $.post("/rest/get").then((rowsList) => {
    if (rowsList.status == true) {
      mapCircle();
      setCircle(map, centerLatLng);
      rowsList.data.forEach((rows) => {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(rows.address, function (result, status) {
          if (status === kakao.maps.services.Status.OK) {
            const restLatLng = new kakao.maps.LatLng(result[0].y, result[0].x);
            const polyline = new kakao.maps.Polyline({
              path: [centerLatLng, restLatLng],
            });
            const minDistance = polyline.getLength();
            distanceOverlay = Math.round(minDistance);
            if (distanceOverlay <= defaultLength) {
              component(rows);
              marker.showMarker(map, restLatLng, rows, centerLatLng);
            }
          }
        });
      });
    }
  });
};

export default getLength;
