let root = "http://comp426.cs.unc.edu:3001";
const LATLONG = 0.01449275362;
$(document).ready(function () {
    let body = $('body');
    
    let confcodes = new Array();
    //let itininfo = new Array();
    let confcodegen = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',1,2,3,4,5,6,7,8,9,0];
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
    

    // let info = {
    //     "instance": {
    //         "flight_id" : 142287,
    //         "date"      : "2018-11-28",
    //         "is_cancelled": false,
    //     }
    // }
    // seed(10, "instances", info);
    //del('itineraries');

    $('div.aslInputClass').hide();

    $('button.buy-ticket').click(function(){
      $(this).parent().siblings('div.aslInputClass').show();
      $(this).hide();
    })

    $('button.reserve-ticket').click(function(e) {
        e.preventDefault();
        let seat, ticket;
        let firstName = $(this).parent().siblings('div.name-input').children('p.first-name-wrapper').children('input.first-name').val();
        let lastName = $(this).parent().siblings('div.name-input').children('p.last-name-wrapper').children('input.last-name').val();
        let middleName = $(this).parent().siblings('div.name-input').children('p.middle-name-wrapper').children('input.middle-name').val();
        let age = $(this).siblings('p.age-wrapper').children('input.age-input').val();
        let gender = $(this).siblings('div.gender-wrapper').children('div.select-selected').text();
        let instanceID = $(this).parent().parent().siblings('div.flight-info').data('instance');
        let email = $(this).siblings('p.email-wrapper').children('input.email-input').val();
        let cost = $(this).parent().parent().siblings('div.flight-info').data('cost');
        let planeID = $(this).parent().parent().siblings('div.flight-info').data('planeID');
        let airline = $(this).parent().parent().siblings('div.flight-info').data('airline');
        let depart = $(this).parent().parent().siblings('div.flight-info').data('depart');
        let arrive = $(this).parent().parent().siblings('div.flight-info').data('arrive');
        let cabin = (cost >= 500) ? 'First Class' : 'Economy';
        let row = (cabin == 'first') ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 26) + 4;
        let number = Math.floor(Math.random() * 4) + 1;
        let departs_at = $(this).parent().parent().siblings('div.flight-info').children('span.depart').text().substring(9, 14);
        let arrives_at = $(this).parent().parent().siblings('div.flight-info').children('span.arrive').text().substring(9, 14);
        confirm = confirm('Do you want to purchase this ticket for $' +cost +'?');
        if(!confirm) return;
        switch (number) {
            case 1: number = "A";
            break;
            case 2: number = "B";
            break;
            case 3: number = "C";
            break;
            case 4: number = "D";
            break;
            default: number = "D"
        }
        $.ajax({
            url: root + '/seats',
            type: 'POST',
            data: {
                "seat": {
                    "plane_id":  planeID,
                    "row":       row,
                    "number":    number,
                    "cabin":     cabin,
                    "is_window": true
                  }
            },
            xhrFields: { withCredentials: true }
        }).done(function (data) {
            seat = data;
            $.ajax({
                url: root + '/tickets',
                type: 'POST',
                data: {
                    "ticket": {
                      "first_name":   firstName,
                      "middle_name":  middleName,
                      "last_name":    lastName,
                      "age":          age,
                      "gender":       gender,
                      "is_purchased": true,
                      "price_paid":   cost,
                      "instance_id":  instanceID,
                      "seat_id":      seat.id
                    }
                },
                xhrFields: { withCredentials: true }
              }).done(function (data) {
                ticket = data;
                let code = '';
                for(let i = 0; i < 6; i++){
                        code+= confcodegen[Math.floor(Math.random() * confcodegen.length)];
                }
                confcodes.push(code);
                let info = {
                        "depart": depart,
                        "arrive": arrive,
                        "confirmation_code": code,
                        "departs_at": departs_at,
                        "arrives_at": arrives_at,
                        "airline": airline,
                        "seat": cabin + ' - ' +row+number
                };
                info = JSON.stringify(info);
                $.ajax({
                    url: root + '/itineraries',
                    type: 'POST',
                    data: {
                        "itinerary": {
                            "confirmation_code": code,
                            "email":             email,
                            "info":  info
                        }
                    },
                    xhrFields: { withCredentials: true }
                  }).done(function() {
                    showItinerary();
                  });
              });
        });
    });

    $('button.search-button').click(function() {
        $('h2').show();
        let depart = $('#departingInputInput').val().toUpperCase();
        let arrive = $('#arrivingInputInput').val().toUpperCase();
        let date = $('#dateInputInput').val();
        let depID, arrID;
        let flights = new Array();
        let instances = new Array();
        window.scrollTo(0, 650.33);
        $('div.w3-container.w3-black.w3-opacity.slide').show();
        $.ajax({
            url: root +'/airports?filter[code]=' + depart,
            type: 'GET',
            xhrFields: { withCredentials: true }
        }).done(function(data) {
            depID = data[0].id;
            $.ajax({
                url: root +'/airports?filter[code]=' + arrive,
                type: 'GET',
                xhrFields: { withCredentials: true }
            }).done(function(data) {
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
                    console.log(flights.length)
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
                    console.log(instances.length);
                    for(let i = 1; i <= instances.length; i++){
                        //console.log(flights[i].departs_at);
                        let airline;
                        let flightcard = $('div.card#card' + i).children('div.flight-info');
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
                        cost = Math.floor((Math.random() * 500) + 200);
                        flightcard.data('cost', cost);
                        flightcard.data('instance', instances[i-1].id);
                        flightcard.data('planeID', flights[instances[i-1].info].plane_id);
                        flightcard.data('airline', airline);
                        flightcard.data('depart', depart);
                        flightcard.data('arrive', arrive);
                        flightcard.children('h3').text(`${depart} to ${arrive}`);
                        flightcard.children('#cost').text('Cost: $' + cost);
                        flightcard.children('span.depart').text(`Departs: ${dep_at.substring(11, 16)}`);
                        flightcard.children('span.arrive').text(`Arrives: ${arr_at.substring(11, 16)}`);
                        flightcard.children('p.airline').text(`Airline: ${airline}`);
                        flightcard.parent().show();
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

    $('button.cancel-ticket').click(function() {
        $(this).parent().parent().parent().hide();
        $(this).parent().parent().parent().parent().parent().siblings('h3').text('You don\'t have any trips. Sad.');
        $(this).parent().parent().parent().parent().parent().siblings('h3').append('<i class="fa fa-frown-o" aria-hidden="true"></i>');
        let id = $(this).siblings('p.confirmation-code').text().substring(19,25);
        alert(id);
        $.ajax({
            url: root +'/itineraries?filter[confirmation_code]=' + id,
            type: 'GET',
            xhrFields: { withCredentials: true }
        }).done(function (data) {
            alert(data);
            id = data[0].id;
            alert(id);
            $.ajax({
                url: root +'/itineraries/' + id,
                type: 'DELETE',
                xhrFields: { withCredentials: true }
            }).done(function () {
                return;
            });
        });
    });

    $('input.slider').mouseup(function () {
        let dist = $('input.slider').val();
        let region = LATLONG * dist;
        let nearby = new Array();
        //let depart = $('#departingInputInput').val().toUpperCase();
        let arrive = $('#arrivingInputInput').val().toUpperCase();
        let lat, long;
        console.log(`dist: ${dist} region: ${region}`);
        $.ajax({
            url: root +'/airports?filter[code]=' +arrive,
            type: 'GET',
            xhrFields: { withCredentials: true }
        }).done(function (data) {
            lat = data[0].latitude;
            long = data[0].longitude;
            console.log(`lat: ${lat} long: ${long}`)
            $.ajax({
                url: root +'/airports',
                type: 'GET',
                //dataType: 'json',
                xhrFields: { withCredentials: true }
            }).done(function (data) {
                for (let i = 0; i < data.length; i++) {
                    if(data[i].latitude <  (lat + region))
                        if(data[i].latitude > (lat - region))
                            if(data[i].longitude < (long + region))
                                if(data[i].longitude > (long - region))
                                    nearby.push(data[i]);
                }
                console.log(nearby);
                for(let i = 0 ; i < nearby.length; i++) {
                    if(nearby[i].code != arrive) {
                        $.ajax({
                            url: `https://maps.googleapis.com/maps/api/directions/json?origin=${arrive}airport&destination=${nearby[i].code}airport&key=AIzaSyCtuDkDa97phIHjcGHt0HjAlMtdiigKhGc`,
                            type: 'GET',
                            dataType: 'json',
                            //async: false,
                            xhrFields: { withCredentials: true }
                        }).done(function (data) {
                            //console.log(data.routes[0].legs[0].distance.text);
                            if ((data.routes[0].legs[0].distance.text) <= dist) {
                                alert(data.routes[0].legs[0].steps[0].html_instructions);
                            }
                        });
                    }
                }
            });
        });

    });

    function showItinerary() {
      //alert(confcodes[0]);
      $('h3#itin').text('Your Upcoming Trips');
      for (let i = 0; i < confcodes.length; i++) {
        $.ajax({
            url: root +'/itineraries?filter[confirmation_code]=' + confcodes[i],
            type: 'GET',
            xhrFields: { withCredentials: true }
        }).done(function(data) {
          //alert("code: "+confcodes[i]);
          //alert(data[0].info);
          let info = JSON.parse(data[0].info);
          let card = $('div.flight-info');
          card.parent().parent().show();
          card.children('h3').text(info.depart + " to " + info.arrive);
          card.children('p.confirmation-code').text('Confirmation Code: '+info.confirmation_code);
          card.children('span.depart-itin').text('Depart: '+info.departs_at);
          card.children('span.arrive-itin').text("Arrive: "+info.arrives_at);
          card.children('span.airline').text("Airline: "+info.airline);
          card.children('span.seat').text("Seat: "+info.seat);
        })
      }
    }

})

del =  (database) => {
    $.ajax({
        url: root + '/' + database,
        type: 'GET',
        dataType: 'json',
        xhrFields: { withCredentials: true }
    }).done(function (data) {
        for(let i = 0; i < data.length; i++) {
            $.ajax({
                url: root + '/' + database +'/' + data[i].id,
                type: 'DELETE',
                xhrFields: {withCredentials: true}
            })
        }
    }); 
}

seed = (num, database, info) => {
    for(let i = 0; i< num; i++){
        $.ajax({
            url: root + '/' + database,
            type: 'POST',
            data: info,
            xhrFields: { withCredentials: true }
        });
    }
}
