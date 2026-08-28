/**
 * Mood & Habit Tracker — script.js
 * Vanilla JavaScript only, no libraries or frameworks.
 *
 * Sections:
 *  1.  Constants & Local Storage Keys
 *  2.  Local Storage Helpers
 *  3.  Utility Helpers
 *  4.  Theme  (Challenge 1 — Light/Dark Mode)
 *  5.  Clock & Date (real-time)
 *  6.  Greeting  (Challenge 2 — Custom Name)
 *  7.  Mood Tracker
 *  8.  Habit Tracker  (Challenge 3 — Prevent Duplicates)
 *  9.  Toast Notifications
 * 10.  Bootstrap / Init
 */

'use strict';

/* ============================================================
   1. CONSTANTS & LOCAL STORAGE KEYS
   ============================================================ */

const LS = {
  tasks:       'habitTrackerTasks',
  name:        'habitTrackerName',
  theme:       'habitTrackerTheme',
  moods:       'habitTrackerMoods',
  dailyStatus: 'habitTrackerDailyStatus',
};

/** 3 default habits seeded on first visit */
const DEFAULT_HABITS = [
  { id: 'default-1', name: 'Minum Air 2L' },
  { id: 'default-2', name: 'Olahraga 15 Menit' },
  { id: 'default-3', name: 'Membaca Buku' },
];

const MOOD_META = {
  great:   { emoji: '😄', label: 'Sangat Senang' },
  happy:   { emoji: '🙂', label: 'Senang'        },
  neutral: { emoji: '😐', label: 'Biasa'          },
  sad:     { emoji: '😔', label: 'Sedih'          },
  bad:     { emoji: '😞', label: 'Kecewa'         },
};

/* ============================================================
   2. LOCAL STORAGE HELPERS
   ============================================================ */

function lsGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage full or unavailable — fail silently */
  }
}

/* ============================================================
   3. UTILITY HELPERS
   ============================================================ */

/** Return today's date string as YYYY-MM-DD */
function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Return YYYY-MM-DD for a Date object offset by `offsetDays` from today */
function dateKey(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Short day name in Bahasa Indonesia */
function shortDayName(offsetDays = 0) {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return days[d.getDay()];
}

/** Short date number (e.g. "26") */
function shortDayNumber(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.getDate();
}

/** Generate a simple unique ID */
function generateId() {
  return `habit-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
}

/* ============================================================
   4. THEME  (Challenge 1 — Light/Dark Mode)
   ============================================================ */

const themeToggleBtn = document.getElementById('themeToggle');
const themeIconEl    = document.getElementById('themeIcon');

function applyTheme(theme) {
  document.body.classList.remove('dark', 'light');
  document.body.classList.add(theme);
  themeIconEl.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggleBtn.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'
  );
}

function toggleTheme() {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
  lsSet(LS.theme, next);
}

function initTheme() {
  const saved = lsGet(LS.theme, 'dark');
  applyTheme(saved);
  themeToggleBtn.addEventListener('click', toggleTheme);
}

/* ============================================================
   5. CLOCK & DATE (real-time)
   ============================================================ */

const clockTimeEl = document.getElementById('clockTime');
const clockDateEl = document.getElementById('clockDate');

function formatClock(date) {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
}

function formatDate(date) {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function updateClock() {
  const now = new Date();
  clockTimeEl.textContent = formatClock(now);
  clockDateEl.textContent = formatDate(now);
  updateGreetingLabel(now.getHours());
}

function initClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

/* ============================================================
   6. GREETING  (Challenge 2 — Custom Name)
   ============================================================ */

const greetingTextEl  = document.getElementById('greetingText');
const greetingNameEl  = document.getElementById('greetingName');
const nameFormEl      = document.getElementById('nameForm');
const nameInputEl     = document.getElementById('nameInput');
const saveNameBtn     = document.getElementById('saveNameBtn');
const cancelNameBtn   = document.getElementById('cancelNameBtn');
const editNameBtn     = document.getElementById('editNameBtn');

function getGreetingLabel(hour) {
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

/** Called every second from the clock tick */
function updateGreetingLabel(hour) {
  greetingTextEl.textContent = getGreetingLabel(hour);
}

function renderGreetingName(name) {
  greetingNameEl.textContent = name ? `${name}!` : '!';
}

function showNameForm() {
  nameInputEl.value = lsGet(LS.name, '');
  nameFormEl.hidden = false;
  editNameBtn.hidden = true;
  nameInputEl.focus();
}

function hideNameForm() {
  nameFormEl.hidden = true;
  editNameBtn.hidden = false;
}

function saveName() {
  const name = nameInputEl.value.trim();
  lsSet(LS.name, name);
  renderGreetingName(name);
  hideNameForm();
  showToast(name ? `Halo, ${name}! 👋` : 'Nama dihapus.', 'success');
}

function initGreeting() {
  renderGreetingName(lsGet(LS.name, ''));
  nameFormEl.hidden = true;
  editNameBtn.hidden = false;

  editNameBtn.addEventListener('click', showNameForm);
  saveNameBtn.addEventListener('click', saveName);
  cancelNameBtn.addEventListener('click', hideNameForm);

  nameInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  saveName();
    if (e.key === 'Escape') hideNameForm();
  });
}

/* ============================================================
   7. MOOD TRACKER
   ============================================================ */

const moodFeedbackEl   = document.getElementById('moodFeedback');
const todayMoodBadgeEl = document.getElementById('todayMoodBadge');
const weeklyMoodGrid   = document.getElementById('weeklyMoodGrid');
const moodBtns         = document.querySelectorAll('.mood-btn');

function loadMoods() {
  const data = lsGet(LS.moods, {});
  return typeof data === 'object' && data !== null ? data : {};
}

function saveMoodForToday(mood) {
  const moods = loadMoods();
  moods[todayKey()] = mood;
  lsSet(LS.moods, moods);
}

/** Update badge next to the card title */
function renderMoodBadge(mood) {
  if (!mood) {
    todayMoodBadgeEl.textContent = 'Belum dipilih';
    todayMoodBadgeEl.className = 'mood-badge';
    return;
  }
  const meta = MOOD_META[mood];
  todayMoodBadgeEl.textContent = `${meta.emoji} ${meta.label}`;
  todayMoodBadgeEl.className = `mood-badge mood-badge--${mood}`;
}

/** Highlight the active mood button */
function highlightMoodBtn(mood) {
  moodBtns.forEach((btn) => {
    btn.classList.toggle('mood-btn--active', btn.dataset.mood === mood);
  });
}

/** Show short feedback message below the mood picker */
function showMoodFeedback(mood) {
  const messages = {
    great:   '🎉 Luar biasa! Semoga harimu terus menyenangkan!',
    happy:   '😊 Senang mendengarnya! Pertahankan ya!',
    neutral: '😐 Hari yang biasa, tapi tetap produktif!',
    sad:     '😔 Tidak apa-apa, besok pasti lebih baik.',
    bad:     '💪 Tetap semangat! Kamu bisa melewatinya.',
  };
  moodFeedbackEl.textContent = messages[mood] ?? '';
}

/** Render the 7-day weekly mood strip */
function renderWeeklyMood() {
  const moods = loadMoods();
  weeklyMoodGrid.innerHTML = '';

  for (let i = -6; i <= 0; i++) {
    const key   = dateKey(i);
    const mood  = moods[key] || null;
    const meta  = mood ? MOOD_META[mood] : null;
    const isToday = i === 0;

    const cell = document.createElement('div');
    cell.className = 'week-day';
    if (isToday)       cell.classList.add('week-day--today');
    if (mood)          cell.classList.add(`week-day--${mood}`);

    const dayName = document.createElement('span');
    dayName.className = 'week-day__name';
    dayName.textContent = shortDayName(i);

    const emoji = document.createElement('span');
    emoji.className = 'week-day__emoji';
    emoji.textContent = meta ? meta.emoji : '·';
    emoji.setAttribute('aria-label', meta ? meta.label : 'Belum ada data');

    const dateNum = document.createElement('span');
    dateNum.className = 'week-day__date';
    dateNum.textContent = shortDayNumber(i);

    cell.appendChild(dayName);
    cell.appendChild(emoji);
    cell.appendChild(dateNum);
    weeklyMoodGrid.appendChild(cell);
  }
}

function handleMoodClick(e) {
  const btn = e.currentTarget;
  const mood = btn.dataset.mood;
  if (!mood) return;

  saveMoodForToday(mood);
  highlightMoodBtn(mood);
  renderMoodBadge(mood);
  showMoodFeedback(mood);
  renderWeeklyMood();
  showToast(`Mood dicatat: ${MOOD_META[mood].emoji} ${MOOD_META[mood].label}`, 'success');
}

function initMood() {
  moodBtns.forEach((btn) => btn.addEventListener('click', handleMoodClick));

  // Restore today's mood on load
  const moods   = loadMoods();
  const todayMood = moods[todayKey()] || null;
  if (todayMood) {
    highlightMoodBtn(todayMood);
    renderMoodBadge(todayMood);
    showMoodFeedback(todayMood);
  }

  renderWeeklyMood();
}

/* ============================================================
   8. HABIT TRACKER  (Challenge 3 — Prevent Duplicates)
   ============================================================ */

const habitFormEl     = document.getElementById('habitForm');
const habitInputEl    = document.getElementById('habitInput');
const habitListEl     = document.getElementById('habitList');
const habitEmptyEl    = document.getElementById('habitEmpty');
const habitFeedbackEl = document.getElementById('habitFeedback');
const habitDateEl     = document.getElementById('habitDate');
const progressLabelEl = document.getElementById('progressLabel');
const progressPctEl   = document.getElementById('progressPct');
const progressFillEl  = document.getElementById('progressFill');
const progressBgEl    = document.getElementById('progressBg');

// Edit modal elements
const editModalEl     = document.getElementById('editModal');
const editHabitInput  = document.getElementById('editHabitInput');
const editSaveBtn     = document.getElementById('editSaveBtn');
const editCancelBtn   = document.getElementById('editCancelBtn');

let editingHabitId = null;

/* -- Data helpers -- */

function loadHabits() {
  const data = lsGet(LS.tasks, null);
  if (!Array.isArray(data)) {
    // First visit: seed defaults and persist
    lsSet(LS.tasks, DEFAULT_HABITS);
    return DEFAULT_HABITS.map((h) => ({ ...h }));
  }
  return data;
}

function saveHabits(habits) {
  lsSet(LS.tasks, habits);
}

function loadDailyStatus() {
  const data = lsGet(LS.dailyStatus, {});
  return typeof data === 'object' && data !== null ? data : {};
}

function saveDailyStatus(statusMap) {
  lsSet(LS.dailyStatus, statusMap);
}

/** Get completed IDs for today as a Set */
function getTodayCompleted() {
  const statusMap = loadDailyStatus();
  const todayData = statusMap[todayKey()] || {};
  return new Set(Object.keys(todayData).filter((id) => todayData[id] === true));
}

/** Toggle a habit's completed status for today */
function toggleHabitStatus(id) {
  const statusMap = loadDailyStatus();
  if (!statusMap[todayKey()]) statusMap[todayKey()] = {};
  const current = statusMap[todayKey()][id] || false;
  statusMap[todayKey()][id] = !current;
  saveDailyStatus(statusMap);
}

/* -- Feedback -- */

function setHabitFeedback(message, type = 'error') {
  habitFeedbackEl.textContent = message;
  habitFeedbackEl.className = `habit-feedback habit-feedback--${type}`;
  clearTimeout(habitFeedbackEl._t);
  habitFeedbackEl._t = setTimeout(() => {
    habitFeedbackEl.textContent = '';
    habitFeedbackEl.className = 'habit-feedback';
  }, 3000);
}

/* -- Duplicate check (Challenge 3) -- */

function isDuplicate(habits, name, excludeId = null) {
  const norm = name.trim().toLowerCase();
  return habits.some(
    (h) => h.name.toLowerCase() === norm && h.id !== excludeId
  );
}

/* -- Progress bar -- */

function updateProgress(habits, completedSet) {
  const total = habits.length;
  const done  = habits.filter((h) => completedSet.has(h.id)).length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

  progressLabelEl.textContent = `${done} / ${total} selesai`;
  progressPctEl.textContent   = `${pct}%`;
  progressFillEl.style.width  = `${pct}%`;
  progressBgEl.setAttribute('aria-valuenow', pct);
}

/* -- Render -- */

function createHabitEl(habit, completedSet) {
  const isDone = completedSet.has(habit.id);

  const li = document.createElement('li');
  li.className = `habit-item${isDone ? ' habit-item--done' : ''}`;
  li.dataset.id = habit.id;

  // Checkbox button
  const checkbox = document.createElement('button');
  checkbox.className = 'habit-checkbox';
  checkbox.setAttribute('aria-label', isDone ? 'Batalkan selesai' : 'Tandai selesai');
  checkbox.setAttribute('title', isDone ? 'Batalkan selesai' : 'Tandai selesai');
  checkbox.addEventListener('click', () => {
    toggleHabitStatus(habit.id);
    renderHabits();
  });

  // Text
  const text = document.createElement('span');
  text.className = 'habit-text';
  text.textContent = habit.name;

  // Actions
  const actions = document.createElement('div');
  actions.className = 'habit-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'habit-action-btn';
  editBtn.textContent = '✏️';
  editBtn.setAttribute('aria-label', `Edit: ${habit.name}`);
  editBtn.setAttribute('title', 'Edit kebiasaan');
  editBtn.addEventListener('click', () => openEditModal(habit.id));

  const delBtn = document.createElement('button');
  delBtn.className = 'habit-action-btn habit-action-btn--delete';
  delBtn.textContent = '🗑️';
  delBtn.setAttribute('aria-label', `Hapus: ${habit.name}`);
  delBtn.setAttribute('title', 'Hapus kebiasaan');
  delBtn.addEventListener('click', () => deleteHabit(habit.id));

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  li.appendChild(checkbox);
  li.appendChild(text);
  li.appendChild(actions);

  return li;
}

function renderHabits() {
  const habits       = loadHabits();
  const completedSet = getTodayCompleted();

  // Update date badge
  habitDateEl.textContent = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  // Update progress
  updateProgress(habits, completedSet);

  // Render list
  habitListEl.innerHTML = '';

  if (habits.length === 0) {
    habitEmptyEl.hidden = false;
    habitListEl.hidden  = true;
  } else {
    habitEmptyEl.hidden = true;
    habitListEl.hidden  = false;
    habits.forEach((h) => habitListEl.appendChild(createHabitEl(h, completedSet)));
  }
}

/* -- CRUD -- */

function addHabit(name) {
  const trimmed = name.trim();
  if (!trimmed) {
    setHabitFeedback('Nama kebiasaan tidak boleh kosong.', 'error');
    return false;
  }

  const habits = loadHabits();

  // Challenge 3: prevent duplicate
  if (isDuplicate(habits, trimmed)) {
    setHabitFeedback('Kebiasaan sudah ada.', 'error');
    return false;
  }

  habits.push({ id: generateId(), name: trimmed });
  saveHabits(habits);
  renderHabits();
  setHabitFeedback('Kebiasaan berhasil ditambahkan!', 'success');
  return true;
}

function deleteHabit(id) {
  let habits = loadHabits();
  habits = habits.filter((h) => h.id !== id);
  saveHabits(habits);

  // Also remove its daily status entry for today
  const statusMap = loadDailyStatus();
  if (statusMap[todayKey()]) {
    delete statusMap[todayKey()][id];
    saveDailyStatus(statusMap);
  }

  renderHabits();
  showToast('Kebiasaan dihapus.', 'success');
}

/* -- Edit Modal -- */

function openEditModal(id) {
  const habits = loadHabits();
  const habit  = habits.find((h) => h.id === id);
  if (!habit) return;

  editingHabitId        = id;
  editHabitInput.value  = habit.name;
  editModalEl.hidden    = false;
  editHabitInput.focus();
  editHabitInput.select();
}

function closeEditModal() {
  editModalEl.hidden = true;
  editingHabitId     = null;
  editHabitInput.value = '';
}

function saveEditedHabit() {
  if (!editingHabitId) return;

  const newName = editHabitInput.value.trim();
  if (!newName) {
    editHabitInput.focus();
    return;
  }

  const habits = loadHabits();

  if (isDuplicate(habits, newName, editingHabitId)) {
    editHabitInput.style.borderColor = '#ef4444';
    editHabitInput.focus();
    showToast('Kebiasaan sudah ada.', 'error');
    setTimeout(() => { editHabitInput.style.borderColor = ''; }, 2000);
    return;
  }

  const habit = habits.find((h) => h.id === editingHabitId);
  if (habit) {
    habit.name = newName;
    saveHabits(habits);
    renderHabits();
    showToast('Kebiasaan diperbarui.', 'success');
  }

  closeEditModal();
}

function initHabit() {
  // Form submit
  habitFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = addHabit(habitInputEl.value);
    if (ok) habitInputEl.value = '';
  });

  // Modal events
  editSaveBtn.addEventListener('click', saveEditedHabit);
  editCancelBtn.addEventListener('click', closeEditModal);
  editModalEl.addEventListener('click', (e) => {
    if (e.target === editModalEl) closeEditModal();
  });
  editHabitInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  saveEditedHabit();
    if (e.key === 'Escape') closeEditModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !editModalEl.hidden) closeEditModal();
  });

  renderHabits();
}

/* ============================================================
   9. TOAST NOTIFICATIONS
   ============================================================ */

const toastEl = document.getElementById('toast');
let toastTimer = null;

/**
 * Show a brief toast.
 * @param {string} message
 * @param {'success'|'error'|'default'} type
 * @param {number} duration  ms
 */
function showToast(message, type = 'default', duration = 2600) {
  clearTimeout(toastTimer);
  toastEl.classList.remove('toast--visible', 'toast--success', 'toast--error');

  // Force reflow so transition re-triggers
  void toastEl.offsetWidth;

  toastEl.textContent = message;
  if (type === 'success') toastEl.classList.add('toast--success');
  if (type === 'error')   toastEl.classList.add('toast--error');
  toastEl.classList.add('toast--visible');

  toastTimer = setTimeout(() => {
    toastEl.classList.remove('toast--visible');
  }, duration);
}

/* ============================================================
   10. BOOTSTRAP / INIT
   ============================================================ */

function init() {
  initTheme();
  initClock();
  initGreeting();
  initMood();
  initHabit();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
