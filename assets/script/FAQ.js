$(()=>{
    $("#navbar").load("./Navbar.html");

    $(".title").click(function () {
        $(this).next(".content").slideToggle("slow");
        $(this).children(".open-close").toggleClass("fa-plus fa-xmark");
      });
})