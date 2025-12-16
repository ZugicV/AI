const professors = [
  { id: "prof1", name: "Ana Petrović", subject: "Matematika", password: "ana123" },
  { id: "prof2", name: "Marko Jovanović", subject: "Fizika", password: "marko123" },
  { id: "prof3", name: "Ivana Ilić", subject: "Hemija", password: "ivana123" },
  { id: "prof4", name: "Luka Nikolić", subject: "Biologija", password: "luka123" },
  { id: "prof5", name: "Jelena Ristić", subject: "Engleski", password: "jelena123" },
  { id: "prof6", name: "Stefan Kovač", subject: "Programiranje", password: "stefan123" },
  { id: "prof7", name: "Marija Stanković", subject: "Istorija", password: "marija123" },
];

const timeSlots = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"];
const bookingStorageKey = "jednorogBookingsV1";
const viewerIdKey = "jednorogViewerId";

let weeklySlots = [];
let slotLookup = {};
let bookings = {};
let activeProfessorId = professors[0].id;
let viewerId = getOrCreateViewerId();
let currentSlotKey = null;
let currentProfessorForModal = null;
let loggedInProfessorId = null;

const roleChoice = document.getElementById("role-choice");
const studentView = document.getElementById("student-view");
const professorView = document.getElementById("professor-view");
const professorList = document.getElementById("professor-list");
const calendarGrid = document.getElementById("calendar-grid");
const activeProfessorName = document.getElementById("active-professor-name");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalSlotSummary = document.getElementById("modal-slot-summary");
const bookingForm = document.getElementById("booking-form");
const closeModalButton = document.getElementById("close-modal");
const backToRole = document.getElementById("back-to-role");
const backToRoleProfessor = document.getElementById("back-to-role-professor");
const loginForm = document.getElementById("login-form");
const loginSelect = document.getElementById("login-professor");
const loginPassword = document.getElementById("login-password");
const loginCard = document.getElementById("login-card");
const professorDashboard = document.getElementById("professor-dashboard");
const dashboardTitle = document.getElementById("dashboard-title");
const bookingTable = document.getElementById("booking-table");
const logoutButton = document.getElementById("logout");

init();

function init() {
  bookings = loadBookings();
  weeklySlots = generateWeeklySlots();
  slotLookup = buildSlotLookup(weeklySlots);
  renderProfessorChoices();
  renderLoginOptions();
  renderCalendar(activeProfessorId);
  attachEvents();
}

function attachEvents() {
  roleChoice?.addEventListener("click", (event) => {
    const role = event.target?.dataset?.role;
    if (!role) return;
    if (role === "student") {
      showStudentView();
    } else {
      showProfessorView();
    }
  });

  backToRole?.addEventListener("click", resetToRoleChoice);
  backToRoleProfessor?.addEventListener("click", resetToRoleChoice);

  closeModalButton?.addEventListener("click", hideModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) hideModal();
  });

  bookingForm?.addEventListener("submit", handleBookingSubmit);
  loginForm?.addEventListener("submit", handleLoginSubmit);
  logoutButton?.addEventListener("click", handleLogout);
}

function renderProfessorChoices() {
  professorList.innerHTML = "";
  professors.forEach((prof) => {
    const li = document.createElement("li");
    li.className = "professor-item" + (prof.id === activeProfessorId ? " active" : "");
    li.dataset.professorId = prof.id;

    const info = document.createElement("div");
    info.innerHTML = `<div class="professor-name">${prof.name}</div><div class="professor-subject">${prof.subject}</div>`;

    const badge = document.createElement("span");
    const bookedCount = getBookedCountForProfessor(prof.id);
    badge.className = "badge";
    badge.textContent = bookedCount ? `${bookedCount} termina` : "Novi termini";

    li.appendChild(info);
    li.appendChild(badge);
    li.addEventListener("click", () => {
      activeProfessorId = prof.id;
      renderProfessorChoices();
      renderCalendar(activeProfessorId);
    });

    professorList.appendChild(li);
  });
}

function renderLoginOptions() {
  loginSelect.innerHTML = "";
  professors.forEach((prof) => {
    const option = document.createElement("option");
    option.value = prof.id;
    option.textContent = `${prof.name} — ${prof.subject}`;
    loginSelect.appendChild(option);
  });
}

function showStudentView() {
  studentView.classList.remove("hidden");
  professorView.classList.add("hidden");
}

function showProfessorView() {
  professorView.classList.remove("hidden");
  studentView.classList.add("hidden");
}

function resetToRoleChoice() {
  studentView.classList.add("hidden");
  professorView.classList.add("hidden");
  roleChoice.scrollIntoView({ behavior: "smooth" });
}

function renderCalendar(professorId) {
  activeProfessorName.textContent = professors.find((p) => p.id === professorId)?.name || "";
  calendarGrid.innerHTML = "";

  weeklySlots.forEach((day) => {
    const col = document.createElement("div");
    col.className = "day-column";
    const header = document.createElement("div");
    header.innerHTML = `<div class="day-header">${day.label}</div><div class="day-date">${day.dateLabel}</div>`;
    col.appendChild(header);

    timeSlots.forEach((time) => {
      const slotKey = `${day.iso}|${time}`;
      const booking = bookings?.[professorId]?.[slotKey];
      const slotBtn = createSlotButton({ slotKey, booking, time, dayLabel: day.label });
      col.appendChild(slotBtn);
    });

    calendarGrid.appendChild(col);
  });
}

function createSlotButton({ slotKey, booking, time, dayLabel }) {
  const template = document.getElementById("slot-template");
  const button = template.content.firstElementChild.cloneNode(true);
  const status = getSlotStatus(booking);

  button.innerHTML = `<span>${time}</span><small>${status}</small>`;
  if (booking) {
    const isMine = booking.studentId === viewerId;
    button.classList.add(isMine ? "mine" : "busy");
    button.disabled = !isMine;
    button.title = isMine ? "Vaša rezervacija" : "Termin je zauzet";
  } else {
    button.addEventListener("click", () => {
      currentSlotKey = slotKey;
      currentProfessorForModal = activeProfessorId;
      modalTitle.textContent = `Rezervišite termin`;
      modalSlotSummary.textContent = `${dayLabel}, ${time} sa profesorom ${activeProfessorName.textContent}`;
      showModal();
    });
  }

  return button;
}

function getSlotStatus(booking) {
  if (!booking) return "Slobodan";
  return booking.studentId === viewerId ? "Vaš termin" : "Zauzeto";
}

function showModal() {
  modal.classList.remove("hidden");
}

function hideModal() {
  modal.classList.add("hidden");
  bookingForm.reset();
  currentSlotKey = null;
}

function handleBookingSubmit(event) {
  event.preventDefault();
  if (!currentSlotKey || !currentProfessorForModal) return;

  const name = document.getElementById("student-name").value.trim();
  const grade = document.getElementById("student-grade").value;
  const phone = document.getElementById("student-phone").value.trim();

  if (!name || !grade || !phone) return;

  const professorBookings = bookings[currentProfessorForModal] || {};
  if (professorBookings[currentSlotKey] && professorBookings[currentSlotKey].studentId !== viewerId) {
    alert("Termin je upravo zauzet. Molimo izaberite drugi.");
    hideModal();
    renderCalendar(currentProfessorForModal);
    return;
  }

  professorBookings[currentSlotKey] = {
    studentName: name,
    grade,
    phone,
    studentId: viewerId,
    createdAt: new Date().toISOString(),
  };

  bookings[currentProfessorForModal] = professorBookings;
  saveBookings(bookings);
  hideModal();
  renderProfessorChoices();
  renderCalendar(currentProfessorForModal);
  if (loggedInProfessorId === currentProfessorForModal) {
    renderProfessorBookings(loggedInProfessorId);
  }
  alert("Uspešno ste zakazali termin!");
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const selectedProf = loginSelect.value;
  const password = loginPassword.value.trim();
  const prof = professors.find((p) => p.id === selectedProf);

  if (!prof || prof.password !== password) {
    alert("Pogrešna lozinka. Pokušajte ponovo.");
    return;
  }

  loggedInProfessorId = prof.id;
  dashboardTitle.textContent = `${prof.name} — ${prof.subject}`;
  loginCard.classList.add("hidden");
  professorDashboard.classList.remove("hidden");
  renderProfessorBookings(loggedInProfessorId);
  loginPassword.value = "";
}

function handleLogout() {
  loggedInProfessorId = null;
  professorDashboard.classList.add("hidden");
  loginCard.classList.remove("hidden");
}

function renderProfessorBookings(professorId) {
  const profBookings = bookings[professorId] || {};
  const rows = Object.entries(profBookings).map(([key, details]) => {
    const slot = slotLookup[key] || fallbackSlot(key);
    return {
      key,
      slot,
      details,
    };
  });

  rows.sort((a, b) => new Date(a.slot.dateTime) - new Date(b.slot.dateTime));

  if (!rows.length) {
    bookingTable.innerHTML = `<p class="hint">Još uvek nema zakazanih termina.</p>`;
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  thead.innerHTML = `<tr><th>Datum</th><th>Vreme</th><th>Učenik</th><th>Razred</th><th>Telefon</th></tr>`;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  rows.forEach(({ slot, details }) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${slot.dateLabel}</td>
      <td>${slot.time}</td>
      <td>${details.studentName}</td>
      <td>${formatGrade(details.grade)}</td>
      <td>${details.phone}</td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  bookingTable.innerHTML = "";
  bookingTable.appendChild(table);
}

function formatGrade(grade) {
  if (!grade) return "";
  if (grade === "srednja") return "Srednja škola";
  return `${grade}. razred`;
}

function fallbackSlot(key) {
  const [date, time] = key.split("|");
  return {
    dateLabel: formatDateLabel(date),
    time,
    dateTime: `${date}T${time}`,
  };
}

function getBookedCountForProfessor(professorId) {
  return Object.keys(bookings[professorId] || {}).length;
}

function generateWeeklySlots() {
  const start = startOfWeek(new Date());
  const days = [];
  const weekdayNames = ["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota", "Nedelja"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const iso = date.toISOString().slice(0, 10);
    days.push({
      iso,
      label: weekdayNames[i],
      dateLabel: formatDateLabel(iso),
      dateTime: date,
    });
  }

  return days;
}

function buildSlotLookup(days) {
  const map = {};
  days.forEach((day) => {
    timeSlots.forEach((time) => {
      const key = `${day.iso}|${time}`;
      map[key] = {
        dateLabel: day.dateLabel,
        dayLabel: day.label,
        time,
        dateTime: `${day.iso}T${time}`,
      };
    });
  });
  return map;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday as start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateLabel(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.`; // dd.mm.
}

function loadBookings() {
  try {
    const stored = localStorage.getItem(bookingStorageKey);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Neuspešno učitavanje", error);
    return {};
  }
}

function saveBookings(data) {
  try {
    localStorage.setItem(bookingStorageKey, JSON.stringify(data));
  } catch (error) {
    console.error("Neuspešno čuvanje", error);
  }
}

function getOrCreateViewerId() {
  let id = localStorage.getItem(viewerIdKey);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `student-${Date.now()}`;
    localStorage.setItem(viewerIdKey, id);
  }
  return id;
}
