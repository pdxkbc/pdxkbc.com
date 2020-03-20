class PDXKBCNextMeetupElement extends HTMLElement {
  async connectedCallback() {
    try {
      const meetup = await getNextMeetup();
      this.innerHTML = "";
      this.append(
        meetup.summary,
        document.createElement("br"),
        meetup.location,
        document.createElement("br"),
        document.createElement("br"),
        dateFormatter.format(new Date(meetup.start.dateTime))
      );
    } catch (err) {
      console.error(err);
      this.textContent = "Failed to load next meetup from Google Calendar.";
    }
  }
}

customElements.define("pdxkbc-next-meetup", PDXKBCNextMeetupElement);

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

export {};
