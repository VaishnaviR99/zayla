$(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  const URL = `https://fakestoreapi.com/products/category/${category}`;
  $("#navbar").load("./Navbar.html")

  // Function to fetch and display products
  function fetchProducts() {
      $.ajax({
          url: URL,
          dataType: "json",
          success: function(data) {
              displayProducts(data);
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log("Error:", textStatus, errorThrown);
              $("#productsList").html("<p>Error fetching data!</p>");
          }
      });
  }

  // Initial fetch of products
  fetchProducts();

  // Function to display products in cards
  const displayProducts = (products, placeholder = "#productsList") => {
      $(placeholder).empty();
      $("#categoryTitle").text(category.toUpperCase());

      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
      let user = JSON.parse(localStorage.getItem("loggedInUser"));
      let userWishlist = user ? wishlist[user.id] || [] : [];

      $.each(products, function(index, item) {
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

          $(placeholder).append(productCont);
      });

      // Click event for product image to redirect to detail page
      $(".imgDiv").on('click', function() {
          const productId = $(this).attr("key");
          localStorage.setItem("productId", productId);
          window.location.href = `./Detail-Page.html?productId=${productId}`;
      });

      // Click event for adding/removing wishlist items
      $('.addToWish').on('click', function() {
          let user = JSON.parse(localStorage.getItem("loggedInUser"));
          if (!user) {
              window.location.href = "../Template/Login.html";
              return;
          }

          let wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
          const productId = $(this).closest(".productCard").attr("key");
          wishlist[user.id] = wishlist[user.id] || [];

          if (!wishlist[user.id].includes(productId)) {
              // Add product to wishlist
              wishlist[user.id].push(productId);
              createAlert("Product added to wishlist.");
              $(this).find("i").addClass("wishlist-blue");
          } else {
              // Remove product from wishlist
              wishlist[user.id] = wishlist[user.id].filter(id => id !== productId);
              createAlert("Product removed from wishlist.");
              $(this).find("i").removeClass("wishlist-blue");
          }

          localStorage.setItem("wishlist", JSON.stringify(wishlist));
      });
  };

  // Function for sorting products
  function sortProducts(products, criteria) {
      switch (criteria) {
          case 'priceLowHigh':
              return products.sort((a, b) => a.price - b.price);
          case 'priceHighLow':
              return products.sort((a, b) => b.price - a.price);
          case 'ratingHighLow':
              return products.sort((a, b) => b.rating.rate - a.rating.rate);
          case 'ratingLowHigh':
              return products.sort((a, b) => a.rating.rate - b.rating.rate);
          default:
              return products;
      }
  }

  // Handle sorting option change
  $('#sort-options').change(function() {
      const sortCriteria = $(this).val();
      $.ajax({
          url: URL,
          dataType: "json",
          success: function(data) {
              const sortedProducts = sortProducts(data, sortCriteria);
              displayProducts(sortedProducts);
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log("Error:", textStatus, errorThrown);
              $("#productsList").html("<p>Error fetching data!</p>");
          }
      });
  });

  // Function for back to top button
  const scrollToTopBtn = $("#scrollToTopBtn");

  $(window).scroll(function() {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 300) {
          scrollToTopBtn.css("display", "block");
      } else {
          scrollToTopBtn.css("display", "none");
      }
  });

  scrollToTopBtn.on("click", function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
  