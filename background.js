/* 
  Copyright 2018. Jefferson "jscher2000" Scher. License: MPL-2.0.
  Revision 0.2 - 2018-10-27
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
				// (4) Compute the index of the last tab in the window 
				// (it's an array, so *assume* the number of items minus 1 is the highest possible index)
				var maxindex = foundtabs.length - 1;
				// (5) Move the current tab to the end if we're not there already
				if (info.tabId !== maxindex){
					browser.tabs.move(info.tabId, {index: maxindex}).catch((err) => {
						console.log('tabs.move() error: ' + err.message);
					});
				}
			}).catch((err) => {
				console.log('tabs.query() error: ' + err.message);
			});
		}
	}).catch((err) => {
		console.log('tabs.get() error: ' + err.message);
	});
});
