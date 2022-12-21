// import { eventsData, allDayeventsData } from "./data.js";

let events = [];
let createdEvents = [];

async function getEvents() {
    const endpoint = 'http://localhost:3010/events/allevents';

        try {
          const res = await fetch(endpoint, {
            method: "GET",
            // body: JSON.stringify({ title, snippet, body }),
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          console.log("Data ==> ", data);
          if (data) {
            location.assign("/");
          }
        } catch (err) {
          console.log("Error => ", err);
          location.assign("/");
        }
}

getEvents();

// Loop to select all the elements to display events on the calendar.
for (let i = 0; i < 24; i++) {
  events[i] = document.querySelector(`#event-${i + 1}`);
}

console.log("Events ", events);

// Loop to fill all day events.
for (let i = 0; i < allDayeventsData.length; i++) {
  let event = document.createElement("div");

  event.append(
    (document.createElement("span").innerText = "All Day - "),
    (document.createElement("b").innerText = allDayeventsData[i].name),
    (document.createElement("span").innerText = allDayeventsData[i].location)
  );
  event.classList.add("all-day-event-data");
  console.log(event);
  document.querySelector(".all-day-section").append(event);
}

// Function to Create Event and fill the corresponding section with Start and End time.
function createEvent(startTime, endTime) {
  let newEvent = events[startTime].appendChild(eventContent(startTime));
  newEvent.classList.add("event");
  newEvent.style.height = (endTime - startTime) * 70 + "px";
  createdEvents.push(newEvent);
}

console.log("lkdjl ", convertToActualTime(2));

// Get Time from Data.Js File
for (let i = 0; i < eventsData.length; i++) {
  createEvent(eventsData[i].stime, eventsData[i].etime);
}

// Check if two events overlap
function elementsOverlap(el1, el2) {
  let domRect1 = el1.getBoundingClientRect();
  let domRect2 = el2.getBoundingClientRect();

  return !(
    domRect1.top > domRect2.bottom ||
    domRect1.right < domRect2.left ||
    domRect1.bottom < domRect2.top ||
    domRect1.left > domRect2.right
  );
}

// Fix OverLap and prevent from colliding.
function fixOverLap() {
  for (let i = 0; i < createdEvents.length; i++) {
    if (elementsOverlap(createdEvents[i], createdEvents[i + 1])) {
      let divWidth = 100 / createdEvents.length;
      createdEvents[i].style.width = `${divWidth}%`;
      createdEvents[i + 1].style.width = `${divWidth}%`;

      if (createdEvents.length === 2) {
        createdEvents[i + 1].style.width = null;
        createdEvents[i + 1].style.marginLeft = `${450}px`;
      } else if (createdEvents.length === 3) {
        if (i == 1) {
          createdEvents[i + 1].style.width = null;
          createdEvents[i].style.marginLeft = `${320}px`;
          createdEvents[i + 1].style.marginLeft = `${590}px`;
        }
      } else {
        createdEvents[i + 1].style.marginLeft = `${350}px`;
      }
    }
  }
}

fixOverLap();

// function to create events box
function eventContent(startTime) {
  console.log("Time --- ", startTime);
  const eventDiv = document.createElement("div");
  eventDiv.classList.add("event-content");

  const eventTime = document.createElement("span");
  eventTime.classList.add("all-day");
  eventTime.textContent = convertToActualTime(startTime);

  const eventName = document.createElement("b");
  eventName.classList.add("sample-item");
  eventName.textContent = "Sample Item";

  const eventLocation = document.createElement("span");
  eventLocation.classList.add("sample-location");
  eventLocation.textContent = "Sample Location";
  eventLocation.style.marginLeft = "0px";

  const eventFlex = document.querySelector(".event");
  const eventDivData = eventFlex.appendChild(eventDiv);
  eventDivData.appendChild(eventTime);
  eventDivData.appendChild(eventName);
  eventDivData.appendChild(eventLocation);

  return eventDiv;
}

function convertToActualTime(time) {
  return time === 1
    ? "9:00AM"
    : time === 2
    ? "10:00AM"
    : time === 3
    ? "10:30AM"
    : time === 4
    ? "11:00AM"
    : time === 5
    ? "11:30AM"
    : time === 6
    ? "12:00PM"
    : time === 7
    ? "12:30PM"
    : time === 8
    ? "1:00PM"
    : time === 9
    ? "1:30PM"
    : time === 10
    ? "2:00PM"
    : time === 11
    ? "2:30PM"
    : time === 12
    ? "3:00PM"
    : time === 13
    ? "3:30PM"
    : time === 14
    ? "4:00PM"
    : time === 15
    ? "4:30PM"
    : time === 16
    ? "5:30PM"
    : time === 17
    ? "6:00PM"
    : time === 18
    ? "6:30PM"
    : time === 19
    ? "7:00PM"
    : time === 20
    ? "7:30PM"
    : time === 21
    ? "8:00PM"
    : time === 22
    ? "8:30PM"
    : "Wrong time";
}
