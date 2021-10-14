import marker from "../api/setMarker.js";

let restData = {};

const setMarker = (latlng) => {
  const src =
    "https://lh3.googleusercontent.com/proxy/Hk0bwXDdIkFj-vLLlqWSxVzDC5bqkBPQ4b6DYtZEpF1jdKaJ91ERU9tAy-o-sbBIPvh2pbn5qT9ynokjlyB0bkI_c1zBoLnv-2QioJLzyDx3yAS_WG8C";
  const size = new kakao.maps.Size(64, 69);
  const imageOption = { offset: new kakao.maps.Point(27, 69) };
  const markerImage = new kakao.maps.MarkerImage(src, size, imageOption);
  marker.showListMarker(latlng, markerImage, restData);
};

const getCoords = (rest) => {
  const geocoder = new kakao.maps.services.Geocoder();
  geocoder.addressSearch(rest.address, function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      const LatLng = new kakao.maps.LatLng(result[0].y, result[0].x);
      setMarker(LatLng);
    }
  });
};

$(document).on("click", "#btn", function () {
  const getEL = $(this);
  const list = getEL.children().children();
  restData = {
    restaurant_name: list.eq(0).text(),
    restaurant_id: list.eq(2).text().split(" : ")[1],
    address: list.eq(4).text().split(" : ")[1],
    phone: list.eq(6).text().split(" : ")[1],
  };
  getCoords(restData);
});
