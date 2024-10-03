$(document).ready(function () {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    $("#navbar").load("./Navbar.html");
    if (!user) {
      window.location.href = "./Template/Login.html";
      return;
    }
  
    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    let userCart = cart[user.id] || [];

    
    $(document).on("click", ".shop", function(){
      window.location.href = "/task_7/index.html";
  });
  
    if (userCart.length === 0) {
      $("#cart-items").html(`<div class="empty"><img src="../media/empty.png"/>
      <p>Your Bag is empty!</p>
      <button class="shop">Start Shopping</button></div>`);
      return;
    }

  
   
    let productDetails = [];
    let requests = [];
  
    $.each(userCart, function (index, cartItem) {
      const request = $.ajax({
        url: `https://fakestoreapi.com/products/${cartItem.productId}`,
        dataType: "json",
        success: function (product) {
          productDetails.push({ ...product, quantity: cartItem.quantity });
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log("Error:", textStatus, errorThrown);
          $("#cart-items").html("<p>Error fetching product details!</p>");
        }
      });
      requests.push(request);
    });
  
    $.when(...requests).then(function () {
      displayCartProducts(productDetails);
    });
  
    function displayCartProducts(products) {
      $("#cart-items").empty();
  
      let total = 0;
  
      $.each(products, function (index, product) {
        total += product.price * product.quantity;
        let productCard = `
          <div class="productCard" key=${product.id}>
            <div class="imgDiv">
              <img src=${product.image} alt=${product.name} loading="lazy" class="lazy"/>
            </div>
            <div class="detailsDiv">
              <p class="title">${product.title}</p>
              <p class="price">&dollar;${product.price}</p>
              <p class="quantity">
                <button class="decrease-qty">-</button> 
                <span>${product.quantity}</span> 
                <button class="increase-qty">+</button>
              </p>
           
              <button class="remove-item"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>`;
          $("#cart-items").append(productCard);
          $("#cart-items").append(`<button class="placeOrder">Place Order</button>`)
      });
  
      $(".placeOrder").on("click", function(){
        window.location.href="./Checkout.html"
    })
      $("#cart-items").prepend(`<p class="total">Total: &dollar;${total.toFixed(2)}</p>`);
  
      $(".increase-qty").click(function () {
        const productId = $(this).closest(".productCard").attr("key");
        updateQuantity(productId, 1);
      });
  
      $(".decrease-qty").click(function () {
        const productId = $(this).closest(".productCard").attr("key");
        updateQuantity(productId, -1);
      });
  
      $(".remove-item").click(function () {
        const productId = $(this).closest(".productCard").attr("key");
        removeProduct(productId);
      });
    }
  
    function updateQuantity(productId, change) {
      let userCart = cart[user.id];
      let cartItem = userCart.find(item => item.productId === productId);
  
      if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity < 1) {
          cartItem.quantity = 1;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        refreshCart();
      }
    }
  
    function removeProduct(productId) {
      let userCart = cart[user.id];
      userCart = userCart.filter(item => item.productId !== productId);
      cart[user.id] = userCart;
      localStorage.setItem("cart", JSON.stringify(cart));
      createAlert("Product removed from your shopping bag.");
      refreshCart();
    }
  
    function refreshCart() {
      let userCart = cart[user.id] || [];
      if (userCart.length === 0) {
        $("#cart-items").html(`<div class="empty"><img src="../media/empty.png"/>
        <p>Your Bag is empty!</p>
        <button class="shop">Start Shopping</button></div>`);;
        return;
      }
  
      let productDetails = [];
      let requests = [];
  
      $.each(userCart, function (index, cartItem) {
        const request = $.ajax({
          url: `https://fakestoreapi.com/products/${cartItem.productId}`,
          dataType: "json",
          success: function (product) {
            productDetails.push({ ...product, quantity: cartItem.quantity });
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error:", textStatus, errorThrown);
            $("#cart-items").html("<p>Error fetching product details!</p>");
          }
        });
        requests.push(request);
      });
  
      $.when(...requests).then(function () {
        displayCartProducts(productDetails);
      });
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