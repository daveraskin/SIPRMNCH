$(function(){

var postId;


    // $(".indexBtn").on("hover", function(e){
    //   e.preventDefault();

    // })
    $("#postForm").on("submit", function(e){
      e.preventDefault();
      var formData = $(this).serialize();
      var drinkType = $( "#drink-type option:selected" ).text();
       $.ajax({
            method: 'POST',
            url: "/main/post",
            data: formData,
            dataType: "html"
          }).done(function(data){
            if (drinkType === "Drink"){
              $("#drinksDiv").prepend(data)
            }else if(drinkType === "Coffee"){
              $("#coffeeDiv").prepend(data)
            }else if(drinkType === "Bite"){
              $("#biteDiv").prepend(data)
            }else if(drinkType === "Meal"){
              $("#mealDiv").prepend(data)
            }

            $("#postModal").modal('hide');
            $("#postForm")[0].reset();
          })
    })

$(".pencilButton").on("click", function(e){
 postId = $(this).attr("id");
  $("#hiddenCommentInput").val(postId);
})

 $("#commentForm").on("submit", function(e){
      e.preventDefault();
      var formData = $(this).serialize();
       $.ajax({
            method: 'POST',
            url: "/main/post/comment",
            data: formData,
            dataType: "html"
          }).done(function(data){
            $("#commentModal").modal('hide');
            $("#commentForm")[0].reset();
          })
    })





    $("#glassGlyph").on("click", function(e){
      e.preventDefault();
       $(".postsDiv").addClass("hidden");
      $("#drinksDiv").removeClass("hidden");

    });

    $("#coffeeGlyph").on("click", function(e){
      e.preventDefault();
      $(".postsDiv").addClass("hidden");
      $("#coffeeDiv").removeClass("hidden");

  });

    $("#appleGlyph").on("click", function(e){
      e.preventDefault();
      $(".postsDiv").addClass("hidden");
      $("#biteDiv").removeClass("hidden");

  })

    $("#cutleryGlyph").on("click", function(e){
      e.preventDefault();
      $(".postsDiv").addClass("hidden");
      $("#mealDiv").removeClass("hidden");

  })

});