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

    $('button.w3-button.w3-red.w3-margin-top.w3-right').click(function() {
        alert('howdy');
        let firstName = $('#firstNameInput').val();
        let lastName = $('#lastNameInput').val();
        let middleName = $('#middleNameInput').val();
        let age = $('#ageInput').val();
        //let gender = $('#aslInput').children("option:selected").val();
        let gender = $('select.w3-select.w3-half.w3-padding-16.w3-border').children("option:selected").val();
        alert("firstName: "+firstName+" lastName: "+lastName+" middleName: "+middleName+" age: "+age+" gender: "+gender);
    });
})
