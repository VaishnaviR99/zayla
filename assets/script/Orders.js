$(document).ready(function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const URL = "https://fakestoreapi.com/products";

    $("#nav-placeholder").load("./Navbar.html");

    // Function to render orders based on filter
    function renderOrders(filter) {
        const userOrders = orders.filter(order => order.userId === loggedInUser.id);
        $('#orders-container').empty();

        let filteredOrders = userOrders.filter(order => {
            const orderDate = new Date(order.orderDate);
            const deliveryDate = new Date(orderDate);
            deliveryDate.setDate(deliveryDate.getDate() + 2);

            const currentDate = new Date();
            const daysRemaining = Math.ceil((deliveryDate - currentDate) / (1000 * 60 * 60 * 24));

            return filter === 'orders' ? daysRemaining > 0 : daysRemaining <= 0;
        });

        if (filteredOrders.length === 0) {
            $('#orders-container').html(`<p>No ${filter === 'orders' ? 'orders yet to be delivered' : 'order history'} available.</p>`);
            return;
        }

        filteredOrders.forEach(order => {
            const orderDate = new Date(order.orderDate);
            const deliveryDate = new Date(orderDate);
            deliveryDate.setDate(deliveryDate.getDate() + 2);

            const currentDate = new Date();
            const daysRemaining = Math.ceil((deliveryDate - currentDate) / (1000 * 60 * 60 * 24));
            const status = daysRemaining <= 0 ? `Delivered on ${deliveryDate.toDateString()}` : `Delivery in ${daysRemaining} day(s)`;

            let orderHTML = `
                <div class="order">
                    <div class="order-header">
                        <p>Order placed on: <strong>${orderDate.toDateString()}</strong></p>
                        <p>Total Amount: <strong>$${Math.floor(order.totalAmount)}</strong></p>  
                    </div>
            `;

            // Fetch details for each item in the order
            let productDetails = [];
            let requests = order.items.map(item => {
                return $.ajax({
                    url: `${URL}/${item.productId}`,
                    dataType: "json",
                    success: function(product) {
                        productDetails.push({ ...product, quantity: item.quantity });
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log("Error:", textStatus, errorThrown);
                        $('#orders-container').html("<p>Error fetching product details!</p>");
                    }
                });
            });

            $.when(...requests).done(function() {
                productDetails.forEach((item, index) => {
                    const deliveryMessage = currentDate >= deliveryDate ? `<span class='delivered'>Delivered on ${deliveryDate.toDateString()}</span>` : `<span class='pending'>Deliver by ${deliveryDate.toDateString()}</span>`;
                    orderHTML += `
                        <div class="order-item" key=${index}>
                            <img src="${item.image}" alt="${item.title}">
                            <div>
                                <span>${item.title}</span>
                                <span>Qty.: <strong>${item.quantity}</strong></span>
                                <span>Price: <strong>$${item.price * item.quantity}</strong></span>
                                ${deliveryMessage}
                            </div>
                        </div>
                    `;
                });

                orderHTML += `<div class="order-status">${status}</div></div>`;
                $('#orders-container').prepend(orderHTML);
            });
        });
    }

   
    renderOrders('orders');

    // Event listeners for buttons
    $('#orders-btn').click(function() {
        renderOrders('orders');
        $(this).addClass('active');
        $('#order-history-btn').removeClass('active');
    });

    $('#order-history-btn').click(function() {
        renderOrders('history');
        $(this).addClass('active');
        $("#orders-btn").removeClass('active');
    });
});
