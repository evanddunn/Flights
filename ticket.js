$(document).ready(function () {
    let body = $('body');
    let root = "http://comp426.cs.unc.edu:3001";
    $.ajax(root + '/sessions', {
        type: 'POST',
        data: {'user': {
            'username': 'karwheel',
            'password': 'comp426',
        }},
        dataType: 'json',
        xhrFields: {withCredientials: true},
    });


    $('div.aslInputClass').hide();

    $('button.buy-ticket').click(function(){
      $(this).parent().siblings('div.aslInputClass').show();
      $(this).hide();
    })



    $('button.reserve-ticket').click(function(e) {
      let test = $(this).parent().siblings('div.name-input').children('p.first-name-wrapper').children('input.first-name').val();
      alert(test);
        e.preventDefault();
        alert('howdy');
        let firstName = $(this).parent().siblings('div.name-input').children('p.first-name-wrapper').children('input.first-name').val();
        let lastName = $(this).parent().siblings('div.name-input').children('p.last-name-wrapper').children('input.last-name').val();
        let middleName = $(this).parent().siblings('div.name-input').children('p.middle-name-wrapper').children('input.middle-name').val();
        let age = $('#ageInput').val();
        let gender = $('#genderOptions option:selected').text();
        alert("firstName: "+firstName+" lastName: "+lastName+" middleName: "+middleName+" age: "+age+" gender: "+gender);
    });
})
