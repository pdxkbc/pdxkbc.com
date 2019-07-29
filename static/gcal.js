export {};

async function main() {
  const root = document.getElementById("next-meetup");
  try {
    showMeetup(root, await getNextMeetup());
  } catch (err) {
    console.error(err);
    showError(root);
  }
}

async function getNextMeetup() {
  const calendarID = "9t66vmq669mbkbtckbt0n9k1ek@group.calendar.google.com";
  const key = "AIzaSyCntMy61tYlDNVg8ZhJXhjQqG3RkGzhnSk";
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const timeMin = date.toISOString();
  date.setDate(31);
  date.setMonth(date.getMonth() + 3);
  const timeMax = date.toISOString();
  const params = new URLSearchParams({
    orderBy: "startTime",
    singleEvents: true,
    timeMin,
    timeMax,
    key
  });
  const prefix = "https://content.googleapis.com/calendar/v3";
  const url = `${prefix}/calendars/${calendarID}/events?${params}`;
  const response = await fetch(url);
  const data = await response.json();
  const nextMeetup = data.items[0];
  if (!nextMeetup) {
    throw new Error("failed to load meetup");
  }
  return nextMeetup;
}

const dateFormatter = Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric"
});

function showMeetup(root, meetup) {
  root.replaceWith(
    meetup.summary,
    document.createElement("br"),
    meetup.location,
    document.createElement("br"),
    document.createElement("br"),
    dateFormatter.format(new Date(meetup.start.dateTime))
  );
}

function showError(root) {
  root.replaceWith("Oops, something went wrong loading from Google Calendar.");
}

main();
