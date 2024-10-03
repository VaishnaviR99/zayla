$(document).ready(function() {

  // Function to format date 
  function formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
  }

  // Function to calculate delivery date (2 days from today)
  function getDeliveryDate() {
      let today = new Date();
      today.setDate(today.getDate() + 2);
      return formatDate(today);
  }

  // Retrieve logged-in user ID from local storage
  let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));


  let userId = loggedInUser.id;

  // Retrieve full user details from user list in local storage
  let userList = JSON.parse(localStorage.getItem('userList')) || [];
  let user = userList.find(user => user.id === userId);
  if (!user) {
      alert("User details not found");
      window.location.href = "./Login.html";
      return;
  }

  // Display user details
  $('#user-name').text(`${user.name.firstname} ${user.name.lastname}`);
  $('#user-phone').text(user.phone);
  $('#user-address').text(`${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.zipcode}`);

  // Event listener for editing details
  $('#edit-details-btn').on('click', function() {
    sessionStorage.setItem("profileEditOrigin", window.location.href); 

      window.location.href = "./EditProfile.html";
  });

  // Retrieve cart from local storage
  let cart = JSON.parse(localStorage.getItem('cart')) || {};
  let userCart = cart[userId] || [];
  
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
    renderCartProducts(productDetails);
  });

  



  // Function to render products in the cart
  function renderCartProducts(productDetails) {
      let productList = $('#product-list');
      productList.empty(); 

      $.each(productDetails, function (index, product) {
      
         
          let productCard = `
              <div class="product-card">
                  <img src="${product.image}" alt="${product.name}">
                  <div>
                    
                      <p> $${product.price}</p>
                      
                      <p>Delivery by:<strong> ${getDeliveryDate()}</strong></p>
                  </div>
              </div>
          `;
          productList.append(productCard);
      });
  }

  // Render the cart products on page load
  renderCartProducts();

  // Event listener for continue button
  $('#continue-btn').on('click', function() {
      window.location.href = "./Payment.html"; 
  });
});
