var statusIcon = document.getElementById("statusIcon");
var statusContent = document.getElementById("statusContent");
var spotifyListening = document.getElementById("spotifyListening");
var headStatus = document.getElementById("headStatus");
var headStatus2 = document.getElementById("headStatus2");
var headStatus3 = document.getElementById("headStatus3");

const lanyard = new WebSocket("wss://api.lanyard.rest/socket");
let myIDD = "852853360612605952" 
var api = {};
var received = false;

lanyard.onopen = function () {
  lanyard.send(
    JSON.stringify({
      op: 2,
      d: {
        subscribe_to_id: "852853360612605952",
      },
    })
  );
};

setInterval(() => {
  if (received) {
    lanyard.send(
      JSON.stringify({
        op: 3,
      })
    );
  }
}, 30000);

lanyard.onmessage = function (event) {
  received = true;
  api = JSON.parse(event.data);

  if (api.t === "INIT_STATE" || api.t === "PRESENCE_UPDATE") {
    update_presence();
  }
};

function update_presence() {
  if (statusIcon != null) {
    update_status(api.d.discord_status);
  }

  var vsCodeAppID = "852853360612605952"
  var vsCodeActivity = api.d.activities.find(activity => activity.application_id == vsCodeAppID)
  
  if (vsCodeActivity) {
    headStatus.innerHTML = `
<div class="head-status-in">
    <div class="head-status-card p-3">
        <div class="head-status-card-left"><img class="head-status-card-left-img" draggable="false" src="/assets/img/vscode.svg" alt="VsCode"></div>
        <div class="head-status-card-right">
            <p class="head-status-card-right-title text-uppercase">Visual Studio Code</p>
            <p class="head-status-card-right-details">${vsCodeActivity.details || " "}</p>
            <p class="head-status-card-right-state">${vsCodeActivity.state || " "}</p>
        </div>
    </div>
</div>`;
  } else {
    headStatus.innerHTML = ``;
    document.getElementById("headStatus").style.display = "none";
  }

var netflixAppID = "926541425682829352"
var netflixActivity = api.d.activities.find(activity => activity.application_id == netflixAppID)

if (netflixActivity) {
  var netflixImage = netflixAvtivity.assets.large_image
  var netflixImageLink = netflixImage.substring(netflixImage.indexOf("https/"));
  var netflixImageLinkRevised = netflixImageLink.replace('https/','https://');

  headStatus2.innerHTML = `
<div class="head-status-in">
  <div class="head-status-card p-3">
      <div class="head-status-card-left"><img class="head-status-card-left-img" draggable="false" src="${netflixImageLinkRevised || "assets/img/netflix.png"}" onerror="this.onerror=null;this.src='assets/img/netflix.png'" alt="Netflix"></div>
      <div class="head-status-card-right">
          <p class="head-status-card-right-title text-uppercase">Netflix</p>
          <p class="head-status-card-right-details">${netflixActivity.details || " "}</p>
          <p class="head-status-card-right-state">${netflixActivity.state || " "}</p>
      </div>
  </div>
</div>`;
} else {
  headStatus2.innerHTML = ``;
  document.getElementById("headStatus2").style.display = "none";
}

var disneyPlusAppID = "630236276829716483"
var disneyPlusActivity = api.d.activities.find(activity => activity.application_id == disneyPlusAppID)

if (disneyPlusActivity) {
  headStatus3.innerHTML = `
<div class="head-status-in">
  <div class="head-status-card p-3">
      <div class="head-status-card-left"><img class="head-status-card-left-img" draggable="false" src="assets/img/disneyplus.png" alt="Disney+"></div>
      <div class="head-status-card-right">
          <p class="head-status-card-right-title text-uppercase">Disney+</p>
          <p class="head-status-card-right-details">${disneyPlusActivity.details || " "}</p>
          <p class="head-status-card-right-state">${disneyPlusActivity.state || " "}</p>
      </div>
  </div>
</div>`;
} else {
  headStatus3.innerHTML = ``;
  document.getElementById("headStatus3").style.display = "none";
}

  setInterval(function () {

    if (api.d.listening_to_spotify == true) {

    var countDownDate = new Date(api.d.spotify.timestamps.end).getTime();
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var spotify_time = minutes + "m " + seconds + "s "

      var artist = `${
        api.d.spotify.artist.split(";")[0].split(",")[0]
      }`;
      var song = `${
        api.d.spotify.song.split("(")[0]
      }`;
      spotifyListening.innerHTML = `<div class="spotify_section text-white"><i class="fa-brands fa-spotify text-white mr-2"></i>Listening to <a href="https://open.spotify.com/track/${api.d.spotify.track_id}" target="_blank" class="text-white decoration_yh">${song}</a> <span class="ml-1 mr-1" style="color:#b5ffce">—</span> <span class="text-white"> left ${spotify_time || "0m 0s"}</span></div>`;
    } else {
      spotifyListening.innerHTML = ``;
      document.getElementById("spotifyListening").style.display = "none";
    }

  }, 1000); //removed: animate__animated animate__flash

  if (api.d.discord_status === "dnd") {
    statusContent.innerHTML = `<span class="w-3 h-3 bg-red-500 rounded-full inline-flex ml-1 mr-2"></span>Online`;

  } else if (api.d.discord_status === "idle") {
    statusContent.innerHTML = `<span class="w-3 h-3 bg-yellow-500 rounded-full inline-flex ml-1 mr-2"></span>Online`;

  } else if (api.d.discord_status === "online") {
    statusContent.innerHTML = `<span class="w-3 h-3 bg-green-500 rounded-full inline-flex ml-1 mr-2"></span>Online`;

  } else if (api.d.discord_status === "offline") {
    statusContent.innerHTML = `<span class="w-3 h-3 bg-gray-500 rounded-full inline-flex ml-1 mr-2"></span>Offline`;

  } else {
    statusContent.innerHTML = `<span class="w-3 h-3 bg-gray-500 rounded-full inline-flex ml-1 mr-2"></span>Loading`;

  }

}
