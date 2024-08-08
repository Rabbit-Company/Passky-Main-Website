document.getElementById("limiter-enabled").addEventListener("change", () => {
	const checked = document.getElementById("limiter-enabled").checked;
	const limiterSettings = document.getElementById("limiter-settings");

	if (checked) {
		limiterSettings.classList.remove("hidden");
	} else {
		limiterSettings.classList.add("hidden");
	}
});

document.getElementById("email-disabled").addEventListener("change", () => {
	const checked = document.getElementById("email-disabled").checked;
	const smtpSettings = document.getElementById("smtp-settings");

	if (checked) smtpSettings.classList.add("hidden");
});

document.getElementById("email-smtp").addEventListener("change", () => {
	const checked = document.getElementById("email-smtp").checked;
	const smtpSettings = document.getElementById("smtp-settings");

	if (checked) smtpSettings.classList.remove("hidden");
});

document.getElementById("database-sqlite").addEventListener("change", () => {
	const checked = document.getElementById("database-sqlite").checked;
	const sqliteSettings = document.getElementById("sqlite-settings");
	const mysqlSettings = document.getElementById("mysql-settings");

	if (checked) {
		sqliteSettings.classList.remove("hidden");
		mysqlSettings.classList.add("hidden");
	}
});

document.getElementById("database-mysql").addEventListener("change", () => {
	const checked = document.getElementById("database-mysql").checked;
	const sqliteSettings = document.getElementById("sqlite-settings");
	const mysqlSettings = document.getElementById("mysql-settings");

	if (checked) {
		sqliteSettings.classList.add("hidden");
		mysqlSettings.classList.remove("hidden");
	}
});

document.getElementById("admin-2fa-btn").addEventListener("click", () => {
	const authBtn = document.getElementById("admin-2fa-btn");
	const authSettings = document.getElementById("admin-2fa-settings");
	const secretInput = document.getElementById("admin-2fa-secret");

	if (authBtn.innerText === "Enable") {
		authBtn.innerText = "Disable";
		document.getElementById("qrcode").innerHTML = "";
		authSettings.classList.remove("hidden");
		authBtn.classList.remove("bg-green-700");
		authBtn.classList.remove("hover:bg-green-800");
		authBtn.classList.add("bg-red-700");
		authBtn.classList.add("hover:bg-red-800");

		const secret = generate2FASecret();
		secretInput.value = secret;

		const otpauthURL = `otpauth://totp/${getValue("admin-username")}?secret=${secret}&issuer=Passky`;
		new QRCode(document.getElementById("qrcode"), otpauthURL);
	} else {
		authBtn.innerText = "Enable";
		authBtn.classList.remove("bg-red-700");
		authBtn.classList.remove("hover:bg-red-800");
		authBtn.classList.add("bg-green-700");
		authBtn.classList.add("hover:bg-green-800");
		authSettings.classList.add("hidden");
		secretInput.value = "";
	}
});

function generate2FASecret() {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	let result = "";
	const charactersLength = characters.length;

	for (let i = 0; i < 16; i++) {
		const randomIndex = Math.floor((window.crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * charactersLength);
		result += characters.charAt(randomIndex);
	}

	return result;
}

document.getElementById("admin-yubico-add-btn").addEventListener("click", () => {
	const yubikey = document.getElementById("admin-yubico-key");
	const yubikeys = document.getElementById("admin-yubico-keys");

	if (yubikey.value.length !== 44) {
		yubikey.value = "";
		return;
	}

	const id = yubikey.value.substring(0, 12);

	if (yubikeys.value.includes(id)) {
		yubikey.value = "";
		return;
	}

	if (yubikeys.value === "") {
		yubikeys.value = id;
	} else {
		yubikeys.value += ";" + id;
	}

	yubikey.value = "";
	displayYubiKeys();
});

document.getElementById("admin-yubico-remove-btn").addEventListener("click", () => {
	const yubikey = document.getElementById("admin-yubico-key");
	const yubikeys = document.getElementById("admin-yubico-keys");

	if (yubikey.value.length !== 44) {
		yubikey.value = "";
		return;
	}

	const id = yubikey.value.substring(0, 12);

	if (!yubikeys.value.includes(id)) {
		yubikey.value = "";
		return;
	}

	yubikeys.value = yubikeys.value.replace(";" + id, "").replace(id, "");
	if (yubikeys.value.charAt(0) === ";") yubikeys.value = yubikeys.value.slice(1);

	yubikey.value = "";
	displayYubiKeys();
});

function displayYubiKeys() {
	const yubikeys = document.getElementById("admin-yubico-keys").value.split(";");
	let html = "";
	yubikeys.forEach((yubikey) => {
		if (yubikey.length !== 12) return;
		html += `<li class="text-gray-400 py-4 flex"><img class='h-10 w-10 rounded-full' src='images/yubikey.png' alt='Yubico Key'><div class='ml-3'><p class='text-gray-400 text-sm font-medium'>${yubikey}</p></div></li>`;
	});

	document.getElementById("admin-yubico-keys-list").innerHTML = html;
}

function getValue(id) {
	return document.getElementById(id).value;
}

function getStatus(id) {
	return document.getElementById(id).checked;
}

function generateEnv() {
	let databaseEngine = getStatus("database-mysql") ? "mysql" : "sqlite";

	return `#
#	Passky Server Configuration
# https://passky.org/configurator
#	${new Date().toISOString()}
#

SERVER_CORES=${getValue("server-cores")}
SERVER_LOCATION=${getValue("server-country")}
ADMIN_USERNAME="${getValue("admin-username")}"
ADMIN_PASSWORD="${getValue("admin-password")}"
ADMIN_2FA_SECRET="${getValue("admin-2fa-secret")}"
ADMIN_YUBI_KEYS="${getValue("admin-yubico-keys")}"
CF_TURNSTILE_SITE_KEY=${getValue("admin-captcha-sitekey")}
CF_TURNSTILE_SECRET_KEY=${getValue("admin-captcha-secretkey")}
YUBI_CLOUD=${getValue("yubi-cloud")}
YUBI_ID=${getValue("yubi-id")}
ACCOUNT_MAX=${getValue("account-max")}
ACCOUNT_MAX_PASSWORDS=${getValue("account-password-limit")}
ACCOUNT_PREMIUM=${getValue("account-premium")}
DATABASE_ENGINE=${databaseEngine}
DATABASE_FILE="${getValue("sqlite-name")}"
MYSQL_CACHE_MODE=${getValue("database-cache-type")}
MYSQL_HOST="${getValue("mysql-host")}"
MYSQL_PORT=${getValue("mysql-port")}
MYSQL_DATABASE="${getValue("mysql-database")}"
MYSQL_USER="${getValue("mysql-user")}"
MYSQL_PASSWORD="${getValue("mysql-password")}"
MYSQL_SSL=${getStatus("mysql-ssl")}
MYSQL_SSL_CA="${getValue("mysql-ca-certificate")}"
REDIS_HOST="${getValue("redis-internal-host")}"
REDIS_PORT=${getValue("redis-internal-port")}
REDIS_PASSWORD="${getValue("redis-internal-password")}"
REDIS_LOCAL_HOST="${getValue("redis-external-host")}"
REDIS_LOCAL_PORT=${getValue("redis-external-port")}
REDIS_LOCAL_PASSWORD="${getValue("redis-external-password")}"
MAIL_ENABLED=${getStatus("email-smtp")}
MAIL_HOST="${getValue("smtp-host")}"
MAIL_PORT=${getValue("smtp-port")}
MAIL_USERNAME="${getValue("smtp-username")}"
MAIL_PASSWORD="${getValue("smtp-password")}"
MAIL_USE_TLS=${getStatus("smtp-tls")}
LIMITER_ENABLED=${getStatus("limiter-enabled")}
LIMITER_GET_INFO=${getValue("limiter-getInfo")}
LIMITER_GET_STATS=${getValue("limiter-getStats")}
LIMITER_GET_REPORT=${getValue("limiter-getReport")}
LIMITER_GET_TOKEN=${getValue("limiter-getToken")}
LIMITER_GET_PASSWORDS=${getValue("limiter-getPasswords")}
LIMITER_SAVE_PASSWORD=${getValue("limiter-savePassword")}
LIMITER_EDIT_PASSWORD=${getValue("limiter-editPassword")}
LIMITER_DELETE_PASSWORD=${getValue("limiter-deletePassword")}
LIMITER_DELETE_PASSWORDS=${getValue("limiter-deletePasswords")}
LIMITER_CREATE_ACCOUNT=${getValue("limiter-createAccount")}
LIMITER_DELETE_ACCOUNT=${getValue("limiter-deleteAccount")}
LIMITER_IMPORT_PASSWORDS=${getValue("limiter-importPasswords")}
LIMITER_ENABLE_2FA=${getValue("limiter-enable2fa")}
LIMITER_DISABLE_2FA=${getValue("limiter-disable2fa")}
LIMITER_ADD_YUBIKEY=${getValue("limiter-addYubiKey")}
LIMITER_REMOVE_YUBIKEY=${getValue("limiter-removeYubiKey")}
LIMITER_UPGRADE_ACCOUNT=${getValue("limiter-upgradeAccount")}
LIMITER_FORGOT_USERNAME=${getValue("limiter-forgotUsername")}
GET_INFO_ENDPOINT_ENABLED=${getStatus("endpoint-getinfo")}
GET_STATS_ENDPOINT_ENABLED=${getStatus("endpoint-getstats")}
GET_REPORT_ENDPOINT_ENABLED=${getStatus("endpoint-getreport")}
`;
}

document.getElementById("download-configuration-btn").addEventListener("click", () => {
	const name = `${Date.now()}.env`;
	downloadEnv(generateEnv(), name);
	alert(`The configuration file ${name} has been downloaded. Please rename it to .env before uploading it to the server.`);
});
