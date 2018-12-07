$(document).ready(function () {
    let body = $('body');
    let root = "http://comp426.cs.unc.edu:3001";
    $.ajax({
        url: root + '/sessions',
        type: 'POST',
        data: {
        "user": {
            "username": "karwheel",
            "password": "comp426"
        }
        },
        xhrFields: { withCredentials: true }
    });

    $('button.w3-button.w3-dark-grey').click(function() {
        alert('howdy');
        let depart = $('#departingInputInput').val().toUpperCase();
        let arrive = $('#arrivingInputInput').val().toUpperCase();
        let date = $('#dateInputInput').val();
        let depID, arrID;
        let flights = new Array();
        let instances = new Array();
        alert("depart: "+depart+" arrive: "+arrive+" date: "+date);
        $.ajax({
            url: root +'/airports?filter[code]=' + depart,
            type: 'GET',
            xhrFields: { withCredentials: true }
        }).done(function(data) {
            //console.log(data[0]);
            depID = data[0].id;
            $.ajax({
                url: root +'/airports?filter[code]=' + arrive,
                type: 'GET',
                xhrFields: { withCredentials: true }
            }).done(function(data) {
                //console.log(data[0]);
                arrID = data[0].id;
                $.ajax({
                    url: root + '/flights?filter[departure_id]=' +depID,
                    type: 'GET',
                    xhrFields: { withCredentials: true }
                }).done(function (data) {
                    for(let i = 0; i < data.length; i++) {
                        if(data[i].arrival_id == arrID) flights.push(data[i]);
                    }
                    for(let i = 0; i < flights.length; i++) {
                        $.ajax({
                            url: root + '/instances?filter[flight_id]=' + flights[i].id,
                            type: 'GET',
                            xhrFields: { withCredentials: true }
                        }).done(function (data) {
                            for(let j = 0; j < data.length; j++) instances.push(data[j])
                        }).done(function () {
                            for(let i = 0; i < instances.length; i++) {
                                console.log(instances[i].id);
                            }
                        });
                    }
                });
            });
        });
    });

    $('button.w3-button.w3-margin-bottom.w3-red.w3-right#buyTicket').click(function() {
      alert("hey");
      let card = $(this).parent().parent();
      card.empty();
      card.append('    <div class="card">'+
            '<h3>[whereFrom] to [whereTo]</h3>'+
            '<p class="w3-opacity">Cost: $[cost]</p>'+
            '<p>Depart: [departTime] &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Arrive: [arriveTime]</p>'+
            '<p>Airline: [airline]</p>'+
              '<div id="aslInput">'+
                '<div class="w3-half">'+
                  '<p><input class="w3-padding-16" type="text" placeholder="First Name" required name="First Name" size="30" id="firstNameInput"></p>'+
                  '<p><input class="w3-padding-16" type="text" placeholder="Middle Name" required name="Middle Name" size="30" id="middleNameInput"></p>'+
                  '<p><input class="w3-padding-16" type="text" placeholder="Last Name" required name="Last Name" size="30" id="lastNameInput"></p>'+
                '</div>'+
                '<div class="w3-half">'+
                  '<p>'+
                    '<div class="custom-select" style="width:252px;">'+
                      '<select id="genderOptions">'+
                        '<option value="0">Gender:</option>'+
                        '<option value="1">Male</option>'+
                        '<option value="2">Female</option>'+
                        '<option value="3">Other</option>'+
                      '</select>'+
                    '</div>'+
                  '</p>'+
                  '<p><input class="w3-padding-16" type="number" placeholder="Age" required name="Age" min="0" max="130" size="30" id="ageInput"></p>'+
                  '<button class="w3-button w3-margin-bottom w3-red w3-right" style="margin-right:47px" id="reserveTicket">Reserve Ticket</button>'+
                '</div>'+
              '</div>'+
          '</div>');
    });


    $('button.w3-button.w3-margin-bottom.w3-red.w3-right#reserveTicket').click(function(e) {
        e.preventDefault();
        alert('howdy');
        let firstName = $('#firstNameInput').val();
        let lastName = $('#lastNameInput').val();
        let middleName = $('#middleNameInput').val();
        let age = $('#ageInput').val();
        //let gender = $('#genderOptions option:selected').text();
        alert("firstName: "+firstName+" lastName: "+lastName+" middleName: "+middleName+" age: "+age);
    });


})
