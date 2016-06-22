var ORG_KEY = 'orgs';
var TBODY_ID = 'orgsTableBody';
var ORG_ROW_CLASS = 'org-row';
var TABLE_ID = 'orgsTable';
var ATTRIBUTES = [
	'orgName',
	'headerColor',
	'textColor',
	'label'
];

var readOrgsFromDOM = function() {
	var el = document.getElementById(TBODY_ID);
	var rows = el.getElementsByClassName(ORG_ROW_CLASS);
	var orgs = [];
	if (typeof rows !== 'undefined') {
		for (var idx = 0; idx < rows.length; idx++) {
			orgs.push(orgFromDom(rows[idx]));
		}
	}
	return orgs;
};

var removeOrg = function(orgToRemove) {
	var orgs = readOrgsFromDOM();
	orgs = orgs.filter(function(org) {
		return orgToRemove.orgName !== org.orgName;
	});
	render(orgs);
};

var initialize = function(done) {
	chrome.storage.sync.get(ORG_KEY, function(results) {
		if (!Array.isArray(results[ORG_KEY])) {
			var settings = {};
			settings[ORG_KEY] = [];
			chrome.storage.sync.set(settings, done);
		} else {
			done();
		}
	});
};

var addOrg = function() {
	var orgs = readOrgsFromDOM();
	orgs.push({
		orgName: '',
		headerColor: '',
		textColor: '',
		label: ''
	});
	render(orgs);
};


var orgFromDom = function(el) {
	var org = {};
	ATTRIBUTES.forEach(function(attr) {
		var matchingChildren = el.getElementsByClassName(attr);
		if (typeof matchingChildren !== 'undefined' && matchingChildren.length === 1) {
			var node = matchingChildren[0];
			org[attr] = node.value;
		}
	});
	return org;
};

var isOrgValid = function(org) {
	for (var idx = 0; idx < ATTRIBUTES.length; idx++) {
		if (!org.hasOwnProperty(ATTRIBUTES[idx])) {
			return false;
		}
	}
	if (org.orgName.length === 0) {
		return false;
	}
	return true;
};

var saveOrgs = function() {
	initialize(function() {
		var orgs = readOrgsFromDOM().filter(isOrgValid);
		var settings = {};
		settings[ORG_KEY] = orgs;
		chrome.storage.sync.set(settings, function() {
			render(orgs);
		});
	});
};

var getOrgCell = function(org) {
	var cell = document.createElement('td');
	var inp = document.createElement('input');
	inp.setAttribute('type', 'text');
	inp.setAttribute('placeholder', 'Org name');
	inp.classList.add('orgName');
	inp.value = org.orgName;
	cell.appendChild(inp);
	return cell;
};

var getHeaderColorCell = function(org) {
	var cell = document.createElement('td');
	var inp = document.createElement('input');
	inp.setAttribute('type', 'text');
	inp.setAttribute('placeholder', 'Background color');
	inp.classList.add('headerColor');
	inp.value = org.headerColor;
	cell.appendChild(inp);
	return cell;
};

var getTextColorCell = function(org) {
	var cell = document.createElement('td');
	var inp = document.createElement('input');
	inp.setAttribute('type', 'text');
	inp.setAttribute('placeholder', 'Text color');
	inp.classList.add('textColor');
	inp.value = org.textColor;
	cell.appendChild(inp);
	return cell;
};

var getLabelCell = function(org) {
	var cell = document.createElement('td');
	var inp = document.createElement('input');
	inp.setAttribute('type', 'text');
	inp.setAttribute('placeholder', 'Header label');
	inp.classList.add('label');
	inp.value = org.label;
	cell.appendChild(inp);
	return cell;
};

var getRemoveCell = function(org) {
	var cell = document.createElement('td');
	var link = document.createElement('a');
	link.innerText = 'Remove';
	link.addEventListener('click', function() {
		removeOrg(org);
	});
	cell.appendChild(link);
	return cell;
};

var getOrgRow = function(org) {
	var row = document.createElement('tr');
	row.classList.add(ORG_ROW_CLASS);
	row.appendChild(getOrgCell(org));
	row.appendChild(getHeaderColorCell(org));
	row.appendChild(getTextColorCell(org));
	row.appendChild(getLabelCell(org));
	row.appendChild(getRemoveCell(org));
	return row;
};

var render = function(orgs) {
	clearTable();
	var el = document.getElementById(TBODY_ID);
	orgs.forEach(function(org) {
		el.appendChild(getOrgRow(org));
	});
};

var clearTable = function() {
	var body = document.getElementById(TBODY_ID);
	var table = document.getElementById(TABLE_ID);
	table.removeChild(body);
	var newBody = document.createElement('tbody');
	newBody.id = TBODY_ID;
	table.appendChild(newBody);
};

document.getElementById('addOrgBtn').addEventListener('click', addOrg);
document.getElementById('saveBtn').addEventListener('click', saveOrgs);

initialize(function() {
	chrome.storage.sync.get(ORG_KEY, function(result) {
		render(result[ORG_KEY]);
	});
});
