const save_enroll_rest = () => {
  const getName = $("#rest_name").val();
  const getPhone = $("#phone").val();
  const getAddress = $("#getAddress").val();
  if (getName == "" || getPhone == "" || getAddress == "") {
    alert("모든 정보를 다 입력해주셔야합니다.");
  } else {
    $.post("/rest/save", {
      name: getName,
      phone: getPhone,
      address: getAddress,
    }).then((res) => {
      if (res.status == true) {
        alert("음식점이 등록되었습니다.");
        location.reload();
      }
    });
  }
};

export default save_enroll_rest;
