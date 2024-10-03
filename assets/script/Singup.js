$(document).ready(function () {
  var currentTab = 0;
  showTab(currentTab);

  function showTab(n) {
    var x = $(".tab");
    $(x[n]).fadeIn();
    if (n == 0) {
      $("#prevBtn").hide();
    } else {
      $("#prevBtn").show();
    }
    if (n == x.length - 1) {
      $("#nextBtn").hide();
      $("#signup-btn").show();
    } else {
      $("#nextBtn").show();
      $("#signup-btn").hide();
    }
    fixStepIndicator(n);
  }

  function nextPrev(n) {
    var x = $(".tab");
    if (n == 1 && !validateForm()) return false;
    $(x[currentTab]).hide();
    currentTab = currentTab + n;
    //   if (currentTab >= x.length) {
    //       $("#regForm").submit();
    //       return false;
    //   }
    showTab(currentTab);
  }

  function validateForm() {
    var x,
      y,
      i,
      valid = true;
    x = $(".tab");
    y = $(x[currentTab]).find("input");

    for (i = 0; i < y.length; i++) {
      if (y[i].value == "") {
        $(y[i]).addClass("invalid");
        valid = false;
      } else {
        $(y[i]).removeClass("invalid");

        // Add validation checks for email, mobile number, and password pattern

        if ($(y[i]).attr("id") === "emailInput") {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(y[i].value)) {
            $(y[i]).addClass("invalid");
            valid = false;
            createAlert("Enter correct Email format", "error");
          }
        }
        if ($(y[i]).attr("id") === "phoneInput") {
          var mobileRegex = /^\d{10}$/;
          if (!mobileRegex.test(y[i].value)) {
            $(y[i]).addClass("invalid");
            valid = false;
            createAlert("Enter valid Mobile No", "error");
          }
        }

      
      }
    }

    // Check email uniqueness before proceeding
    if (currentTab == 1) {
      console.log(currentTab);
      const email = $("#emailInput").val();
      let userList = JSON.parse(window.localStorage.getItem("userList")) || [];
      if (userList.some((user) => user.email === email)) {
        $("#emailInput").addClass("invalid");
        valid = false;
        createAlert("User already present with this email", "error");

        return false;
      } else {
        $("#emailInput").removeClass("invalid");
      }
    }

   

    if (valid) {
      $(".step").eq(currentTab).addClass("finish");
    }
    return valid;
  }

  function fixStepIndicator(n) {
    var x = $(".step");
    x.removeClass("active");
    $(x[n]).addClass("active");
  }

  $(".fa-eye-slash").on("click", () => {
    $(".fa-eye-slash").toggleClass("fa-eye");
    var inputField = $("#ConfirmpassInput");
    if (inputField.attr("type") === "password") {
      inputField.attr("type", "text");
    } else {
      inputField.attr("type", "password");
    }
  });

  $("#nextBtn").click(function () {
    nextPrev(1);
  });

  $("#prevBtn").click(function () {
    nextPrev(-1);
  });

  $("#regForm").on("submit", function (e) {
    e.preventDefault();
    $("#signup-btn").html(`<i class="fa-solid fa-spinner fa-spin-pulse"></i>`);
    let valid=true;
    if ($("#passInput")) {
        
        var passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (!passwordRegex.test($("#passInput").val())) {
          console.log($("#passInput").val())
        $("#passInput").addClass("invalid");
        valid = false;
        $("#signup-btn").html("Singup");
        createAlert("Password format does not match", "error");
      }
       else {
        if ($("#passInput").val() !== $("#ConfirmpassInput").val()) {
          $("#confirmPassInput").addClass("invalid");
          valid = false;
          $("#signup-btn").html("Singup");
          createAlert("Passwords do not match", "error");
        } 
        else {
          $("#confirmPassInput").removeClass("invalid");
        }
      }
    }
      if (!valid) {
     return false;
      }
      

    const user = {
      id: (Math.floor(Math.random() * (99 - 10 + 1)) + 10)
        .toString()
        .padStart(2, "0"),
      email: $("#emailInput").val(),
      username: $("#usernameInput").val(),
      password: $("#passInput").val(),
      name: {
        firstname: $("#firstnameInput").val(),
        lastname: $("#lastnameInput").val(),
      },
      address: {
        city: $("#cityInput").val(),
        state: $("#stateInput").val(),
        street: $("#streetInput").val(),
        zipcode: $("#zipcodeInput").val(),
      },
      phone: $("#phoneInput").val(),
    };

    let userList = JSON.parse(window.localStorage.getItem("userList")) || [];
    userList.push(user);
    window.localStorage.setItem("userList", JSON.stringify(userList));
    createAlert("Account created successfully.", "success");
    setTimeout(() => {
      $("#signup-btn").html("Sign Up");
      window.location.href = "./Login.html";
    }, 1000);
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
