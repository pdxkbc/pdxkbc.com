export {};

const root = document.getElementById("next-meetup");
const html = String.raw;

async function getNextMeetup() {
  const calendarID = "9t66vmq669mbkbtckbt0n9k1ek@group.calendar.google.com";
  const key = "AIzaSyCntMy61tYlDNVg8ZhJXhjQqG3RkGzhnSk";
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const timeMin = date.toISOString();
  date.setMonth(date.getMonth() + 1);
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

async function main() {
  try {
    showMeetup(await getNextMeetup());
  } catch (err) {
    console.error(err);
    showError();
  }
}

const dateFormatter = Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric"
});

function showMeetup(meetup) {
  root.innerHTML = html`
    <span data-slot="summary"></span><br />
    <span data-slot="date"></span><br /><br />
    <span data-slot="location"></span>
  `;
  root.querySelector("[data-slot=summary]").textContent = meetup.summary;
  root.querySelector("[data-slot=location]").textContent = meetup.location;
  root.querySelector("[data-slot=date]").textContent = dateFormatter.format(
    new Date(meetup.start.dateTime)
  );
}

function showError() {
  root.textContent = "Oops, something went wrong loading from Google Calendar.";
}

main();
