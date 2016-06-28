$(document).ready(function(){
  var buttonStatus = false;
  var makeDoughnut = "Make new doughnut!";
  var closeForm = "Close form";

// Renders the index
  $.ajax({
    url: 'http://api.doughnuts.ga/doughnuts',
    method: 'GET',
    dataType: 'json',
    }).done(function(data){
      for(var i=0; i<data.length; i++){
        var t1 = $('<td>').attr('class', 'col-md-2').text(data[i].id);
        var t2 = $('<td>').attr('class', 'col-md-2').text(data[i].style);
        var t3 = $('<td>').attr('class', 'col-md-2').text(data[i].flavor);
        var editButton = $('<button>').attr('data-id','edit ' + data[i].id).text("Edit").on('click', showForm);

        var deleteButton = $('<button>').attr('data-id', 'delete ' + data[i].id).text("Delete").on('click', deleteMe);

        var tRow = $('<tr>').attr('id', 'doughnut ' + data[i].id).append(t1, t2, t3, editButton, deleteButton);
        $('tbody').append(tRow);
      }
    });


// The function that is fired when the delete button is clicked
    function deleteMe(){
      var buttonId = $(this).attr('data-id').split(" ")[1];
      $.ajax({
        url: 'http://api.doughnuts.ga/doughnuts/'+ buttonId,
        method: 'DELETE',
        dataType: 'json',
        }).done(function(json){

          console.log(json);
          $('tr[id="doughnut ' + buttonId + '"]').remove();
        });
    }

// the function to show the hidden form tag when edit button of a specific doughnut is clicked
    function showForm(){
      $('.hidden-form').show();
      var buttonId = $(this).attr('data-id').split(" ")[1];
      $.ajax({
        url: 'http://api.doughnuts.ga/doughnuts/'+ buttonId,
        method: 'GET',
        dataType: 'json',
        }).done(function(json){

          console.log(json);
          $('#form-1').val(json.style);
          $('#form-2').val(json.flavor);
          $('#form-submit').attr('data-id', json.id);
        });
    }

/* When the submit button of the form tag is clicked, the following action will be fired
depending on the boolean state of the buttonStatus */

    $('form').on('submit', function(event){
      event.preventDefault();

      //If buttonStatus === false, this form will be used for editing an existing doughnut
      if(buttonStatus === false){
        var buttonId = $('#form-submit').attr('data-id');
        $.ajax({
          url: 'http://api.doughnuts.ga/doughnuts/'+ buttonId,
          method: 'PATCH',
          data: {
            style: $('#form-1').val(),
            flavor: $('#form-2').val()
          },
          dataType: 'json',
        }).done(function(json){
          console.log(json);
          $('tr[id="doughnut ' + buttonId + '"] td:nth-of-type(2)').text(json.style);
          $('tr[id="doughnut ' + buttonId + '"] td:nth-of-type(3)').text(json.flavor);
          $('.hidden-form').hide();
        });

      } else {
        // If buttonStatus === true, this form will be used for creating a new doughnut instead
        $.ajax({
          url: 'http://api.doughnuts.ga/doughnuts',
          method: 'POST',
          data: {
            style: $('#form-1').val(),
            flavor: $('#form-2').val()
          },
          dataType: 'json',
        }).done(function(json){

          console.log(json);
          // Once a new doughnut is successfully created, the following code will append the new doughnut onto the page dynamically
          var t1 = $('<td>').attr('class', 'col-md-2').text(json.id);
          var t2 = $('<td>').attr('class', 'col-md-2').text(json.style);
          var t3 = $('<td>').attr('class', 'col-md-2').text(json.flavor);
          var editButton = $('<button>').attr('data-id','edit ' + json.id).text("Edit").on('click', showForm);

          var deleteButton = $('<button>').attr('data-id', 'delete ' + json.id).text("Delete").on('click', deleteMe);

          var tRow = $('<tr>').attr('id', 'doughnut ' + json.id).append(t1, t2, t3, editButton, deleteButton);
          $('tbody').append(tRow);
          $('.hidden-form').hide();
          $('#top-button').text(makeDoughnut);
          buttonStatus = false;



      });
    }
    });

//Render create doughnut form tag button
    $('#top-button').on('click', function(){
      event.preventDefault();
      console.log(buttonStatus);
      if (buttonStatus === false){
        $('.hidden-form').show();
        $('#form-1').val("");
        $('#form-2').val("");
        $('#form-submit').val(makeDoughnut);
        $(this).text(closeForm);
        buttonStatus = true;
      } else {
        $('.hidden-form').hide();
        $(this).text(makeDoughnut);
        buttonStatus = false;
      }

    });
  });
