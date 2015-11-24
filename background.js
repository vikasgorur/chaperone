(function () {
  // Number of sites visited in this minute.
  var count = 0;

  // Max number of sites that can be visited in a minute.
  var maxPerMinute = 3;

  // We only care about user-directed transitions.
  var transitionTypes = ["link", "typed", "auto_bookmark", "generated",
      "auto_toplevel", "form_submit", "keyword", "keyword_generated"];

  var recordNavigation = function (nav) {
    if (transitionTypes.indexOf(nav.transitionType) !== -1) {
      count += 1;
    }
  };

  var wakeup = function () {
    if (count >= maxPerMinute) {
      console.log("You've visited more than " + maxPerMinute + " sites in 1 minute!");
    }

    count = 0;
  };

  chrome.alarms.create("wakeup", {
      periodInMinutes: 1
  });

  chrome.alarms.onAlarm.addListener(function (alarm) {
      if (alarm.name === "wakeup") {
        wakeup();
      }
  });

  chrome.webNavigation.onCommitted.addListener(function (data) {
    /*
      Sample data:

        frameId: 0
        processId: 957
        tabId: 1258
        timeStamp: 1448351259547.2131
        transitionQualifiers: Array[2]
        transitionType: "typed"
        url: "https://news.ycombinator.com/"
    */
    recordNavigation(data);
  });
})();
