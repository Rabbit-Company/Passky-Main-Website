document.getElementById("main-menu-btn").addEventListener("click", () => {
	if (document.getElementById("mobile-menu").className == "sm:hidden hidden") {
		document.getElementById("mobile-menu").className = "sm:hidden";
		document.getElementById("main-menu-icon").innerHTML = "<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12' />";
		return;
	}
	document.getElementById("mobile-menu").className = "sm:hidden hidden";
	document.getElementById("main-menu-icon").innerHTML = "<path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 6h16M4 12h16M4 18h16' />";
});

function downloadEnv(exportTxt, exportName) {
	let dataStr = "data:application/x-empty;charset=utf-8," + encodeURIComponent(exportTxt);
	let downloadAnchorNode = document.createElement("a");
	downloadAnchorNode.setAttribute("href", dataStr);
	downloadAnchorNode.setAttribute("download", exportName);
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}
