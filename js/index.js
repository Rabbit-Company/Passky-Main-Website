function copyToClipboard(text){
    let textArea = document.createElement("textarea");
    textArea.value = text;

    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    document.execCommand('copy');

    document.body.removeChild(textArea);
}

//Public Servers
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
    srvHtml += "<tr><td class='px-6 py-4 whitespace-nowrap'><div class='flex items-center'><div class='flex-shrink-0 h-10 w-10'><img class='h-10 w-10 rounded-full' src='images/flags/" + Object.values(servers)[i]["location"] + ".png' alt='" + Object.values(servers)[i]["location"] + " flag'></div><div class='ml-4'><div class='text-sm font-medium text-gray-300'>" + Object.keys(servers)[i] + "</div><div class='text-sm text-gray-400'>" + Object.values(servers)[i]["domain"] + "</div></div></div></td><td id='srv-accounts-" + i + "' class='px-6 py-4 whitespace-nowrap text-sm text-gray-400'>0/0</td><td id='srv-version-" + i + "' class='px-6 py-4 whitespace-nowrap text-sm text-gray-400'>/</td><td class='px-6 py-4 whitespace-nowrap'><span id='srv-latency-" + i + "' class='px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-red-800 text-red-300'>0 ms</span></td><td class='px-6 py-4 whitespace-nowrap'><span id='srv-status-" + i + "' class='px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-red-800 text-red-300'>Offline</span></td></tr>";
}

document.getElementById("public-servers-table").innerHTML = srvHtml;

//FAQ
const questions = {
    "I have forgotten my username. Where can I find it?": "Under 'Sign up' button in Passky Client you will find a button called 'Forgot username?'. If you click this button, a dialog will open and request Passky server and your email. If you have entered the information correctly and clicked on the button 'Send', you will receive an email with all usernames connected with your email.",
    "I have forgotten my master password. Where can I find it?": "The master password is used to encrypt and decrypt your passwords and messages. Master password never leaves your computer, so if you have forgotten it your data can't be recovered.",
    "Why do you define Passky as lightweight?": "Passky Server is written with less than 1000 lines of code, while other password managers are usually written with more than 400 000+ lines of code. This also makes Passky more maintainable and much harder for bugs and vulnerabilities to squeeze in."
}

let faqHtml = "";
for(let i = 0; i < Object.keys(questions).length; i++){
    faqHtml += "<div class='pt-6'><dt class='text-lg'><button id='faq-btn-" + i + "' type='button' class='focus:outline-none text-left w-full flex justify-between items-start text-gray-400' aria-controls='faq-0' aria-expanded='false'><span class='font-medium text-gray-400'>" + Object.keys(questions)[i] + "</span><span class='ml-6 h-7 flex items-center'><svg id='faq-icon-" + i + "' class='rotate-0 h-6 w-6 transform' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /></svg></span></button></dt><dd class='hidden mt-2 pr-12' id='faq-ans-" + i + "'><p class='text-base text-gray-500'>" + Object.values(questions)[i] + "</p></dd></div>";
}

document.getElementById("faq-div").innerHTML = faqHtml;

for(let i = 0; i < Object.keys(questions).length; i++){
    document.getElementById("faq-btn-" + i).addEventListener("click", () => {
        if(document.getElementById("faq-ans-" + i).className == "hidden mt-2 pr-12"){
            document.getElementById("faq-ans-" + i).className = "mt-2 pr-12";
            document.getElementById("faq-icon-" + i).setAttribute('class', 'rotate-180 h-6 w-6 transform');
        }else{
            document.getElementById("faq-ans-" + i).className = "hidden mt-2 pr-12";
            document.getElementById("faq-icon-" + i).setAttribute('class', 'rotate-0 h-6 w-6 transform');
        }
    });
}

document.getElementById("mobile-menu-open-btn").addEventListener("click", () => {
    document.getElementById("mobile-menu").className = "absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top md:hidden";
});

document.getElementById("mobile-menu-close-btn").addEventListener("click", () => {
    document.getElementById("mobile-menu").className = "hidden absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top md:hidden";
});

document.getElementById("btc-qr").addEventListener("click", () => {
    copyToClipboard('bc1qchcpkcy6ga3dxwufvxuaf6qpdg4c6ryemmqfle');
    alert('Bitcoin address copied to your clipboard!');
});

document.getElementById("eth-qr").addEventListener("click", () => {
    copyToClipboard('0x16620E8f37520E25CED7915A4f538b97Fcd3E76C');
    alert('Ethereum address copied to your clipboard!');
});

document.getElementById("iota-qr").addEventListener("click", () => {
    copyToClipboard('iota1qp7uzm3506rpkdu0rc29tx486x4mlxpsk9wjh87e9j4z7k00p4rfwsnsqu9');
    alert('IOTA address copied to your clipboard!');
});

document.getElementById("xmr-qr").addEventListener("click", () => {
    copyToClipboard('42SrwsGtg6mHErAKAjnkJbR4qziJ1ndBoid9s53cwEozN4xM9Ro3FKGGaqfCtdjJ1LFpRVCn8M26cURV76QDM6rX6s1m2zj');
    alert('Monero address copied to your clipboard!');
});

document.getElementById("dash-qr").addEventListener("click", () => {
    copyToClipboard('XfJRUp2xGBwjtpSSicr21ep21xBL5dpvEf');
    alert('Dash address copied to your clipboard!');
});

document.getElementById("zec-qr").addEventListener("click", () => {
    copyToClipboard('t1dVuXeSvuMrVPRcJ7hVNP7CLuvZoH8PbKz');
    alert('Zcash address copied to your clipboard!');
});

//Public Server Info
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
    document.getElementById("srv-accounts-" + i).innerText = json.users + "/" + json.maxUsers;
    document.getElementById("srv-version-" + i).innerText = json.version;
    document.getElementById("srv-latency-" + i).innerText = Number(latency) + " ms";
    if(Number(latency) > 200){
        document.getElementById("srv-latency-" + i).className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-red-800 text-red-300";
    }else if(Number(latency) > 100){
        document.getElementById("srv-latency-" + i).className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-yellow-800 text-red-200";
    }else{
        document.getElementById("srv-latency-" + i).className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-800 text-green-500";
    }
    document.getElementById("srv-status-" + i).innerText = "Online";
    document.getElementById("srv-status-" + i).className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-800 text-green-500";
}

function fetchServerInfo(i){
    const latencyStart = new Date();
    let latency = 0;
    fetch(Object.values(servers)[i].domain + "?action=getInfo")
    .then(response => {
        if (response.ok){
            latency = new Date() - latencyStart;
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
        document.getElementById("srv-version-" + i).innerText = json.version;
        document.getElementById("srv-latency-" + i).innerText = latency + " ms";
        if(Number(latency) > 200){
            document.getElementById("srv-latency-" + i).className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-red-800 text-red-300";
        }else if(Number(latency) > 100){
            document.getElementById("srv-latency-" + i).className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-yellow-800 text-red-200";
        }else{
            document.getElementById("srv-latency-" + i).className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-800 text-green-500";
        }
        document.getElementById("srv-status-" + i).innerText = "Online";
        document.getElementById("srv-status-" + i).className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-800 text-green-500";
    }).catch();
}