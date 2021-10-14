import api_key from "./api_key.js";
import setMarker from "./setMarker.js";

const showMap = (lat, lon) => {
  const mapElement = document.getElementById("map");
  const mapOption = {
    center: new kakao.maps.LatLng(lat, lon),
    level: 3,
  };
  const map = new kakao.maps.Map(mapElement, mapOption);
  setMarker(map, lat, lon);
};

const getGps = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      showMap(lat, lon);
    });
  }
};

const createMap = () => {
  const { kakao } = window;
  kakao.maps.load(() => {
    getGps();
  }, []);
};

const loadApi = () => {
  const key = api_key.key;
  const script = document.getElementById("api");
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${key}&libraries=services,clusterer,drawing`;
  script.onload = () => {
    createMap();
  };
};

export default loadApi;
