const component = (recipe) => {
  $("#data").append(`
    <div id="mainList">
      <hr>
        <a href="#" id="btn">
            <div class="list" id="list">
                <span id="name">${recipe.restaurant_name}</span><br>
                <span>음식점 ID : ${recipe.restaurant_id}번</span><br>
                <span>주소 : ${recipe.address}</span><br>
                <span>연락처 : ${recipe.phone}</span>
            </div>
        </a>
      <hr>
    </div>
    `);
};

export default component;
