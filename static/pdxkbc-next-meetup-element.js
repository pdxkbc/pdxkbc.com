class PDXKBCNextMeetupElement extends HTMLElement {
  async connectedCallback() {
    try {
      const meetup = await getNextMeetup();
      // debugger;
      this.innerHTML = "";
      const line = document.createElement("div");
      line.className = "bt b--black-10 ma2";
      this.append(
        meetup.summary,
        line.cloneNode(true),
        meetup.location,
        line.cloneNode(true),
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

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric"
});

export {};
