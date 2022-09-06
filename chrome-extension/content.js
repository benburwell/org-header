(function() {
	var loadStyles = function() {
		chrome.storage.sync.get('orgs', function(result) {
			applyMatchingHeader(result['orgs']);
		});
	};

	var getOrgName = function() {
		var hostname = window.location.hostname.toLowerCase();
		return hostname
			.replace(/\.[^\.]+\.my\.salesforce\.com/, '')
			.replace('.my.salesforce.com', '')
			.replace('.lightning.force.com', '')
			.replace('.sandbox.lightning.force.com', '')
			.replace(/--c\.[^\.]+\.visual\.force\.com/, '');
	};

	var applyMatchingHeader = function(orgs) {
		var currentOrg = getOrgName();
		console.log(currentOrg);
		for (var idx = 0; idx < orgs.length; idx++) {
			var org = orgs[idx];
			var match = org.orgName.toLowerCase();
			if (match === currentOrg) {
				applyStyle(org);
				return;
			}
		}
	};

	var getRules = function(org) {
		return [
			'body { padding-top: 40px !important; }',
			'header.slds-global-header_container { padding-top: 40px !important; }',
			'body::after {' +
				'position: fixed;' +
				'width: 100%;' +
				'height: 40px;' +
				'top: 0;' +
				'left: 0;' +
				'text-align: center;' +
				'content: "' + org.label + '";' +
				'background-color: ' + org.headerColor + ';' +
				'color: ' + org.textColor + ';' +
				'font-size: 20px;' +
				'font-weight: bold;' +
				'line-height: 40px;' +
				'z-index: 1000;' +
				'letter-spacing: 0.5px;' +
				'text-shadow: 0 -1px rgba(0, 0, 0, 0.65);' +
				'-webkit-user-select: none;' +
				'cursor: default;' +
				'box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.65);' +
			'}'
		];
	};

	var applyStyle = function(org) {
		var style = document.createElement('style');
		style.appendChild(document.createTextNode(''));
		document.head.appendChild(style);
		var rules = getRules(org);
		for (var idx = 0; idx < rules.length; idx++) {
			style.sheet.insertRule(rules[idx], idx);
		}
	};

	chrome.storage.onChanged.addListener(function(changes, areaName) {
		if (changes.hasOwnProperty('orgs')) {
			loadStyles();
		}
	});

	loadStyles();
})();
