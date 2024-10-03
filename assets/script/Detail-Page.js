$(document).ready(function () {
  let customerReviews =(localStorage.getItem('customerReviews')) || [];
  const Creviews = [
    {
      name: "John Doe",
      date: "2024-05-20",
      text: "This product is amazing! It exceeded my expectations and I would highly recommend it to anyone.",
      rating: 5,
    },
    {
      name: "Jane Smith",
      date: "2024-04-15",
      text: "Good value for the price. The quality is decent and it works as described.",
      rating: 4,
    },
  
  ];

  // Store default reviews in local storage if there are no reviews yet
  if (customerReviews.length === 0) {
    window.localStorage.setItem("customerReviews",JSON.stringify(Creviews));
    customerReviews = Creviews; 
  } else {
    customerReviews = JSON.parse(localStorage.getItem('customerReviews'));
  }

  $("#nav-placeholder").load("./Navbar.html");
 
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("productId")
 
  let product;

  // Fetch product details from API
  $.ajax({
    url: "https://fakestoreapi.com/products/" + productId,
    dataType: "json",
    success: function (data) {
      product = data;
      displayProduct(data);
      checkUserReview()
      displayReviews();
     
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error:", textStatus, errorThrown);
      $("#product_detail").html("<p>Error fetching product details!</p>");
    },
  });

  function displayProduct(product) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let userWishlist = user ? wishlist[user.id] || [] : [];
    let userCart = user ? cart[user.id] || [] : [];

    let isInWishlist = userWishlist.includes(product.id.toString());
    let cartItem = userCart.find(cartItem => cartItem.productId === product.id);
    let quantity = cartItem ? cartItem.quantity : 0;

    const productDetails = `
      <div class="product-container">
       <div class="imgDiv">
          <img src="${product.image}" alt="${product.title}" class="productImg"/>
       </div>
       <div class="contentDiv">
          <h2 class="product-title">${product.title}</h2>
          <p class="product-category">${product.category}</p>
          <div class="priceDiv">
          <p class="price-label">Price </p>
          <div class="price">
          <p class="price-amount">$&nbsp${product.price}</p>
          <del style="color:red">$&nbsp${Math.ceil(product.price * 1.3)}</del>
          </div>
         
          <p class="discount"> 30% OFF &nbsp; <i class="fa-solid fa-tag"></i></p>
      </div>
          <p class="product-description"> ${product.description}</p>
          <p class="product-rating">
             <i class="fas fa-star"></i> ${product.rating.rate} 
             <span class="vertical-line"></span> 
             ${product.rating.count} ratings
          </p>
       
        <div class="buttonDiv">
            <button class="cart-button"></i>Add to Cart</button>
            <button class="wishlist-button">  <i class="fa-regular fa-heart ${isInWishlist ? "wishlist-blue" : ""}"></i>WISHLIST</button>
        </div>
    </div>
     </div>`;

    $("#product_detail").html(productDetails);
     
  // Cart button click handler 
  $('.cart-button').click( function() {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      window.location.href = "./Template/Login.html";
      return;
    }
    let cart = JSON.parse(localStorage.getItem("cart")) || {};
  
    cart[user.id] = cart[user.id] || [];
    let cartItem = cart[user.id].find(item => item.productId === productId);

    if (cartItem) {
      
      cartItem.quantity += 1;
    } else {
      
      cart[user.id].push({ productId: productId, quantity: 1 });
    }

    let newQuantity = cartItem ? cartItem.quantity : 1;
    createAlert("Product added to your shopping bag.");
    localStorage.setItem("cart", JSON.stringify(cart));
  });
   
  

  // Wishlist button click handler
  $('.wishlist-button').on('click',  function () {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      window.location.href = "./Template/Login.html";
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
    wishlist[user.id] = wishlist[user.id] || [];

    if (!wishlist[user.id].includes(productId)) {
     
      wishlist[user.id].push(productId);
      $(this).find("i").addClass("fa-solid wishlist-blue");
      createAlert("Product added to your wishlist.");

    } else {
      
      wishlist[user.id] = wishlist[user.id].filter(id => id !== productId);
      $(this).find("i").removeClass("wishlist-blue");
      createAlert("Product removed from your wishlist.");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  })

  }

  function checkUserReview() {
    const userDetails = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!userDetails) {
      return;
    }
    const userReview = customerReviews.find(review => review.productId === productId && review.name === userDetails.email);
    if (userReview) {
      $(".review-form").hide(); 
    } else {
      
      $(".review-form").show(); 
    }
  }


  let selectedRating = 0;
  //Funcition to render the customer reviews
  function displayReviews() {
    const reviewList = $("#review-list");
    reviewList.empty();

    $.each(customerReviews, function (index, item) {
        let reviewHtml = `
        <div class="review">
            <p class="reviewer-name">${item.name}</p>
            <p class="review-rating"><i class="fas fa-star"></i> ${item.rating}</p>
           
            <p class="review-text">${item.text}</p>
            <p class="review-date">${item.date}</p>
        </div>`;
       $(reviewList).append(reviewHtml);
    });
}

// Handle star click event
$(".star").click(function () {
  selectedRating = $(this).val();
  $(".star").each(function (index, element) {
      if (index < selectedRating) {
          $(element).addClass("filled").removeClass("fa-star-o").addClass("fa-star");
      } else {
          $(element).removeClass("filled").removeClass("fa-star").addClass("fa-star-o");
      }
  });
});

// Handle review submission
$(".submit-btn").click(function () {
  const userDetails = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!userDetails) {
    createAlert("Please log in to submit a review.");
     
      return;
  }

  const reviewText = $(".userReview").val();
  const reviewDate = new Date().toISOString().split('T')[0];

  if (!reviewText) {
    createAlert("Please write a review before submitting.");
      return;
  }

  const review = {
      name: userDetails.email,
      date: reviewDate,
      text: reviewText,
      rating: selectedRating,
      productId: productId
  };

  customerReviews.push(review);
  localStorage.setItem('customerReviews', JSON.stringify(customerReviews));
  createAlert("Review submitted successfully.");
  displayReviews();
  $(".stars .star").removeClass("filled fa-star").addClass("fa-star-o");
  $(".review-text").val("");
  $(".review-form").hide();
});



// Function to check if the user has already reviewed this product
function checkUserReview() {
  const userDetails = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!userDetails) {
      return;
  }
  const userReview = customerReviews.find(review => review.productId === productId && review.name === userDetails.email);
  if (userReview) {
      $(".review-form").hide();
  } else {
      $(".review-form").show();
  }
}



});
function createAlert(message) {
  $("#notify-box").addClass("show");
  $("#notify-box").text(message);
 
    $("#notify-box").css("background-color", "#039dfd");
 
  setTimeout(() => {
    $("#notify-box").removeClass("show");
  }, 1500);
}