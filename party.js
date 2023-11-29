const COHORT = "2310-FSA-ET-WEB-PT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getEvents();
  renderEvents();
}
render();

/**
 * Update state with parties from API
 */
async function getEvents() {

  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Render events from state
 */
function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = "<li>No Events.</li>";
    return;
  }

  const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${event.name}</h2>
      <p>${event.date}</p>
      <p>${event.location}</p>
      <p>${event.description}</p>
      <button class="delete" id="${event.id}">Delete</button>
      `;
      const delEventBtn = li.querySelector(".delete");
      delEventBtn.addEventListener("click", () => {
      const eventId = event.id;
      delEvent(eventId);
      console.log(eventId);
    });
    return li;
  });

  eventList.replaceChildren(...eventCards);
}


/**
 * Ask the API to create a new event based on form data
 * @param {Event} event
 */
async function addEvent(event) {
  event.preventDefault();

  try {
      const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        date: addEventForm.date.value,
        location: addEventForm.location.value,
        description: addEventForm.description.value
      })
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}
async function delEvent(eventId) {
  event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${eventId}`, {
        method: "DELETE",
        headers: {"content-Type": "application/json"}
    });
    if(!response.ok){
      throw new Error("Failed to delete event");
    }
    render();
    } catch(error){
      console.log(error);
    }
  };