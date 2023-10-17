document.addEventListener("DOMContentLoaded", function() {
    generateWeekInputs();
    toggleWeeksVisibility(); // To initially hide/show based on checkbox state
    
    const firstWeekInputs = document.querySelectorAll(".week-section:first-child .day input");
    firstWeekInputs.forEach(input => {
        input.addEventListener('input', copyFirstWeekValues);
    });
});

function copyFirstWeekValues() {
    if (document.getElementById("applyAllWeeks").checked) {
        const weekSections = document.querySelectorAll(".week-section");
        const firstWeekDays = weekSections[0].querySelectorAll(".day input");

        weekSections.forEach((section, index) => {
            if (index !== 0) {
                const currentWeekDays = section.querySelectorAll(".day input");
                currentWeekDays.forEach((input, idx) => {
                    input.value = firstWeekDays[idx].value;
                });
            }
        });
    }
}


function toggleWeeksVisibility() {
    const applyAllWeeks = document.getElementById("applyAllWeeks").checked;
    const weekSections = document.querySelectorAll(".week-section");

    if (applyAllWeeks) {
        const firstWeekDays = weekSections[0].querySelectorAll(".day input");

        weekSections.forEach((section, index) => {
            if (index === 0) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
                const currentWeekDays = section.querySelectorAll(".day input");
                currentWeekDays.forEach((input, idx) => {
                    input.value = firstWeekDays[idx].value;
                });
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

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let weekDiv;
    let weekContent = "";
    let weekNumber = 1;
    let startDate;

    for (let i = 1; i <= daysInMonth; i++) {
        const runningDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const dayName = days[runningDate.getDay()];

        if (!startDate) {
            startDate = runningDate.toDateString();
        }

        // Skip weekends
        if (dayName === "Saturday" || dayName === "Sunday") {
            continue;
        }

        weekContent += `
            <div class="day">
                <label for="${dayName.toLowerCase()}${i}">${dayName} ${i}:</label>
                <input type="number" id="${dayName.toLowerCase()}${i}" placeholder="Hours">
            </div>
        `;

        // If it's Friday or the last day of the month, append the week
        if (dayName === "Friday" || i === daysInMonth) {
            weekDiv = document.createElement("div");
            weekDiv.classList.add("week-section");
            weekDiv.innerHTML = `
                <h2 onclick="toggleCollapse(this)">Week ${weekNumber} - ${startDate} - ${runningDate.toDateString()}</h2>
                <div class="weekdays">${weekContent}</div>
                <div class="output-section">
                    <p>Weekly Payment for Week ${weekNumber}: <span></span></p>
                </div>
            `;
            weekContainer.appendChild(weekDiv);

            // Reset for the next week
            weekNumber++;
            weekContent = "";
            startDate = null;
        }
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

    weekSections.forEach((week) => {
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

