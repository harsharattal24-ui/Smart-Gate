function sendLocation(){

    navigator.geolocation.getCurrentPosition(
        success,
        error,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );

}

function success(position){

    let data = {

        lat: position.coords.latitude,
        lon: position.coords.longitude,
        speed: position.coords.speed || 0

    };

    fetch('/location', {

        method:'POST',

        headers:{
            'Content-Type':'application/json'
        },

        body: JSON.stringify(data)

    })

    .then(response => response.json())

    .then(data => {

        document.getElementById("status")
            .innerHTML = data.status;

        document.getElementById("gate")
            .innerHTML = data.nearest_gate;

        document.getElementById("distance")
            .innerHTML =
            data.distance + " meters";

        document.getElementById("waiting")
            .innerHTML =
            data.waiting_users;

        document.getElementById("updated")
            .innerHTML =
            data.updated;

    });

}

function error(){

    alert("Location permission denied");

}

# AUTO REFRESH
setInterval(sendLocation, 5000);
