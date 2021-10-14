const showMarker = (map, coords, rows) => {
  glo_map = map;
  const marker = new kakao.maps.Marker({
    map: map,
    position: coords,
  });
  const infowindow = new kakao.maps.InfoWindow({
    content: `<div style="width:150px;text-align:center;padding:6px 0;">${rows.restaurant_name}</div>`,
  });
  infowindow.open(map, marker);
};

const showListMarker = (coords, image, rows) => {
  const Listmarker = new kakao.maps.Marker({
    map: window.map,
    position: coords,
    image: image,
  });
  const Listinfowindow = new kakao.maps.InfoWindow({
    content: `<div style="width:150px;text-align:center;padding:6px 0;">${rows.restaurant_name}</div>`,
  });
  Listinfowindow.open(window.map, Listmarker);
  window.map.setCenter(coords);
};

export default { showMarker, showListMarker };
