$(() => {
  //Password visibility toggler
  $(".fa-eye-slash").on("click", () => {
    $(".fa-eye-slash").toggleClass("fa-eye");
    var inputField = $("#passInput");
    if (inputField.attr("type") === "password") {
      inputField.attr("type", "text");
    } else {
      inputField.attr("type", "password");
    }
  });

  //Login form submit handler

  $("#login-form").on("submit", (e) => {
    e.preventDefault();
  
    $("#login-btn").html(`<i class="fa-solid fa-spinner fa-spin-pulse"></i>`);
  
    const email= $("#emailInput").val();
    const password = $("#passInput").val();
  
    if (!email || !password) {
      $("#notify-box").append(`<p>Enter Email and Password</p>`);
      return;
    }
  
    
    const userList = JSON.parse(window.localStorage.getItem("userList")) || [];
  
    
    const foundUser = userList.find(user => user.email === email);
  
   
    if (!foundUser || foundUser.password !== password) {
      setTimeout(() => {
        $("#login-btn").html("Log In");
        createAlert("Username or Password is incorrect", "error");
       
      }, 1000)
      
      return;
    }
  
    // Store username and ID in local storage
    window.localStorage.setItem("loggedInUser", JSON.stringify({
      email: foundUser.email,
      id: foundUser.id 
    }));
    
  setTimeout(()=>{
    createAlert("Login successful", "success");
    $("#login-form").trigger("reset");
    $("#login-btn").html("Log In");
  },500)
    setTimeout(() => {
      window.location.href = "/task_7/index.html";
    }, 2000);
  });
});
function createAlert(message, type = "success") {
  $("#notify-box").addClass("show");
  $("#notify-box").text(message);
  if (type == "success") {
    $("#notify-box").css("background-color", "rgb(34,179,58)");
  } else {
    $("#notify-box").css("background-color", "rgb(247, 46, 42)");
  }
  setTimeout(() => {
    $("#notify-box").removeClass("show");
  }, 2000);
}
