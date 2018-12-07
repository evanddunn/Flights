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
                        //console.log(flights[i].departs_at);
                        let airline;
                        let flightcard = $('#card' + i);
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
                        flightcard.toggle();
                    }
                });
            });
        });
    });
})
