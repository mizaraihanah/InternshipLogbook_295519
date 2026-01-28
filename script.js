// ============================================
// INTERNSHIP LOGBOOK - SCRIPT
// Dynamic month generation and entry management
// ============================================

const INTERNSHIP_START = new Date(2025, 9, 6); // October 6, 2025
const INTERNSHIP_END = new Date(2026, 3, 10);   // April 10, 2026

let currentDisplayDate = new Date(INTERNSHIP_START);

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    generateSidebarButtons();
    initializeEventListeners();
    renderCurrentMonth();
    loadDataFromStorage();
});

// ============================================
// EVENT LISTENERS
// ============================================

function generateSidebarButtons() {
    const sidebarNav = document.getElementById('sidebarNav');
    sidebarNav.innerHTML = '';
    
    const currentDate = new Date(INTERNSHIP_START);
    
    while (currentDate <= INTERNSHIP_END) {
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(currentDate);
        const btnMonth = currentDate.getMonth();
        const btnYear = currentDate.getFullYear();
        
        const btn = document.createElement('button');
        btn.className = 'month-btn';
        btn.textContent = monthName;
        btn.dataset.month = btnMonth;
        btn.dataset.year = btnYear;
        
        // Set active state for current month
        if (btnMonth === currentDisplayDate.getMonth() && btnYear === currentDisplayDate.getFullYear()) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => {
            currentDisplayDate = new Date(btnYear, btnMonth, 1);
            renderCurrentMonth();
            updateSidebarButtons();
        });
        
        sidebarNav.appendChild(btn);
        
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
}

function updateSidebarButtons() {
    const buttons = document.querySelectorAll('.month-btn');
    buttons.forEach(btn => {
        const btnMonth = parseInt(btn.dataset.month);
        const btnYear = parseInt(btn.dataset.year);
        
        if (btnMonth === currentDisplayDate.getMonth() && btnYear === currentDisplayDate.getFullYear()) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function initializeEventListeners() {
    document.getElementById('prevBtn').addEventListener('click', previousMonth);
    document.getElementById('nextBtn').addEventListener('click', nextMonth);
}

function previousMonth() {
    const newDate = new Date(currentDisplayDate);
    newDate.setMonth(newDate.getMonth() - 1);
    
    if (newDate >= INTERNSHIP_START && newDate <= INTERNSHIP_END) {
        currentDisplayDate = newDate;
        renderCurrentMonth();
    }
}

function nextMonth() {
    const newDate = new Date(currentDisplayDate);
    newDate.setMonth(newDate.getMonth() + 1);
    
    if (newDate >= INTERNSHIP_START && newDate <= INTERNSHIP_END) {
        currentDisplayDate = newDate;
        renderCurrentMonth();
    }
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderCurrentMonth() {
    const month = currentDisplayDate.getMonth();
    const year = currentDisplayDate.getFullYear();
    
    // Update navigation display
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDisplayDate);
    document.getElementById('currentMonth').textContent = monthName;
    
    // Update button states
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    const canGoPrev = new Date(year, month - 1, 1) >= INTERNSHIP_START;
    const canGoNext = new Date(year, month + 1, 1) <= INTERNSHIP_END;
    
    prevBtn.disabled = !canGoPrev;
    nextBtn.disabled = !canGoNext;
    prevBtn.style.opacity = canGoPrev ? '1' : '0.5';
    nextBtn.style.opacity = canGoNext ? '1' : '0.5';
    
    // Update sidebar buttons
    updateSidebarButtons();
    
    // Generate and render the month
    renderMonth(month, year);
}

function renderMonth(month, year) {
    const container = document.getElementById('logbookContainer');
    container.innerHTML = '';
    
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(year, month));
    
    const monthSection = document.createElement('div');
    monthSection.className = 'month-section';
    
    const monthTitle = document.createElement('h2');
    monthTitle.className = 'month-title';
    monthTitle.textContent = monthName;
    monthSection.appendChild(monthTitle);
    
    // Generate days for this month within internship period
    const daysContainer = document.createElement('div');
    daysContainer.className = 'days-container';
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(year, month, day);
        
        // Only render days within internship period
        if (currentDate >= INTERNSHIP_START && currentDate <= INTERNSHIP_END) {
            const dayElement = createDayEntry(currentDate);
            daysContainer.appendChild(dayElement);
        }
    }
    
    monthSection.appendChild(daysContainer);
    container.appendChild(monthSection);
}

function createDayEntry(date) {
    const dateString = formatDateForStorage(date);
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    const formattedDate = new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    }).format(date);
    
    const entry = document.createElement('div');
    entry.className = 'daily-entry';
    
    // Date header
    const dateHeader = document.createElement('div');
    dateHeader.className = 'date-header';
    
    const dateLabel = document.createElement('div');
    dateLabel.className = 'date-label';
    dateLabel.textContent = formattedDate;
    
    const dayLabel = document.createElement('div');
    dayLabel.className = 'day-of-week';
    dayLabel.textContent = dayOfWeek;
    
    dateHeader.appendChild(dateLabel);
    dateHeader.appendChild(dayLabel);
    entry.appendChild(dateHeader);
    
    // Input group
    const inputGroup = document.createElement('div');
    inputGroup.className = 'duty-input-group';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'duty-input';
    input.placeholder = 'Add a duty or task...';
    
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.textContent = 'Add';
    
    addBtn.addEventListener('click', () => {
        if (input.value.trim()) {
            addDuty(dateString, input.value.trim());
            input.value = '';
            input.focus();
        }
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            addDuty(dateString, input.value.trim());
            input.value = '';
        }
    });
    
    inputGroup.appendChild(input);
    inputGroup.appendChild(addBtn);
    entry.appendChild(inputGroup);
    
    // Duties list
    const dutiesList = document.createElement('div');
    dutiesList.className = 'duties-list';
    dutiesList.id = `duties-${dateString}`;
    
    const duties = getDutiesForDate(dateString);
    if (duties.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'No duties recorded yet';
        dutiesList.appendChild(emptyMsg);
    } else {
        duties.forEach((duty, index) => {
            const dutyElement = createDutyItem(dateString, index, duty);
            dutiesList.appendChild(dutyElement);
        });
    }
    
    entry.appendChild(dutiesList);
    
    return entry;
}

function createDutyItem(dateString, index, dutyText) {
    const item = document.createElement('div');
    item.className = 'duty-item';
    
    const text = document.createElement('span');
    text.className = 'duty-text';
    text.textContent = dutyText;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '✕';
    deleteBtn.title = 'Delete this duty';
    
    deleteBtn.addEventListener('click', () => {
        deleteDuty(dateString, index);
    });
    
    item.appendChild(text);
    item.appendChild(deleteBtn);
    
    return item;
}

// ============================================
// DATA MANAGEMENT
// ============================================

function formatDateForStorage(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDutiesForDate(dateString) {
    const data = JSON.parse(localStorage.getItem('internshipLogbook') || '{}');
    return data[dateString] || [];
}

function addDuty(dateString, dutyText) {
    const data = JSON.parse(localStorage.getItem('internshipLogbook') || '{}');
    
    if (!data[dateString]) {
        data[dateString] = [];
    }
    
    data[dateString].push(dutyText);
    localStorage.setItem('internshipLogbook', JSON.stringify(data));
    
    // Re-render the specific duties list
    renderDutiesList(dateString);
}

function deleteDuty(dateString, index) {
    const data = JSON.parse(localStorage.getItem('internshipLogbook') || '{}');
    
    if (data[dateString]) {
        data[dateString].splice(index, 1);
        
        if (data[dateString].length === 0) {
            delete data[dateString];
        }
        
        localStorage.setItem('internshipLogbook', JSON.stringify(data));
        renderDutiesList(dateString);
    }
}

function renderDutiesList(dateString) {
    const dutiesContainer = document.getElementById(`duties-${dateString}`);
    if (!dutiesContainer) return;
    
    dutiesContainer.innerHTML = '';
    
    const duties = getDutiesForDate(dateString);
    if (duties.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = 'No duties recorded yet';
        dutiesContainer.appendChild(emptyMsg);
    } else {
        duties.forEach((duty, index) => {
            const dutyElement = createDutyItem(dateString, index, duty);
            dutiesContainer.appendChild(dutyElement);
        });
    }
}

function loadDataFromStorage() {
    // This function is called on page load to ensure data persists
    // No immediate action needed, but data is accessible via getDutiesForDate()
}

// ============================================
// EXPORT FUNCTIONALITY (Optional)
// ============================================

function exportLogbookAsJSON() {
    const data = localStorage.getItem('internshipLogbook') || '{}';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'internship-logbook.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Make export function available globally if needed
window.exportLogbookAsJSON = exportLogbookAsJSON;
