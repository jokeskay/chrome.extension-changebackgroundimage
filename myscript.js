var backgroundNums = [];

for (var i = 0; i <=41; i++) {
  backgroundNums.push(i);
}

function onInitialize() {
  var backgroundOption = getOptions();
  if (backgroundOption !=null) {
    var backgroundNum = backgroundOption.backgroundNum;
    render(backgroundNum);
  }
  trackOpenPopup();
}

function render(interval) {
  if (window._rendered) {
    return false;
  }
  window._rendered=true;
  var html = [];
  var wrapper = $("wrapper");
  backgroundNums.forEach(function (item, index) {
    var backgroundClass = "background" + item,
        checked = item == interval ? ' checked' : '';
    if (item == 0) {
      	wrapper.append($('<input>').attr('type', 'radio'));
			wrapper.append($('<label></label>').addClass(bgClass).addClass("first").text("Return to Default"));

		} else {
			wrapper.append($('<input>').attr('type', 'radio'));
			wrapper.append($('<label></label>').addClass(bgClass));
    }
  });
}

function onEnable(element) {
  chrome.tabs.query({
    "url":"*://www.facebook.com/*"
  }, function (tabs) {
    for (var key in tabs) {
          chrome.tabs.sendMessage(tabs[key].id, {
            method: "change",
            backgroundNum: getOptions().backgroundNum
          }, function (response) {
            console.log("ok");
          });
    }
  });
  trackBackgroundClick(getOptions().backgroundNum);
}

function onDisable(element) {
  var currentElement = document.querySelector('.selected');
  
  if (currentElement) {
    if (currentElement === element) {
      	return false;
		} else {
			currentElement.classList.remove('selected');
		}
	}
  
  chrome.tabs.getSelected(null, function (tab) {
    var options = {};
    
    options.interval = "0";
    options.refresh= false;
    options.random= options.interval;
    
    updateOptions(tab, options);
    
    chrome.runtime.sendMessage({
      tab: tab,
      refresh: options.refresh
    } function (response) {
      console.log("ok");
    });
    window.close();
  });
  element.classList.add('selected');
  
}

function updateOptions(options) {

    saveOptions(options);
    
    return options;
}

function getOptions() {
  var backgroundOption = localStorage["backgroundOption"];
  if ( backgroundOption == null) {
      var backgroundOption = {};
      backgroundOption.backgroundNum = 0;
      backgroundOption.opacity = 0.8;
  } else {
    backgroundOption = JSON.parse(backgroundOption);
  }
  return backgroundOption;
}

function saveOptions(bgOption) {
  localStorage["backgroundOption"] = JSON.stringify(backgroundOption);
}

function openTab(url) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.create({
      url: url,
      index: tabs[0].index + 1,
      active: true,
      openerTabId: tabs[0].id
    });
  });
}

onInitialize
     
