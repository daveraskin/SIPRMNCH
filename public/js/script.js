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
      $(".glyphicon-glass").removeClass("inactive").addClass("glassActive");
       $(".glyphicon-cutlery").removeClass("cutleryActive").addClass("inactive");
       $(".fa-coffee").removeClass("coffeeActive").addClass("inactive");
       $(".glyphicon-apple").removeClass("appleActive").addClass("inactive");
       $(".postsDiv").animate({
    opacity: 0
  }, 250, function() {
        $(this).addClass("hidden");
      $("#drinksDiv").removeClass("hidden");
      $(".postsDiv").animate({
    opacity: 1
  }, 400);
    });
     });

    $("#coffeeGlyph").on("click", function(e){
      e.preventDefault();
      $(".fa-coffee").removeClass("inactive").addClass("coffeeActive");
       $(".glyphicon-cutlery").removeClass("cutleryActive").addClass("inactive");
       $(".glyphicon-glass").removeClass("glassActive").addClass("inactive");
       $(".glyphicon-apple").removeClass("appleActive").addClass("inactive");
      $(".postsDiv").animate({
    opacity: 0
  }, 250, function() {
      $(".postsDiv").addClass("hidden");

      $("#coffeeDiv").removeClass("hidden");
       $(".postsDiv").animate({
    opacity: 1
  }, 400);
    });

  });

    $("#appleGlyph").on("click", function(e){
      e.preventDefault();
      $(".glyphicon-apple").removeClass("inactive").addClass("appleActive");
       $(".glyphicon-cutlery").removeClass("cutleryActive").addClass("inactive");
       $(".glyphicon-glass").removeClass("glassActive").addClass("inactive");
       $(".fa-coffee").removeClass("coffeeActive").addClass("inactive");
      $(".postsDiv").animate({
    opacity: 0
  }, 250, function() {
      $(".postsDiv").addClass("hidden");

      $("#biteDiv").removeClass("hidden");
       $(".postsDiv").animate({
    opacity: 1
  }, 400);
    });

  })

    $("#cutleryGlyph").on("click", function(e){
      e.preventDefault();
       $(".glyphicon-cutlery").removeClass("inactive").addClass("cutleryActive");
       $(".glyphicon-apple").removeClass("appleActive").addClass("inactive");
       $(".glyphicon-glass").removeClass("glassActive").addClass("inactive");
       $(".fa-coffee").removeClass("coffeeActive").addClass("inactive");
      $(".postsDiv").animate({
    opacity: 0
  }, 250, function() {
      $(".postsDiv").addClass("hidden");

      $("#mealDiv").removeClass("hidden");
      $(".postsDiv").animate({
    opacity: 1
  }, 400);
    });
  })

// $("#updateForm").on("submit", function(e){
//   e.preventDefault();

//   console.log("clicked***************************************", formData);
//        $.ajax({
//             method: 'PUT',
//             url: "/main/update",
//             data: formData
//           });
// });
})