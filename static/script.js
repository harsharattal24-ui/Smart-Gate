const gates = [

    {
        name:"Cantonment Gate",
        lat:15.1514586,
        lng:76.8938312
    },

    {
        name:"Radio Park Gate",
        lat:15.1445935,
        lng:76.9047562
    }

];

// =====================================
// PREVIOUS STATUS
// =====================================

let previousStatus1 = "";
let previousStatus2 = "";

// =====================================
// DISTANCE FUNCTION
// =====================================

function calculateDistance(lat1, lon1, lat2, lon2){

    const R = 6371000;

    const dLat =
    (lat2-lat1) * Math.PI/180;

    const dLon =
    (lon2-lon1) * Math.PI/180;

    const a =

    Math.sin(dLat/2) *
    Math.sin(dLat/2)

    +

    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *

    Math.sin(dLon/2) *
    Math.sin(dLon/2);

    const c =
    2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1-a)
    );

    return Math.round(R*c);
}

// =====================================
// STATUS BOX + ANIMATION
// =====================================

function setStatus(id,status){

    const box =
    document.getElementById(id);

    box.className = "status";

    if(status === "OPEN"){

        box.innerHTML =
        "🟢 OPEN";

        box.classList.add("open");
    }

    else if(status === "CLOSED"){

        box.innerHTML =
        "🚧 CLOSED";

        box.classList.add("closed");
    }

    else{

        box.innerHTML =
        "⚪ NO DATA";

        box.classList.add("unknown");
    }
}

// =====================================
// NOTIFICATION ALERT
// =====================================

function showNotification(message){

    if(Notification.permission === "granted"){

        new Notification(message);
    }
}

// REQUEST PERMISSION

if(Notification.permission !== "granted"){

    Notification.requestPermission();
}

// =====================================
// OPEN ROUTE
// =====================================

function openRoute(destLat,destLng){

    const url =

    "https://www.google.com/maps/dir/?api=1&destination=" +

    destLat +

    "," +

    destLng;

    window.location.href = url;
}

// =====================================
// MAIN LOCATION UPDATE
// =====================================

function updateLocation(){

    navigator.geolocation.getCurrentPosition(

        function(position){

            const lat =
            position.coords.latitude;

            const lng =
            position.coords.longitude;

            let speed =
            position.coords.speed || 0;

            speed = speed * 3.6;

            if(speed < 3){

                speed = 0;
            }

            document.getElementById(
                "speedText"
            ).innerText =

            "Speed: " +
            speed.toFixed(2) +
            " km/h";

            // =====================================
            // DISTANCES
            // =====================================

            const d1 =
            calculateDistance(

                lat,
                lng,

                gates[0].lat,
                gates[0].lng

            );

            const d2 =
            calculateDistance(

                lat,
                lng,

                gates[1].lat,
                gates[1].lng

            );

            // =====================================
            // NEAREST GATE
            // =====================================

            let nearestGate = "";

            if(d1 < d2){

                nearestGate =
                "Nearest Gate: Cantonment Gate";
            }

            else{

                nearestGate =
                "Nearest Gate: Radio Park Gate";
            }

            // =====================================
            // USER STATUS
            // =====================================

            let nearGate = false;

            if(d1 <= 100 || d2 <= 100){

                nearGate = true;
            }

            let userStatus = "";

            if(nearGate && speed <= 3){

                userStatus =
                "Waiting Near Gate";
            }

            else if(speed > 3){

                userStatus =
                "Moving";
            }

            else{

                userStatus =
                "Idle";
            }

            document.getElementById(
                "locationText"
            ).innerHTML =

            "Status: " +

            userStatus +

            "<br><br>" +

            nearestGate;

            // =====================================
            // GATE 1
            // =====================================

            document.getElementById(
                "distance1"
            ).innerText =

            "Distance: " +
            d1 +
            " meters";

            let users1 = 0;

            let status1 = "NO DATA";

            if(d1 <= 100){

                if(speed <= 3){

                    status1 = "CLOSED";

                    users1 = 1;

                    document.getElementById(
                        "prediction1"
                    ).innerText =

                    "Prediction Time: 10 mins approx";
                }

                else{

                    status1 = "OPEN";

                    document.getElementById(
                        "prediction1"
                    ).innerText =

                    "Prediction Time: --";
                }

            }

            else{

                document.getElementById(
                    "prediction1"
                ).innerText =

                "Prediction Time: --";
            }

            // NOTIFICATION

            if(previousStatus1 !== status1){

    if(status1 === "OPEN"){

        showNotification(
            "Cantonment Gate Opened"
        );
    }

    else if(status1 === "CLOSED"){

        showNotification(
            "Cantonment Gate Closed"
        );
    }
}

            previousStatus1 = status1;

            setStatus(
                "status1",
                status1
            );

            document.getElementById(
                "users1"
            ).innerText =

            "Waiting Users: " +
            users1;

            // =====================================
            // GATE 2
            // =====================================

            document.getElementById(
                "distance2"
            ).innerText =

            "Distance: " +
            d2 +
            " meters";

            let users2 = 0;

            let status2 = "NO DATA";

            if(d2 <= 100){

                if(speed <= 3){

                    status2 = "CLOSED";

                    users2 = 1;

                    document.getElementById(
                        "prediction2"
                    ).innerText =

                    "Prediction Time: 10 mins approx";
                }

                else{

                    status2 = "OPEN";

                    document.getElementById(
                        "prediction2"
                    ).innerText =

                    "Prediction Time: --";
                }

            }

            else{

                document.getElementById(
                    "prediction2"
                ).innerText =

                "Prediction Time: --";
            }

            // NOTIFICATION

            if(previousStatus2 !== status2){

    if(status2 === "OPEN"){

        showNotification(
            "Radio Park Gate Opened"
        );
    }

    else if(status2 === "CLOSED"){

        showNotification(
            "Radio Park Gate Closed"
        );
    }
}

            previousStatus2 = status2;

            setStatus(
                "status2",
                status2
            );

            document.getElementById(
                "users2"
            ).innerText =

            "Waiting Users: " +
            users2;

        },

        function(error){

    // LOCATION DENIED

    if(error.code === 1){

        alert(
            "Please Allow Location Permission To Use Railway Gate Tracker"
        );
    }

    // LOCATION UNAVAILABLE

    else if(error.code === 2){

        alert(
            "Location Not Available. Please Turn ON GPS And Location Accuracy."
        );
    }

    // TIMEOUT

    else if(error.code === 3){

        alert(
            "Location Request Timed Out. Try Moving To Open Area."
        );
    }

    document.getElementById(
        "locationText"
    ).innerHTML =

    "⚠ GPS Not Enabled<br><br>" +

    "Turn ON:<br>" +

    "• Device Location<br>" +

    "• Location Accuracy<br>" +

    "• Internet Connection";
},

        {

            enableHighAccuracy:true,
            timeout:15000,
            maximumAge:0

        }

    );
}

// =====================================
// START
// =====================================

updateLocation();

// REAL TIME UPDATE

setInterval(updateLocation,3000);
