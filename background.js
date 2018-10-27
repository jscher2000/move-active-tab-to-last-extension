/* 
  Copyright 2018. Jefferson "jscher2000" Scher. License: MPL-2.0.
  Revision 0.1 - 2019-10-27
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
			// (3) Find all tabs in the window
			browser.tabs.query({windowId: info.windowId}).then((foundtabs) => {
				// (4) Move the current tab to the end
				browser.tabs.move(info.tabId, {index: foundtabs.length - 1}).catch((err) => {
					console.log('tabs.move() error: ' + err.message);
				});
			}).catch((err) => {
				console.log('tabs.query() error: ' + err.message);
			});
		}
	}).catch((err) => {
		console.log('tabs.get() error: ' + err.message);
	});
});
