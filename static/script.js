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
// LIVE USER ID
// =====================================

let liveUserId =
localStorage.getItem("live_user_id");

if(!liveUserId){

    liveUserId =
    Math.random().toString(36).substring(2);

    localStorage.setItem(
        "live_user_id",
        liveUserId
    );
}

// =====================================
// LIVE USERS
// =====================================

function updateLiveUsers(){

fetch("/live-users",{

    method:"POST",

    headers:{
        "Content-Type":"application/json"
    },

    body:JSON.stringify({

        user_id:liveUserId

    })

})

.then(response => response.json())

.then(data => {

    if(data.success){

        const liveBox =
        document.getElementById(
            "liveUsers"
        );

        if(liveBox){

            liveBox.innerHTML =

            "🌐 Live Users: " +
            data.count;
        }
    }

})

.catch(error => {

    console.log(error);

});

}

// =====================================
// PREVIOUS STATUS
// =====================================

let previousStatus1 = "";
let previousStatus2 = "";

let gate1ClosedTime = "--";
let gate1OpenedTime = "--";

let gate2ClosedTime = "--";
let gate2OpenedTime = "--";

// =====================================
// CLOCK
// =====================================

setInterval(function(){

    const now = new Date();

    document.getElementById(
        "clock"
    ).innerHTML =

    now.toLocaleTimeString();

},1000);

// =====================================
// DISTANCE FUNCTION
// =====================================

function calculateDistance(
lat1, lon1, lat2, lon2
){

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
// STATUS DESIGN
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
// MAIN LOCATION
// =====================================

function updateLocation(){

if(!navigator.geolocation){

document.getElementById(
"locationText"
).innerHTML =

"❌ GPS Not Supported";

return;
}

navigator.geolocation.getCurrentPosition(

function(position){

document.getElementById(
"loader"
).style.display = "none";

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

// =====================================
// SHOW SPEED
// =====================================

document.getElementById(
"speedText"
).innerHTML =

"🚶 Speed: " +
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
// SHOW DISTANCE
// =====================================

document.getElementById(
"distance1"
).innerHTML =

"📍 DISTANCE: " +
d1 +
" meters";

document.getElementById(
"distance2"
).innerHTML =

"📍 DISTANCE: " +
d2 +
" meters";

// =====================================
// USER STATUS
// =====================================

let nearestGate = "";

if(d1 < d2){

nearestGate =
"📍 Nearest Gate: CANTONMENT GATE";
}

else{

nearestGate =
"📍 Nearest Gate: RADIO PARK GATE";
}

document.getElementById(
"locationText"
).innerHTML =

"🟢 GPS CONNECTED" +

"<br><br>" +

nearestGate;

// =====================================
// GATE STATUS
// =====================================

let status1 = "NO DATA";
let status2 = "NO DATA";

if(d1 <= 100){

status1 = speed <= 3
? "CLOSED"
: "OPEN";
}

if(d2 <= 100){

status2 = speed <= 3
? "CLOSED"
: "OPEN";
}

setStatus(
"status1",
status1
);

setStatus(
"status2",
status2
);

},

function(error){

document.getElementById(
"loader"
).style.display = "none";

document.getElementById(
"locationText"
).innerHTML =

"❌ GPS ERROR";

console.log(error);

},

{

enableHighAccuracy:false,
timeout:10000,
maximumAge:5000

}

);

}

// =====================================
// START
// =====================================

updateLocation();

setInterval(
updateLocation,
3000
);

updateLiveUsers();

setInterval(
updateLiveUsers,
5000
);
