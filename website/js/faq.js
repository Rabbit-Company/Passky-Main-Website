const questions = {
	"I have forgotten my username. Where can I find it?":
		"Under 'Sign up' button in Passky Client you will find a button called 'Forgot username?'. If you click this button, a dialog will open and request Passky server and your email. If you have entered the information correctly and clicked on the button 'Send', you will receive an email with all usernames connected with your email.",
	"I have forgotten my master password. Where can I find it?":
		"The master password is used to encrypt and decrypt your passwords and messages. Master password never leaves your computer, so if you have forgotten it your data can't be recovered.",
	"What encryptions does Passky uses?": "Passky uses XChaCha20 for password encryption and Argon2id for password hashing (Salt included).",
	"What happens when my Premium account expire?":
		"You will still be able to view, edit and delete passwords, but you won't be able to add any new password if you have reached the password limit.",
	"Why do you define Passky as lightweight?":
		"Passky Server is written with less than 3000 lines of code, while other password managers are usually written with more than 400 000 lines of code. This also makes Passky more maintainable and much harder for bugs and vulnerabilities to squeeze in.",
};

let faqHtml = "";
for (let i = 0; i < Object.keys(questions).length; i++) {
	faqHtml +=
		"<div class='pt-6'><dt class='text-lg'><button id='faq-btn-" +
		i +
		"' type='button' class='focus:outline-hidden text-left w-full flex justify-between items-start text-gray-400' aria-controls='faq-0' aria-expanded='false'><span class='font-medium text-gray-400'>" +
		Object.keys(questions)[i] +
		"</span><span class='ml-6 h-7 flex items-center'><svg id='faq-icon-" +
		i +
		"' class='rotate-0 h-6 w-6 transform' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /></svg></span></button></dt><dd class='hidden mt-2 pr-12' id='faq-ans-" +
		i +
		"'><p class='text-base text-gray-500'>" +
		Object.values(questions)[i] +
		"</p></dd></div>";
}

document.getElementById("faq-div").innerHTML = faqHtml;

for (let i = 0; i < Object.keys(questions).length; i++) {
	document.getElementById("faq-btn-" + i).addEventListener("click", () => {
		if (document.getElementById("faq-ans-" + i).className == "hidden mt-2 pr-12") {
			document.getElementById("faq-ans-" + i).className = "mt-2 pr-12";
			document.getElementById("faq-icon-" + i).setAttribute("class", "rotate-180 h-6 w-6 transform");
		} else {
			document.getElementById("faq-ans-" + i).className = "hidden mt-2 pr-12";
			document.getElementById("faq-icon-" + i).setAttribute("class", "rotate-0 h-6 w-6 transform");
		}
	});
}
