let serverReportChart;
//Chart.defaults.borderColor = '#111827';
Chart.defaults.color = '#a7abb3';

const servers = {
	"Europe": {
		"domain": "https://eu.passky.org",
		"location": "eu"
	},
	"America": {
		"domain": "https://us.passky.org",
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

	let maxPasswords = json.maxPasswords;
	if(maxPasswords < 0) maxPasswords = "∞";

	if(json.maxUsers >= 0){
		document.getElementById("srv-accounts-" + i).innerText = json.users + "/" + json.maxUsers;
	}else{
		document.getElementById("srv-accounts-" + i).innerText = json.users;
	}

	document.getElementById("srv-passwords-" + i).innerText = json.passwords + " (" + maxPasswords + ")";
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

		let maxPasswords = json.maxPasswords;
		if(maxPasswords < 0) maxPasswords = "∞";

		if(json.maxUsers >= 0){
			document.getElementById("srv-accounts-" + i).innerText = json.users + "/" + json.maxUsers;
		}else{
			document.getElementById("srv-accounts-" + i).innerText = json.users;
		}

		document.getElementById("srv-passwords-" + i).innerText = json.passwords + " (" + maxPasswords + ")";
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

document.getElementById("server-stats-btn").addEventListener("click", () => {
	let server = document.getElementById("server").value;

	fetch("https://" + server + "?action=getStats")
	.then(response => {
		if (response.ok) return response.json();
	}).then(json => {
		if(json.error == 0){
			let cpu = (parseFloat(json.cpu) * 100).toFixed(0);
			document.getElementById("stats-cpu-text").innerText = cpu + "%";
			document.getElementById("stats-cpu-bar").style = "width: " + cpu + "%";

			document.getElementById("stats-ram-text").innerText = formatBytes(json.memoryUsed*1000, 0) + " / " + formatBytes(json.memoryTotal*1000, 0);
			document.getElementById("stats-ram-bar").style = "width: " + (json.memoryUsed/json.memoryTotal)*100 + "%";

			document.getElementById("stats-storage-text").innerText = formatBytes(json.diskUsed, 0) + " / " + formatBytes(json.diskTotal, 0);
			document.getElementById("stats-storage-bar").style = "width: " + (json.diskUsed/json.diskTotal)*100 + "%";
		}else{
			resetStats();
		}
	}).catch(err => {
		resetStats();
	});

	fetch("https://" + server + "?action=getInfo")
	.then(response => {
		if (response.ok) return response.json();
	}).then(json => {
		if(json.error == 0){
			if(json.maxUsers >= 0){
				document.getElementById("stats-accounts-text").innerText = json.users + " / " + json.maxUsers;
				document.getElementById("stats-accounts-bar").style = "width: " + (json.users/json.maxUsers)*100 + "%";
			}else{
				document.getElementById("stats-accounts-text").innerText = json.users;
				document.getElementById("stats-accounts-bar").style = "width: 0%";
			}

			let maxPasswords = json.maxPasswords;
			if(maxPasswords < 0) maxPasswords = "∞";

			document.getElementById("stats-passwords-text").innerText = json.passwords + " (" + maxPasswords + ")";
			document.getElementById("stats-passwords-bar").style = "width: 0%";

			document.getElementById("stats-version-text").innerText = json.version;
		}else{
			resetInfoStats();
		}
	}).catch(err => {
		resetInfoStats();
	});

	fetch("https://" + server + "?action=getReport")
	.then(response => {
		if (response.ok) return response.json();
	}).then(json => {
		resetGraph();
		if(json.error != 0) return;
		const ctx = document.getElementById('serverReportChart');
		let dates = [];
		let newcomers = [];

		let dateTracker = new Date(json.results[0].date);
		let ncs = 0;
		for(let i = 0; i < json.results.length; i++){
			let date = json.results[i].date;
			let date2 = dateTracker.toISOString().split('T')[0];

			while(date2 != date){
				dates.push(date2);
				newcomers.push(ncs);
				dateTracker.setDate(dateTracker.getDate() + 1);
				date2 = dateTracker.toISOString().split('T')[0];
			}

			dates.push(date);
			ncs += json.results[i].newcomers;
			newcomers.push(ncs);
			dateTracker.setDate(dateTracker.getDate() + 1);
			date2 = dateTracker.toISOString().split('T')[0];
		}

		serverReportChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: dates,
				datasets: [{
					label: 'Accounts',
					data: newcomers,
					borderColor: '#2563eb',
					backgroundColor: '#2563eb',
					borderWidth: 2,
					pointRadius: 0,
					pointHitRadius: 3,
				}]
			},
			options: {
				interaction: {
					intersect: false,
				},
				scales: {
					y: {
						beginAtZero: true
					}
				},
				scale: {
					ticks: {
						precision: 0
					}
				}
			}
		});
	}).catch(err => {
		resetGraph();
	});
});

function formatBytes(bytes, decimals = 2) {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function resetStats(){
	document.getElementById("stats-cpu-text").innerText = "0%";
	document.getElementById("stats-cpu-bar").style = "width: 0%";
	document.getElementById("stats-ram-text").innerText = "0%";
	document.getElementById("stats-ram-bar").style = "width: 0%";
	document.getElementById("stats-storage-text").innerText = "0%";
	document.getElementById("stats-storage-bar").style = "width: 0%";
}

function resetInfoStats(){
	document.getElementById("stats-accounts-text").innerText = "0";
	document.getElementById("stats-accounts-bar").style = "width: 0%";

	document.getElementById("stats-passwords-text").innerText = "0 (0)";
	document.getElementById("stats-passwords-bar").style = "width: 0%";

	document.getElementById("stats-version-text").innerText = "0.0.0";
}

function resetGraph(){
	try{
		serverReportChart.destroy();
	}catch{}
}