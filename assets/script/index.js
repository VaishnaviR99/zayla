$(function () {
  let products = [];
  const URL = "https://fakestoreapi.com/products";

 
  $("nav h1").click(() => {
    window.location.href = "/task_7/index.html";
  });
  $(".profile-modal").hover(function () {
    $(".fa-user").css("border-bottom", "3px solid  #7DEDFF");
  });

  const userDetails = JSON.parse(localStorage.getItem("loggedInUser"));
  // Show/hide user actions based on local storage
  if (userDetails) {
    $(".user-actions1").hide();
    $(".user-actions2 .username").text(userDetails.email);
    $(".user-actions2").show();
  } else {
    $(".user-actions1").show();
    $(".user-actions2").hide();
  }

  //Edit profile onclick event
  $("#edit-profile-btn").on("click", function () {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
         
      window.location.href = "./assets/Template/Redirect_Login.html";
      
          return;
        }
    window.location.href = "./assets/Template/EditProfile.html";
  })
  $("#contact-us-btn").on("click", function () {
   
    window.location.href = "./assets/Template/Contact-Us.html";
  })

  //redirect to wishlist page
  $('#wishlist-btn').on('click',  function () {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
         
      window.location.href = "./assets/Template/Redirect_Login.html";
      
          return;
        }
    window.location.href = "./assets/Template/Wishlist.html";
  })
  //redirect to orders page
  $('#orders-btn').on('click',  function () {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
         
      window.location.href = "./assets/Template/Redirect_Login.html";
      
          return;
        }
    window.location.href = "./assets/Template/Orders.html";
  })

   // Handle login/signup button
   $("#login-btn").on("click", function () {
    console.log("Login");
    window.location.href = "./assets/Template/login.html";
  });
  // Handle About us button
  $("#about-us-btn").on("click", function () {
       
    window.location.href = "./assets/Template/About-us.html";
  });
    // Handle FAQ button
    $("#FAQ-btn").on("click", function () {
      console.log("Login");
      window.location.href = "./assets/Template/FAQ.html";
    });

  //handle cart icon  on click event
  $(".fa-bag-shopping").click(function () {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
         
      window.location.href = "./assets/Template/Redirect_Login.html";
      
          return;
        }
    window.location.href = "./assets/Template/Cart.html";
  });

  //handle wishlist icon on click event
  $(".fa-heart").click(function () {
   let user = JSON.parse(localStorage.getItem("loggedInUser"));
   if (!user) {
         
    window.location.href = "./assets/Template/Redirect_Login.html";
    
        return;
      }
    window.location.href = "./assets/Template/Wishlist.html";
  });

  $("#logout-btn").click(function () {
    localStorage.removeItem("loggedInUser");
    $(".user-actions1").show();
    $(".user-actions2").hide();
    window.location.href = "/task_7/index.html";
  });

  //   AJAX request for products data
  $.ajax({
    url: URL,
    dataType: "json",
    success: function (data) {
      products = data;
      
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error:", textStatus, errorThrown);
      $("#productsList").html("<p>Error fetching data!</p>");
    },
  });


 // Function to display products in cards
 const displayProducts = (filteredProducts, placeholder = "#productsList") => {
  $(placeholder).empty();
   
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  let userWishlist = user ? wishlist[user.id] || [] : [];

  $.each(filteredProducts, function (index, item) {
    let isInWishlist = userWishlist.includes(item.id.toString());
    let productCont = `
      <div class="productCard" key=${item.id}>
        <div class="imgDiv" key=${item.id}>
            <div class="rating"><i class="fa-solid fa-star"></i><p>${item.rating.rate}</p></div>
            <img src=${item.image} alt=${item.name} loading="lazy" class="lazy"/>
        </div>
        <div class="priceDiv"> 
           <p>Price</p>
           <p>&dollar; &nbsp;${item.price}</p>
        </div>
        <p class="title">${item.title}</p>
        <button class="addToWish">
          <i class="fa-solid fa-heart ${isInWishlist ? "wishlist-blue" : ""}"></i>
        </button>
      </div>`;
$(".searchRes").show();

    $(placeholder).append(productCont);
  });


  //click event for search product 
  $(".searchRes i").click(function(){
    $(".searchRes").hide();
    $(placeholder).empty();
  })
  // click event for product image to redirect to detail page
  $(".imgDiv").on('click', function () {
    const productId = $(this).attr("key");
    window.location.href = `./assets/Template/Detail-Page.html?productId=${productId}`;
  });

  //  click event for adding/removing wishlist items
  $('.addToWish').on('click',  function () {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      window.location.href = "./assets/Template/Login.html";
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
    const productId = $(this).closest(".productCard").attr("key");
    wishlist[user.id] = wishlist[user.id] || [];

    if (!wishlist[user.id].includes(productId)) {
      // Add product to wishlist
      wishlist[user.id].push(productId);
      $(this).find("i").addClass("wishlist-blue");

    } else {
      // Remove product from wishlist
      wishlist[user.id] = wishlist[user.id].filter(id => id !== productId);
      $(this).find("i").removeClass("wishlist-blue");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  })
}

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

// Search functionality
const searchProducts = debounce((searchTerm) => {
  if (!searchTerm) {
    return;
  }
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (filteredProducts.length === 0) {
    $("#noResults").show(); 
  } else {
    $("#noResults").hide();
  }
  displayProducts(filteredProducts); 
}, 200); 

// Search input event handler
$("#searchInput").on("keyup", function() {
  
  const searchTerm = $(this).val();
  searchProducts(searchTerm);
});



  //Function for back to top button
  const scrollToTopBtn = $("#scrollToTopBtn");

  $(window).scroll(function () {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 300) {
      scrollToTopBtn.css("display", "block");
    } else {
      scrollToTopBtn.css("display", "none");
    }
  });

  scrollToTopBtn.on("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  
 

  $(".grid-item").click(function (event) {
    event.preventDefault();
    const dataValue = $(this).data("value");
    window.location.href = `./assets/Template/ProductPage.html?category=${dataValue}`;
  });


   // Function to handle slide transition
  const sliderContainer = $(".slider-container");
  const sliderItems = $(".slider-item");
  const totalSlides = sliderItems.length;

  let currentSlide = 0;

 
  const showSlide = function (slideIndex) {
    sliderContainer.css("transform", `translateX(-${slideIndex * 100}%)`); 
    currentSlide = slideIndex;
  };

  
  setInterval(function () {
    currentSlide = (currentSlide + 1) % totalSlides; 
    showSlide(currentSlide);
  }, 5000);


  // Function to update badges
  function updateBadges() {
    console.log("badge");
    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    let userCart = cart[user.id] || [];

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
    let userWishlist = wishlist[user.id] || [];

    const cartLength = userCart.length;
    const wishlistLength = userWishlist.length;

    if (cartLength > 0) {
      $("#cart-badge").text(cartLength).show();
    } else {
      $("#cart-badge").hide();
    }

    if (wishlistLength > 0) {
      $("#wishlist-badge").text(wishlistLength).show();
    } else {
      $("#wishlist-badge").hide();
    }
  }

  // Initial badge update
  updateBadges();
});
