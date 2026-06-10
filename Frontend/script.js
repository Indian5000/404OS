function Update(){
                var CurrTime=new Date().toLocaleString();
                var timetxt= document.querySelector("#time");
                timetxt.innerHTML=CurrTime;
            }
            setInterval(Update,1000);
// Make the DIV element draggable:
dragElement(document.getElementById("welcome"));

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
const welcomeWindow = document.querySelector("#welcome");
const openButton = document.querySelector("#welcomeopen");
const closeButton = document.querySelector("#welcomeclose");

function hideWindow(win) {
    win.style.display = "none";
}
function showWindow(win) {win.style.display = "block";}
closeButton.addEventListener("click", () => {hideWindow(welcomeWindow);});
openButton.addEventListener("click", () => {showWindow(welcomeWindow);});
var selectedIcon = undefined;
function SelectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element;
}
function DeselectIcon(element) {
  element.classList.remove("selected");
  selectedIcon = undefined;
}
function handleIconTap(element) {
  if (element.classList.contains("selected")) {
    DeselectIcon(element);
    openAppWindow(element);
  } else {
    SelectIcon(element);
  }
}
function openAppWindow(iconElement) {
  const appMap = {
    "Desktop App1": noteAppWindow,
    "welcomeicon":  welcomeWindow,
  };
  const win = appMap[iconElement.id];
  if (win) showWindow(win);
}
//Notes App Looooogic
dragElement(document.getElementById("noteapp"));
const noteAppWindow = document.querySelector("#noteapp");
const noteAppCloseBtn = document.querySelector("#noteappclose");
noteAppCloseBtn.addEventListener("click", () => hideWindow(noteAppWindow));
// Strotavarius (Storage)
let notes = JSON.parse(localStorage.getItem("webos_notes") || "[]");
let activeNoteId = null;
const noteList      = document.getElementById("noteList");
const noteTitleInput = document.getElementById("noteTitleInput");
const noteBodyInput  = document.getElementById("noteBodyInput");
const noteTimestamp  = document.getElementById("noteTimestamp");
const deleteNoteBtn  = document.getElementById("deleteNoteBtn");
const newNoteBtn     = document.getElementById("newNoteBtn");
function saveNotes() {
  localStorage.setItem("webos_notes", JSON.stringify(notes));
}
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
function formatDate(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}
function renderList() {
  noteList.innerHTML = "";
  if (notes.length === 0) {
    noteList.innerHTML = `<div class="NoteApp_empty"><span>📝</span>No notes yet</div>`;
    return;
  }
  notes.forEach(note => {
    const li = document.createElement("li");
    li.className = "NoteApp_listItem" + (note.id === activeNoteId ? " active" : "");
    li.dataset.id = note.id;
    li.innerHTML = `
      <div class="NoteApp_listItem_title">${note.title || "Untitled"}</div>
      <div class="NoteApp_listItem_preview">${note.body.replace(/\n/g," ") || "No content"}</div>
    `;
    li.addEventListener("click", () => loadNote(note.id));
    noteList.appendChild(li);
  });
}
function loadNote(id) {
  activeNoteId = id;
  const note = notes.find(n => n.id === id);
  if (!note) return;
  noteTitleInput.value = note.title;
  noteBodyInput.value  = note.body;
  noteTimestamp.textContent = "Edited " + formatDate(note.updatedAt);
  deleteNoteBtn.disabled = false;
  deleteNoteBtn.removeAttribute("disabled");
  renderList();
}
function showEmptyEditor() {
  activeNoteId = null;
  noteTitleInput.value = "";
  noteBodyInput.value  = "";
  noteTimestamp.textContent = "";
  deleteNoteBtn.disabled = true;
  renderList();
}
function updateActiveNote() {
  if (!activeNoteId) return;
  const note = notes.find(n => n.id === activeNoteId);
  if (!note) return;
  note.title     = noteTitleInput.value;
  note.body      = noteBodyInput.value;
  note.updatedAt = Date.now();
  noteTimestamp.textContent = "Edited " + formatDate(note.updatedAt);
  saveNotes();
  renderList();
}
newNoteBtn.addEventListener("click", () => {
  const note = {
    id: genId(),
    title: "",
    body: "",
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  notes.unshift(note);
  saveNotes();
  loadNote(note.id);
  noteTitleInput.focus();
});
deleteNoteBtn.addEventListener("click", () => {
  if (!activeNoteId) return;
  notes = notes.filter(n => n.id !== activeNoteId);
  saveNotes();
  showEmptyEditor();
});
noteTitleInput.addEventListener("input", updateActiveNote);
noteBodyInput.addEventListener("input", updateActiveNote);
if (notes.length > 0) loadNote(notes[0].id);
else showEmptyEditor();