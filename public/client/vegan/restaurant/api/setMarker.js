/*const getLatLngList = [];

const showMarker = (map, lat, lon) => {
  getLatLngList.forEach((latlng, index) => {
    const coords = new kakao.maps.LatLng(latlng.y, latlng.x);
    const marker = new kakao.maps.Marker({
      map: latlng.map,
      position: coords,
    });
    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="width:150px;text-align:center;padding:6px 0;">${latlng.restaurant_name}</div>`,
    });
    infowindow.open(map, marker);
    if (getLatLngList.length == index) {
      const mycoords = new kakao.maps.LatLng(lat, lon);
      map.setCenter(mycoords);
    }
  });
};

const setMarker = (data, map, len, lat, lon) => {
  const geocoder = new kakao.maps.services.Geocoder();
  geocoder.addressSearch(data.address, function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      getLatLngList.push({
        y: result[0].y,
        x: result[0].x,
        restaurant_name: data.restaurant_name,
        map: map,
      });
      if (getLatLngList.length == len - 15) {
        showMarker(map, lat, lon);
      }
    }
  });
};

const getRows = (rowsList, map, lat, lon) => {
  rowsList.forEach((rows) => {
    setMarker(rows, map, rowsList.length, lat, lon);
  });
};*/

const getMapData = async (map, lat, lon) => {
  console.log(1);
  /*
  const getRecipe = await $.post("/rest/get");
  if (getRecipe.status == true) {
    getRows(getRecipe.data, map, lat, lon);
  }*/
};

export default getMapData;
