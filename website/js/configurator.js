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
`;
}

document.getElementById("download-configuration-btn").addEventListener("click", () => {
	const name = `${Date.now()}.env`;
	downloadEnv(generateEnv(), name);
	alert(`The configuration file ${name} has been downloaded. Please rename it to .env before uploading it to the server.`);
});
