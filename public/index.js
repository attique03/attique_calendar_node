let events = [];
let createdEvents = [];
let eventsData = [];
let allDayeventsData = [];

const form = document.querySelector("form");
const deletebtn = document.querySelector(".btn-delete");

// Function to fetch Events for a whole day
async function getAllDayEvents() {
  const endpoint = "/events/allDayEvents";
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data) {
      allDayeventsData = data;
    }

    // Loop to fill all day events.
    for (let i = 0; i < allDayeventsData.length; i++) {
      let event = document.createElement("div");

      event.append(
        (document.createElement("span").innerText = "All Day - "),
        (document.createElement("b").innerText =
          allDayeventsData[i].name + " - "),
        (document.createElement("span").innerText =
          allDayeventsData[i].location)
      );
      event.classList.add("all-day-event-data");
      document.querySelector(".all-day-section").append(event);

      event.addEventListener("click", function () {
        window.location.href = `/event/${allDayeventsData[i]._id}`;
      });
    }
  } catch (err) {
    console.log("Error => ", err);
  }
}
getAllDayEvents();

async function getEvents() {
  const endpoint = "/events/allevents";

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data) {
      eventsData = data;
    }

    // Get Time from Data.Js File
    for (let i = 0; i < eventsData.length; i++) {
      createEvent(
        eventsData[i].startTime,
        eventsData[i].endTime,
        eventsData[i].name,
        eventsData[i].location,
        eventsData[i]._id
      );
    }

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
      for (let i = 0; i < createdEvents.length - 1; i++) {
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
  } catch (err) {
    console.log("Error => ", err);
  }
}

getEvents();

// ___________ Modal _________________
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModalBtn = document.querySelector(".btn-close");

// close modal function
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// close the modal when the close button and overlay is clicked
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// open modal function
async function openModal(id) {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");

  // Get Event by Id
  const endpoint = `/events/getEvent/${id}`;
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (data) {
      form.startTime.value = data.startTime;
      form.endTime.value = data.endTime;
      form.name.value = data.name;
      form.location.value = data.location;
    }
  } catch (err) {
    console.log("Single Event Fetch Error ", err);
  }

  // Update Event by Id
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // get values
    const startTime = form.startTime.value;
    const endTime = form.endTime.value;
    const name = form.name.value;
    const location = form.location.value;

    const endpoint = `/events/update/${id}`;

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        body: JSON.stringify({ startTime, endTime, name, location }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data) {
        window.location.href = "/events";
      }
    } catch (err) {
      console.log("Error => ", err);
      window.location.href = "/events";
    }
  });

  // Delete Event by Id
  deletebtn.addEventListener("click", function () {
    const endpoint = `/events/delete/${id}`;

    fetch(endpoint, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => (window.location.href = data.redirect))
      .catch((err) => console.log(err));
  });
}

// Loop to select all the elements to display events on the calendar.
for (let i = 0; i < 24; i++) {
  events[i] = document.querySelector(`#event-${i + 1}`);
}

// Function to Create Event and fill the corresponding section with Start and End time.
function createEvent(startTime, endTime, name, location, eventId) {
  let newEvent;

  if (startTime % 2 === 0) {
    newEvent = events[startTime - 2].appendChild(
      eventContent(startTime, name, location, eventId)
    );
  } else {
    newEvent = events[startTime].appendChild(
      eventContent(startTime, name, location, eventId)
    );
  }

  newEvent.dataset.target = "#myModal";
  newEvent.dataset.modal = "modal";

  newEvent.addEventListener("click", function () {
    openModal(newEvent.id);
  });

  newEvent.classList.add("event");
  if (startTime % 2 === 0) {
    newEvent.style.height = (endTime - startTime) * 37.2 + "px";
  } else {
    newEvent.style.height = (endTime - startTime) * 33.5 + "px";
  }
  createdEvents.push(newEvent);
}

// function to create events box
function eventContent(startTime, name, location, eventId) {
  const eventDiv = document.createElement("div");
  eventDiv.classList.add("event-content");
  eventDiv.id = eventId;

  const eventTime = document.createElement("span");
  eventTime.classList.add("all-day");
  eventTime.textContent = convertToActualTime(startTime);

  const eventName = document.createElement("b");
  eventName.classList.add("sample-item");
  eventName.textContent = name;

  const eventLocation = document.createElement("span");
  eventLocation.classList.add("sample-location");
  eventLocation.textContent = location;
  eventLocation.style.marginLeft = "0px";

  const eventFlex = document.querySelector(".event");
  const eventDivData = eventFlex.appendChild(eventDiv);
  eventDivData.appendChild(eventTime);
  eventDivData.appendChild(eventName);
  eventDivData.appendChild(eventLocation);

  return eventDiv;
}

function convertToActualTime(time) {
  return time === "1"
    ? "9:00AM"
    : time === "2"
    ? "9:30AM"
    : time === "3"
    ? "10:00AM"
    : time === "4"
    ? "10:30AM"
    : time === "5"
    ? "11:00AM"
    : time === "6"
    ? "11:30AM"
    : time === "7"
    ? "12:00PM"
    : time === "8"
    ? "12:30PM"
    : time === "9"
    ? "1:00PM"
    : time === "10"
    ? "1:30PM"
    : time === "11"
    ? "2:00PM"
    : time === "12"
    ? "2:30PM"
    : time === "13"
    ? "3:00PM"
    : time === "14"
    ? "3:30PM"
    : time === "15"
    ? "4:00PM"
    : time === "16"
    ? "4:30PM"
    : time === "17"
    ? "5:00PM"
    : time === "18"
    ? "5:30PM"
    : time === "19"
    ? "6:00PM"
    : time === "20"
    ? "6:30PM"
    : time === "21"
    ? "7:00PM"
    : time === "22"
    ? "7:30PM"
    : time === "23"
    ? "8:00PM"
    : time === "24"
    ? "8:30PM"
    : "Wrong time";
}
