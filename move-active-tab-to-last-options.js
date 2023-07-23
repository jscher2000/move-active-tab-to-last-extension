/* 
  Move Active Tab to Last
  Copyright 2023. Jefferson "jscher2000" Scher. License: MPL-2.0.
  Script to apply defaults and save changes on the Options page
  Revision 0.4 - Tab move delay
*/

/*** Initialize Page ***/

// Default starting values
var oSettings = {
	delaySeconds: 0				// seconds to wait before moving the active tab
}

var frmOptions = document.getElementById('frmOptions');

// Update oSettings from storage
browser.storage.local.get("prefs").then( (results) => {
	if (results.prefs != undefined){
		if (JSON.stringify(results.prefs) != '{}'){
			var arrSavedPrefs = Object.keys(results.prefs)
			for (var j=0; j<arrSavedPrefs.length; j++){
				oSettings[arrSavedPrefs[j]] = results.prefs[arrSavedPrefs[j]];
			}
		}
	}
}).then(() => {
	// Delay time
	frmOptions.elements['numSeconds'].value = oSettings.delaySeconds;
	// Attach event handler to the Save buttons
	frmOptions.addEventListener('click', updatePref, false);
	frmOptions.addEventListener('change', lightSaveBtn, false);
}).catch((err) => {
	console.log('Error retrieving "prefs" from storage: '+err.message);
});

/*** Handle User Actions ***/

// Update storage
function updatePref(evt){
	if (evt.target.className != 'savebtn') return;
	// Delay time
	var frm = evt.target.closest('form');
	if (frm.elements['numSeconds'].valueAsNumber >= 0 && frm.elements['numSeconds'].valueAsNumber <= 30){
		oSettings.delaySeconds = frm.elements['numSeconds'].valueAsNumber;
	} else {
		alert('Delay time is not within the 0 to 30 second range? [' + frm.elements['numSeconds'].valueAsNumber + ']');
		return false;
	}

	// Update storage
	browser.storage.local.set(
		{prefs: oSettings}
	).then(() => {
		// Clean up highlighting
		var lbls = document.querySelectorAll('label');
		for (var i=0; i<lbls.length; i++){
			lbls[i].className = '';
		}
		var btns = document.getElementsByClassName('savebtn');
		for (i=0; i<btns.length; i++){
			btns[i].style.backgroundColor = '';
		}
		evt.target.blur();
	}).catch((err) => {
		console.log('Error on browser.storage.local.set(): ' + err.message);
	});
}

function lightSaveBtn(evt){
	if (!['INPUT', 'SELECT'].includes(evt.target.nodeName)) return;
	var chgd = false;
	var frm = evt.target.closest('form');
	switch (evt.target.type){
		case 'number':
			switch (evt.target.name){
				case 'numSeconds':
					if (evt.target.valueAsNumber != oSettings.delaySeconds){
						chgd = true;
						evt.target.labels[0].classList.add('changed');
					} else {
						chgd = false;
						evt.target.labels[0].classList.remove('changed');
					}
					break;
			}
			break;
		default:
			// none of these 
	}
	var btns = frm.getElementsByClassName('savebtn');
	var changelabels = frm.querySelectorAll('label.changed');
	for (i=0; i<btns.length; i++){
		if (changelabels.length > 0) btns[i].style.backgroundColor = '#ff0';
		else btns[i].style.backgroundColor = '';
	}
}

