$(document).ready(function () {
  $("#navbar").load("./Navbar.html");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userList = JSON.parse(localStorage.getItem("userList")) || [];
  const user = userList.find((u) => u.id === loggedInUser.id);
  if (user) {
    $("#firstnameInput").val(user.name.firstname);
    $("#lastnameInput").val(user.name.lastname);
    $("#emailInput").val(user.email);
    $("#usernameInput").val(user.username);
    $("#phoneInput").val(user.phone);
    $("#cityInput").val(user.address.city);
    $("#stateInput").val(user.address.state);
    $("#streetInput").val(user.address.street);
    $("#zipcodeInput").val(user.address.zipcode);
  }

  const originUrl = sessionStorage.getItem("profileEditOrigin");

  $("#profile-form").on("submit", function (event) {
    event.preventDefault();
    $(".saveChanges").html(
      ` <i class="fa-solid fa-spinner fa-spin-pulse"></i>`
    );

    user.name.firstname = $("#firstnameInput").val();
    user.name.lastname = $("#lastnameInput").val();
    user.phone = $("#phoneInput").val();
    user.address.city = $("#cityInput").val();
    user.address.state = $("#stateInput").val();
    user.address.street = $("#streetInput").val();
    user.address.zipcode = $("#zipcodeInput").val();

    const updatedUserList = userList.map((u) => (u.id === user.id ? user : u));
    localStorage.setItem("userList", JSON.stringify(updatedUserList));
    setTimeout(() => {
      $(".saveChanges").html("Saved Changes");
      if (originUrl) {
        window.location.href = originUrl;
        sessionStorage.removeItem("profileEditOrigin"); 
      } else {
        createAlert("Changes Saved")
        window.location.href = "/task_7/index.html";
      }
    }, 2000);
  });
});
function createAlert(message) {
  $("#notify-box").addClass("show");
  $("#notify-box").text(message);
 
    $("#notify-box").css("background-color", "#039dfd");
 
  setTimeout(() => {
    $("#notify-box").removeClass("show");
  }, 1500);
}