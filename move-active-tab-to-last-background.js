/* 
  Copyright 2023. Jefferson "jscher2000" Scher. License: MPL-2.0.
  Revision 0.3 - 2018-10-27
  Revision 0.4 - Delay option 2023-07-23
*/

// Listen for tab activation and move the tab (if it is not pinned)
browser.tabs.onActivated.addListener((info) => {
	// Firefox provides the tabId and the windowId
	// (1) Get tab info
	browser.tabs.get(info.tabId).then((currTab) => {
		// (2) Check whether tab is pinned
		if (currTab.pinned){
			// Do nothing with pinned tabs
		} else {
			// (3) Check the current delay time
			var delaySeconds = 0;
			browser.storage.local.get("prefs").then((results) => {
				if (results.prefs != undefined){
					if (JSON.stringify(results.prefs) != '{}'){
						delaySeconds = results.prefs.delaySeconds;
					}
				}
			}).then(() => {
				// Is there a delay?
				if (delaySeconds < 1){ // NO DELAY
					// (4) Move the current tab to the end now
					// for index: "A value of -1 will place the tab at the end of the window."
					// https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/tabs/move
					browser.tabs.move(info.tabId, {index: -1}).catch((err) => {
						console.log('tabs.move() error: ' + err.message);
					});
				} else { // USER SET A DELAY
					// (4) Set an alarm to move the current tab to the end in the future
					//  only allow one per window (i.e., activating a different tab before the delay expires 
					//  cancels moving the previously activated tab
					var winAlarm = 'alarm' + info.windowId;
					// Store the tab number
					var winQueue = {
						[winAlarm]: info.tabId
					};
					browser.storage.local.set(winQueue);
					// Set the alarm
					var moveTime = Date.now() + (delaySeconds * 1000);
					browser.alarms.create(winAlarm, {
						when: moveTime
					});
				}
			}).catch((err) => {
				console.log('Error retrieving "prefs" from storage: '+err.message);
			});
		}
	}).catch((err) => {
		console.log('tabs.get() error: ' + err.message);
	});
});

function handleAlarm(alarmInfo) {
	browser.storage.local.get(alarmInfo.name).then((results) => {
		browser.tabs.move(results[alarmInfo.name], {index: -1}).catch((err) => {
			console.log('tabs.move() error: ' + err.message);
		});
	})
}
browser.alarms.onAlarm.addListener(handleAlarm);
