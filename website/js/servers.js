const servers = {
  "Europe 1": {
      "domain": "https://eu1.passky.org",
      "location": "eu"
  },
  "Europe 2": {
      "domain": "https://eu2.passky.org",
      "location": "eu"
  },
  "United States 1": {
      "domain": "https://us1.passky.org",
      "location": "us"
  },
  "United States 2": {
      "domain": "https://us2.passky.org",
      "location": "us"
  }
}

let srvHtml = "";
for(let i = 0; i < Object.keys(servers).length; i++){
  srvHtml += "<tr><td class='px-6 py-4 whitespace-nowrap'><div class='flex items-center'><div class='flex-shrink-0 h-10 w-10'><img class='h-10 w-10 rounded-full' src='images/flags/" + Object.values(servers)[i]["location"] + ".png' alt='" + Object.values(servers)[i]["location"] + " flag'></div><div class='ml-4'><div class='text-sm font-medium text-gray-300'>" + Object.keys(servers)[i] + "</div><div class='text-sm text-gray-400'>" + Object.values(servers)[i]["domain"] + "</div></div></div></td><td id='srv-accounts-" + i + "' class='px-6 py-4 whitespace-nowrap text-sm text-gray-400'>0/0</td><td id='srv-passwords-" + i + "' class='px-6 py-4 whitespace-nowrap text-sm text-gray-400'>0/0</td><td id='srv-version-" + i + "' class='px-6 py-4 whitespace-nowrap text-sm text-gray-400'>/</td><td class='px-6 py-4 whitespace-nowrap'><span id='srv-latency-" + i + "' class='px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-800 text-green-500'>0 ms</span></td><td class='px-6 py-4 whitespace-nowrap'><span id='srv-status-" + i + "' class='px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-red-800 text-red-300'>Offline</span></td></tr>";
}

document.getElementById("public-servers-table").innerHTML = srvHtml;

let latencies = [];

for(let i = 0; i < Object.values(servers).length; i++){
    let jsonData = localStorage.getItem("data-" + i);
    let latency = localStorage.getItem("latency-" + i);
    let jsonTime = localStorage.getItem("time-" + i);
    
    if(typeof(jsonData) == 'undefined' || jsonData == null){
        fetchServerInfo(i);
        continue;
    }

    if(typeof(jsonTime) == 'undefined' || jsonTime == null){
        fetchServerInfo(i);
        continue;
    }

    try{
        JSON.parse(jsonData);
    }catch (e){
        localStorage.setItem("data-" + i, "{}");
        localStorage.setItem("latency-" + i, 0);
        localStorage.setItem("time-" + i, 0);
        fetchServerInfo(i);
        continue;
    }

    if(Number(jsonTime) + 10000 < Date.now()){
        fetchServerInfo(i);
        continue;
    }

    if(Number(latency) <= 0){
        fetchServerInfo(i);
        continue;
    }

    let json = JSON.parse(jsonData);
    latencies.push(Number(latency));
    document.getElementById("srv-accounts-" + i).innerText = json.users + "/" + json.maxUsers;
    document.getElementById("srv-passwords-" + i).innerText = json.passwords + "/" + (json.maxPasswords * json.maxUsers);
    document.getElementById("srv-version-" + i).innerText = json.version;
    document.getElementById("srv-latency-" + i).innerText = Number(latency) + " ms";
    document.getElementById("srv-status-" + i).innerText = "Online";
    document.getElementById("srv-status-" + i).className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-800 text-green-500";
    changeLatencyColors(latencies);
}

function average(numbers) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++){
        sum += numbers[i];
    }
    return (sum / numbers.length) || 0;
}

function fetchServerInfo(i){
    const latencyStart = new Date();
    let latency = 0;
    fetch(Object.values(servers)[i].domain + "?action=getInfo")
    .then(response => {
        if (response.ok){
            latency = new Date() - latencyStart;
            latencies.push(latency);
            return response.json();
        }
        localStorage.setItem("data-" + i, "{}");
        localStorage.setItem("latency-" + i, 0);
        localStorage.setItem("time-" + i, 0);
    }).then(json => {
        localStorage.setItem("data-" + i, JSON.stringify(json));
        localStorage.setItem("latency-" + i, latency);
        localStorage.setItem("time-" + i, Date.now());
        document.getElementById("srv-accounts-" + i).innerText = json.users + "/" + json.maxUsers;
        document.getElementById("srv-passwords-" + i).innerText = json.passwords + "/" + (json.maxPasswords * json.maxUsers);
        document.getElementById("srv-version-" + i).innerText = json.version;
        document.getElementById("srv-latency-" + i).innerText = latency + " ms";
        document.getElementById("srv-status-" + i).innerText = "Online";
        document.getElementById("srv-status-" + i).className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-800 text-green-500";
        changeLatencyColors(latencies);
    }).catch();
}

function changeLatencyColors(latencies){
    let avg = average(latencies);
    for(let i = 0; i < latencies.length; i++){
        let latency = localStorage.getItem("latency-" + i);
        if(Number(latency) > avg){
            document.getElementById("srv-latency-" + i).className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-red-800 text-red-300";
        }else{
            document.getElementById("srv-latency-" + i).className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-800 text-green-500";
        }
    }
}