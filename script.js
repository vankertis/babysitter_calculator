document.addEventListener("DOMContentLoaded", function() {
    generateWeekInputs();
    toggleWeeksVisibility(); // To initially hide/show based on checkbox state
});

function toggleWeeksVisibility() {
    const applyAllWeeks = document.getElementById("applyAllWeeks").checked;
    const weekSections = document.querySelectorAll(".week-section");

    if (applyAllWeeks) {
        // Only show the first week section
        weekSections.forEach((section, index) => {
            if (index === 0) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        });
    } else {
        // Show all week sections
        weekSections.forEach(section => {
            section.style.display = "block";
        });
    }
}

function generateWeekInputs() {
    const weekContainer = document.getElementById("week-sections");
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    weekContainer.innerHTML = ""; // Clear existing week sections

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    let weekNumber = 1;
    let runningDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start from the first day of the month

    for (let i = 1; i <= daysInMonth;) {
        if (currentDay === 6 || currentDay === 0) { // Skip weekends
            i++;
            runningDate.setDate(runningDate.getDate() + 1);
            currentDay = (currentDay + 1) % 7;
            continue;
        }
        
        const weekDiv = document.createElement("div");
        weekDiv.classList.add("week-section");
        
        const startDate = runningDate.toDateString(); // Start date of the current week
        
        while (currentDay > 0 && currentDay < 6 && i <= daysInMonth) { // Only consider weekdays
            i++;
            runningDate.setDate(runningDate.getDate() + 1);
            currentDay = (currentDay + 1) % 7;
        }
        
        const endDate = runningDate.toDateString(); // End date of the current week

        weekDiv.innerHTML = `<h2 onclick="toggleCollapse(this)">Week ${weekNumber} - ${startDate} - ${endDate}</h2>
                             <div class="weekdays">`;
        
        days.forEach(day => {
            weekDiv.innerHTML += `<div class="day">
                <label for="${day.toLowerCase()}${i}">${day}:</label>
                <input type="number" id="${day.toLowerCase()}${i}" placeholder="Hours">
            </div>`;
        });

        weekDiv.innerHTML += `</div><div class="output-section">
                                <p>Weekly Payment for Week ${weekNumber}: <span></span></p>
                            </div>`;
        
        weekContainer.appendChild(weekDiv);
        weekNumber++;
    }
}






function toggleCollapse(element) {
    const weekdaysDiv = element.nextElementSibling;
    if (weekdaysDiv.style.display === "none" || !weekdaysDiv.style.display) {
        weekdaysDiv.style.display = "block";
    } else {
        weekdaysDiv.style.display = "none";
    }
}

function calculatePayment() {
    const rate = parseFloat(document.getElementById("rate").value);
    const weekSections = document.querySelectorAll(".week-section");
    let totalMonthlyHours = 0;

    weekSections.forEach((week, index) => {
        const days = ['mon', 'tue', 'wed', 'thu', 'fri'];
        let weeklyHours = 0;

        days.forEach(day => {
            const dayInputs = week.querySelectorAll(`input[id^='${day}']`);
            dayInputs.forEach(input => {
                if (input) {
                    weeklyHours += parseFloat(input.value || 0);
                }
            });
        });

        totalMonthlyHours += weeklyHours;
        week.querySelector(".output-section span").textContent = (weeklyHours * rate).toFixed(2);
    });

    document.getElementById("monthlyPayment").textContent = (totalMonthlyHours * rate).toFixed(2);
}

