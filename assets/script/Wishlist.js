$(() => {
  const URL = "https://fakestoreapi.com/products";
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = user.id;

  $(".navbar").load("./Navbar.html");


  $(document).on("click", ".shop", function () {
    window.location.href = "/task_7/index.html";
  });

  if (!wishlist[userId] || wishlist[userId].length === 0) {
    $("#wishlist-container").html(`
      <div class="empty">
        <img src="../media/empty.png"/>
        <p>No items in wishlist</p>
        <button class="shop">Start Adding</button>
      </div>`);
      $("#wishlist-container").css(" grid-template-columns"," repeat(1, 1fr)")
    return;
  }

  const productDetails = [];
  const promises = wishlist[userId].map(productId => {
    return $.ajax({
      url: `${URL}/${productId}`,
      dataType: "json",
      success: function (product) {
        productDetails.push(product);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error:", textStatus, errorThrown);
        $("#wishlist-container").html("<p>Error fetching product details!</p>");
      }
    });
  });

  //  display them products
  $.when(...promises).done(function () {
    displayProducts(productDetails, "#wishlist-container");
  });

  $(document).on("click", ".productCard", function () {
    const productId = $(this).attr("key");
    localStorage.setItem("productId", productId);
    window.location.href = `./Detail-Page.html?productId=${productId}`;
  });

  $(document).on("click", ".remove-item", function (event) {
    event.stopPropagation();
    const productId = $(this).closest(".productCard").attr("key");
    removeProduct(productId);
  });

  function removeProduct(productId) {
    let userWishlist = wishlist[user.id];
    userWishlist = userWishlist.filter(id => id !== productId);
    wishlist[user.id] = userWishlist;
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    createAlert("Product removed from wishlist.");
    refreshList();
  }

  function refreshList() {
    if (!wishlist[userId] || wishlist[userId].length === 0) {
      $("#wishlist-container").html(`
        <div class="empty">
          <img src="../media/empty.png"/>
          <p>No items in wishlist</p>
          <button class="shop">Start Adding</button>
        </div>`);
    } else {
      const productDetails = [];
      const promises = wishlist[userId].map(productId => {
        return $.ajax({
          url: `${URL}/${productId}`,
          dataType: "json",
          success: function (product) {
            productDetails.push(product);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error:", textStatus, errorThrown);
            $("#wishlist-container").html("<p>Error fetching product details!</p>");
          }
        });
      });

      $.when(...promises).done(function () {
        displayProducts(productDetails, "#wishlist-container");
      });
    }
  }

  const displayProducts = (filteredProducts, placeholder) => {
    $("#wishlist-container").empty();
    
    $.each(filteredProducts, function (index, item) {
      let productCont = `
      <div class="productCard" key=${item.id}>
        <div class="imgDiv">
          <div class="rating"><i class="fa-solid fa-star"></i><p>${item.rating.rate}</p></div>
          <img src=${item.image} alt=${item.name} loading="lazy"  class="lazy"/>
        </div>
        <p>${item.title}</p>
        <div class="btnBox">
          <div class="priceDiv"> 
            <p></p>
            <p>&dollar; &nbsp;${item.price}</p>
          </div>
          <button class="remove-item"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>`;
      $(placeholder).append(productCont);
    });
  };
});

function createAlert(message) {
  $("#notify-box").addClass("show");
  $("#notify-box").text(message);
 
    $("#notify-box").css("background-color", "#039dfd");
 
  setTimeout(() => {
    $("#notify-box").removeClass("show");
  }, 1500);
}