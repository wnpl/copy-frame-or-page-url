// Set form values from current preferences
browser.runtime.sendMessage({
	get: "oPrefs"
}).then((response) => {
	var oSettings = response['prefs'];

	// --- i18n: Set all text elements ---
	document.title = browser.i18n.getMessage("optionsPageTitle");
	
	// Set labels and sections
	const i18nElements = document.querySelectorAll('[data-i18n]');
	i18nElements.forEach(el => {
		const key = el.getAttribute('data-i18n');
		if (key) {
			el.textContent = browser.i18n.getMessage(key);
		}
	});
	
	// Set option texts for selects
	const formatOptions = {
		url: browser.i18n.getMessage("formatUrl"),
		markdown: browser.i18n.getMessage("formatMarkdown"),
		html: browser.i18n.getMessage("formatHtml")
	};
	
	document.querySelectorAll('select[name^="click"] option').forEach(option => {
		option.textContent = formatOptions[option.value];
	});

	// Checkboxes
	var chks = document.querySelectorAll('.chk input[type="checkbox"]');
	for (var i=0; i<chks.length; i++){
		if (oSettings[chks[i].name] == true) chks[i].checked = true;
		else chks[i].checked = false;
	}
	// Selects
	var sels = document.querySelectorAll('select[name^="click"]');
	for (var i=0; i<sels.length; i++){
		var selopt = document.querySelector('select[name="' + sels[i].name + '"] option[value="' + oSettings[sels[i].name] + '"]');
		if (selopt) {
			selopt.setAttribute('selected', 'selected');
		}
	}

	// Use platform-specific modifier key label
	browser.runtime.getPlatformInfo().then((platform) => {
		var ctrlLabel = document.getElementById('ctrl-label');
		if (ctrlLabel) {
			ctrlLabel.textContent = (platform.os === "mac") ? "\u2318 + Klick:" : "\u2303 + Klick:";
		}
	}).catch((err) => {
		console.log('Problem getting platform info: '+err.message);
	});
}).catch((err) => {
	console.log('Problem getting settings: '+err.message);
});


// Send changes to background for storage
function updatePref(evt){
	// Checkboxes
	var chks = document.querySelectorAll('.chk input[type="checkbox"]');
	var oSettings = {};
	for (var i=0; i<chks.length; i++){
		oSettings[chks[i].name] = chks[i].checked;
	}
	// Selects
	var sels = document.querySelectorAll('select[name^="click"]');
	for (var i=0; i<sels.length; i++){
		oSettings[sels[i].name] = sels[i].value;
	}
	// Send update to background
	browser.runtime.sendMessage({
		update: oSettings
	});
}


// Attach event handler to the checkboxes and selects
var chks = document.querySelectorAll('.chk input[type="checkbox"]');
for (var i=0; i<chks.length; i++){
	chks[i].addEventListener('change', updatePref, false);
}
var sels = document.querySelectorAll('select[name^="click"]');
for (var i=0; i<sels.length; i++){
	sels[i].addEventListener('change', updatePref, false);
}
