$(()=>{
    $("#navbar").load("./Navbar.html");
    $("#footer").load("./Footer.html")
    $(document).ready(function() {
        $(".fade-in").each(function(index, element) {
          $(this).delay(index * 200).fadeIn();
        });
      });
      
})