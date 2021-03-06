import component from "../modules/mapList.js";

const keywordSearch = document.getElementById("keyword_btn");
const message = document.getElementById("message");

let markers = [];
let distanceOverlay = 0;
let defaultLength = 0;

const addMarker = (idx, poistion) => {
  const src =
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
  const size = new kakao.maps.Size(36, 37);
  const options = {
    spriteSize: new kakao.maps.Size(36, 691),
    spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
    offset: new kakao.maps.Point(13, 37),
  };
  const markerImage = new kakao.maps.MarkerImage(src, size, options);
  const marker = new kakao.maps.Marker({
    map: window.map,
    position: poistion,
    image: markerImage,
  });
  marker.setMap(window.map);
  markers.push(marker);
};

const removeList = () => {
  while (document.getElementById("data").hasChildNodes()) {
    document
      .getElementById("data")
      .removeChild(document.getElementById("data").lastChild);
  }
};

const removeMarker = () => {
  markers.forEach((mark) => {
    mark.setMap(null);
  });
  markers = [];
};

const convert = (place) => {
  return {
    restaurant_name: place.place_name,
    restaurant_id: place.id,
    address: place.address_name,
    phone: place.phone,
  };
};

const checkLength = (place, position, bounds, index) => {
  const polyline = new kakao.maps.Polyline({
    path: [window.LatLng, position],
  });
  const minDistance = polyline.getLength();
  distanceOverlay = Math.round(minDistance);
  if (distanceOverlay <= defaultLength) {
    component(place);
    addMarker(index, position);
    bounds.extend(position);
  }
};

const displayPlaces = (places) => {
  $("#notfound").hide();
  removeMarker();
  removeList();
  defaultLength = localStorage.getItem("search");
  const bounds = new kakao.maps.LatLngBounds();
  places.forEach((place, index) => {
    console.log(place);
    const position = new kakao.maps.LatLng(place.y, place.x);
    const convertPlace = convert(place);
    checkLength(convertPlace, position, bounds, index);
  });
};

const successKeyword = (data, status, pagination) => {
  if (status === kakao.maps.services.Status.OK) {
    displayPlaces(data, window.map);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert("????????? ??????????????? ???????????? ????????????.");
    message.innerText = "???????????? ??????????????? ????????????.";
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert("????????? ???????????? ????????? ?????????????????????.");
    message.innerText = "?????? ????????? ?????????????????????.";
  }
};

const searchKeyword = (value) => {
  const ps = new kakao.maps.services.Places();
  ps.keywordSearch(value, successKeyword, {
    location: window.LatLng,
  });
};

const keywordInput = (map) => {
  keywordSearch.addEventListener("click", (e) => {
    Swal.fire({
      title: "???????????? ????????????",
      text: "???????????? ???????????? ???????????????.",
      input: "text",
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        searchKeyword(result.value);
        message.innerText = "???????????? ????????? ??????????????????.";
      }
    });
  });
};

export default keywordInput;
