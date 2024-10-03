$(()=>{

  $("#footer").load("./Footer.html")
    $('.logo').click(function() {
        window.location.href = '/task_7/index.html';
      });
    
      
      $('#start-shopping').click(function() {
        window.location.href = '/task_7/index.html';
      });
    
      
      $('#login-btn').click(function() {
        window.location.href = './login.html';
      });
})