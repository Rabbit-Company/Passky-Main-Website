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
