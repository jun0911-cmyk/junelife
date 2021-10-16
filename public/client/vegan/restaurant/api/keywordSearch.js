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
    alert("키워드 검색결과가 존재하지 않습니다.");
    message.innerText = "반경내의 검색결과가 없습니다.";
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert("키워드 검색도중 오류가 발생하였습니다.");
    message.innerText = "검색 오류가 발생하였습니다.";
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
      title: "키워드로 검색하기",
      text: "검색하실 키워드를 입력주세요.",
      input: "text",
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        searchKeyword(result.value);
        message.innerText = "지도에서 키워드 검색중입니다.";
      }
    });
  });
};

export default keywordInput;
