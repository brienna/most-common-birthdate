// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '1027515279431-2eanqpn3m3obfgvt2hfrp2dn52cdrkj3.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadCalendarApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var oneYearLater = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  var request = gapi.client.calendar.events.list({
    'calendarId': "v125kfs7efpibo8ihl38m6csmnrqrf4v@import.calendar.google.com",
    'timeMin': tomorrow.toISOString(),
    'timeMax': oneYearLater.toISOString(),
    'maxResults': 5000,  // current limit for FB friends
    'showDeleted': false,
    'singleEvents': true,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;
    appendPre('Birthdays:');

    if (events.length > 0) {
      calculateFrequencies(events);

      /*
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        appendPre(event.summary + ' (' + when + ')')
      }
      */

    } else {
      appendPre('No upcoming events found. Did you export?');
    }

  });
}

function calculateFrequencies(events) {
  frequencies = {};

  // Sort days 
  for (event in events) {
    day = events[event].start.date
    if (frequencies[day]) {
      frequencies[day]++;
    } else {
      frequencies[day] = 1;
    }
  }

  // Count days
  dayWithMostBirthdays = Object.keys(frequencies).reduce(function(a, b){ 
    return frequencies[a] > frequencies[b] ? a : b; 
  });

  appendPre('Day with most birthdays: ' + dayWithMostBirthdays)
}


/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('output');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}