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

    $('button.w3-button.w3-dark-grey').click(function() {
        alert('howdy');
        let depart = $('#departingInputInput').val();
        let arrive = $('#arrivingInputInput').val();
        let date = $('#dateInputInput').val();
        alert("depart: "+depart+" arrive: "+arrive+" date: "+date);
    });
})
