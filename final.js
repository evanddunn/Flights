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

    $('div.aslInputClass').hide();

    $('button.buy-ticket').click(function(){
      $(this).parent().siblings('div.aslInputClass').show();
      $(this).hide();
    })



    $('button.reserve-ticket').click(function(e) {
        e.preventDefault();
        let firstName = $(this).parent().siblings('div.name-input').children('p.first-name-wrapper').children('input.first-name').val();
        let lastName = $(this).parent().siblings('div.name-input').children('p.last-name-wrapper').children('input.last-name').val();
        let middleName = $(this).parent().siblings('div.name-input').children('p.middle-name-wrapper').children('input.middle-name').val();
        let age = $(this).siblings('p.age-wrapper').children('input.age-input').val();
        let gender = $(this).siblings('div.gender-wrapper').children('div.select-selected').text();
    });

    $('button.search-button').click(function() {
        let depart = $('#departingInputInput').val().toUpperCase();
        let arrive = $('#arrivingInputInput').val().toUpperCase();
        let date = $('#dateInputInput').val();
        let depID, arrID;
        let flights = new Array();
        let instances = new Array();
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
                        //flights = data;
                    }
                    console.log(flights)
                    for(let i = 0; i < flights.length; i++){
                        $.ajax({
                            url: root + '/instances?filter[flight_id]=' + flights[i].id,
                            type: 'GET',
                            xhrFields: { withCredentials: true },
                            async: false
                        }).done(function (data) {
                            for(let j = 0; j < data.length; j++) {
                                if(data[j].date == date) {
                                    data[j].info = i;//`${flights[i].departs_at} ${flights[i].arrives_at} ${flights[i].airline_id}`;
                                    instances.push(data[j]);
                                }
                            }
                        });
                    }
                    console.log(instances[0].info);
                    for(let i = 1; i <= instances.length; i++){
                        console.log(flights[i].departs_at);
                        let airline;
                        let flightcard = $('#card' + i).children('div.flight-info');
                        let dep_at = flights[instances[i-1].info].departs_at;//instances[i-1].info.substring(11, 16);
                        let arr_at = flights[instances[i-1].info].arrives_at;
                        let airline_id = flights[instances[i-1].info].airline_id;
                        $.ajax({
                            url: root + '/airlines/' + airline_id,
                            type: 'GET',
                            xhrFields: { withCredentials: true },
                            async: false
                        }).done(function (data) {
                            airline = data.name;
                        });
                        flightcard.children('h3').text(`${depart} to ${arrive}`)
                        flightcard.children('span.depart').text(`Departs: ${dep_at.substring(11, 16)}`);
                        flightcard.children('span.arrive').text(`Arrives: ${arr_at.substring(11, 16)}`);
                        flightcard.children('p.airline').text(`Airline: ${airline}`);
                        flightcard.parent().toggle();
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
