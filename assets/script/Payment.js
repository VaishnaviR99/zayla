$(document).ready(function () {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  let userCart = cart[user.id] || [];
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
      },
    });
    requests.push(request);
  });

  let totalAmount;
  $.when(...requests).then(function () {
    totalAmount = 0;
    $.each(productDetails, function (index, item) {
      const productHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="detail">
                        <span> ${item.quantity} x $${item.price}</span>
                       
                        
                    </div>
                </div>
            `;
      $("#cart-container").append(productHTML);
      totalAmount += item.price * item.quantity;
      
    });
    $("#total-amount").text(`Total : $${Math.floor(totalAmount)}`);
  });

  // Handle payment completion
  $("#complete-payment-btn").click(function () {
    const order = {
      userId: user.id,
      items: userCart,
      totalAmount: totalAmount,
      orderDate: new Date().toISOString(),
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear the user's cart
    cart[user.id] = [];
    localStorage.setItem("cart", JSON.stringify(cart));

    $("#paymentSec").append(
      `<div class="spin"><i class="fa-solid fa-spinner fa-spin-pulse"></i></div>`
    );
createAlert("Payment successfully")
    setTimeout(() => {
      window.location.href = "/task_7/index.html";
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