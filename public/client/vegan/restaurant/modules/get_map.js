import marker from "../api/setMarker.js";

let restData = {};

const setMarker = (latlng) => {
  const src =
    "https://i.pinimg.com/originals/71/c8/06/71c806428f9d8c76f8dd491ee177382c.png";
  const size = new kakao.maps.Size(36, 37);
  const imageOption = { offset: new kakao.maps.Point(13, 37) };
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
