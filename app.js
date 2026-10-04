let skills = [
    {
        name: "Forward Skating",
        level: "Beginner",
        status: "Consistent",
        confidence: 5
    },

    {
        name: "Forward Bubbles",
        level: "Beginner",
        status: "Consistent",
        confidence: 4
    },

    {
        name: "Backward Bubbles",
        level: "Beginner",
        status: "Developing",
        confidence: 2
    },

    {
        name: "Manuals",
        level: "Beginner",
        status: "Learning",
        confidence: 1
    },

    {
        name: "Transitions",
        level: "Beginner",
        status: "Developing",
        confidence: 2
    }


];

let sessions = [
    {
        date: "2026-10-01",
        type: "Skate Class",
        duration: 60,
        skills: ["Transitions", "Backward Bubbles", "Crossovers"],
        notes: "Worked on going backwards, crossovers and transitions"

    },
    {
        date: "2026-09-30",
        type: "Roller Rink",
        duration: 45,
        skills: ["Forward Skating", "Forward Bubbles"],
        notes: "Just practicing my stride when going forward, building confidence and balance"
    }
]

const sessionList = document.querySelector("#session-list");
let editingSkillIndex = null;

let recommendedSkills = [];
let practiceInProgress = false;

const savedSessions = localStorage.getItem("sessions");

if (savedSessions) {
    sessions = JSON.parse(savedSessions);
}

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function formatDuration(minutes) {

    if (minutes < 60) {
        return `${minutes} MIN`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const hourLabel = hours === 1 ? "HR" : "HRS";

    if (remainingMinutes === 0){
        return `${hours} ${hourLabel}`;
    } else {
        return `${hours} ${hourLabel} ${remainingMinutes} MIN`;
    }

}

function updateWeeklySummary() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const monday = new Date(today);
    monday.setDate(today.getDate() - daysSinceMonday);

    const thisWeeksSessions = sessions.filter(function(session) {
        const sessionDate = new Date(session.date + "T00:00:00");

        return sessionDate >= monday && sessionDate <= today;
    });

    const sessionCount = thisWeeksSessions.length;
    weeklySessionCount.textContent = sessionCount;

    const totalMinutes = thisWeeksSessions.reduce(function (total, session) {
        return total + session.duration;
    }, 0);

    weeklyMinutes.textContent = formatDuration(totalMinutes);

}

const sessionForm = document.querySelector("#session-form");
const showSessionFormButton = document.querySelector("#show-session-form");
const cancelSessionButton = document.querySelector("#cancel-session");

const sessionDateInput = document.querySelector("#session-date");
const sessionTypeInput = document.querySelector("#session-type");
const sessionDurationInput = document.querySelector("#session-duration");
const durationUnitInput = document.querySelector("#duration-unit");
const sessionSkillsInput = document.querySelector("#session-skills");
const sessionNotesInput = document.querySelector("#session-notes");

const weeklySessionCount = document.querySelector("#weekly-session-count");
const weeklyMinutes = document.querySelector("#weekly-minutes");

function renderSessions() {
    sessionList.innerHTML = "";

    sessions.forEach(function (session) {
        const sessionCard = document.createElement("div");
        sessionCard.classList.add("session-card");

        const sessionType = document.createElement("h3");
        sessionType.textContent = session.type;
        sessionType.classList.add("session-type");
    

        const sessionDate = document.createElement("p");
        sessionDate.textContent = formatDate(session.date);
        sessionDate.classList.add("session-date");

        const sessionDuration = document.createElement("p");
        sessionDuration.textContent = formatDuration(session.duration);
        sessionDuration.classList.add("session-duration");

        const sessionMeta = document.createElement("div");
        sessionMeta.classList.add("session-meta");

        const sessionSkills = document.createElement("p");
        sessionSkills.textContent = `Practiced: ${session.skills.join(", ")};`
        sessionSkills.classList.add("session-skills");

        const sessionNotes = document.createElement("p");
        sessionNotes.textContent = session.notes;
        sessionNotes.classList.add("session-notes");


        sessionMeta.appendChild(sessionDate);
        sessionMeta.appendChild(sessionDuration);


        sessionCard.appendChild(sessionType);
        sessionCard.appendChild(sessionMeta);
        sessionCard.appendChild(sessionSkills);
        sessionCard.appendChild(sessionNotes);

        sessionList.appendChild(sessionCard);
        

    });


}



function populateSkillOptions() {
    sessionSkillsInput.innerHTML = "";

    skills.forEach(function (skill) {
        const option = document.createElement("option");

        option.value = skill.name;
        option.textContent = skill.name;

        sessionSkillsInput.appendChild(option);
    });
}

populateSkillOptions();

sessionForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const date = sessionDateInput.value;
    const type = sessionTypeInput.value;

    let duration = Number(sessionDurationInput.value);
    const unit = durationUnitInput.value;

    const selectedSkills = Array.from(sessionSkillsInput.selectedOptions).map(
        function (option) {
            return option.value;
        }
    )

    const notes = sessionNotesInput.value;

    if (unit === "hours") {
        duration = duration * 60;
    }

    const newSession = {
        date: date,
        type: type,
        duration: duration,
        skills: selectedSkills,
        notes: notes
    };

    sessions.push(newSession);
    saveSessions();
    renderSessions();
    updateWeeklySummary();

    
    sessionForm.reset();
    sessionForm.classList.remove("visible");
    showSessionFormButton.style.display = "block";

});

showSessionFormButton.addEventListener("click", function () {
    sessionForm.classList.add("visible");
    showSessionFormButton.style.display = "none";
});

cancelSessionButton.addEventListener("click", function () {
    sessionForm.reset();
    sessionForm.classList.remove("visible");
    showSessionFormButton.style.display = "block";
});

function saveSessions() {
    localStorage.setItem("sessions", JSON.stringify(sessions));
}

renderSessions();

updateWeeklySummary();


const practiceRecommendations = document.querySelector(
    "#practice-recommendations"
);

function getPracticeRecommendations() {
    const developingSkills = skills.filter(function (skill) {
        return skill.status !== "Mastered";
    });

     const statusPriority = {
        Learning: 1,
        Developing: 2,
        Consistent: 3
    };

    developingSkills.sort(function (a, b) {
        const statusDifference = statusPriority[a.status] = statusPriority[b.status];

        if (statusDifference !== 0) {
            return statusDifference;
        }
        return a.confidence - b.confidence;
    });


    recommendedSkills = developingSkills.slice(0, 3);

    practiceRecommendations.innerHTML = "";

    recommendedSkills.forEach(function (skill) {
        const recommendation = document.createElement("div");
        recommendation.classList.add("practice-skill");

        const skillName = document.createElement("h3");
        skillName.textContent = skill.name;

        const skillDetails = document.createElement("p");
        skillDetails.textContent = `${skill.status} - Confidence ${skill.confidence}/5`;

        recommendation.appendChild(skillName);
        recommendation.appendChild(skillDetails);

        practiceRecommendations.appendChild(recommendation);
    });
}

const skillForm = document.querySelector("#skill-form");
const skillNameInput = document.querySelector("#skill-name");
const skillLevelInput = document.querySelector("#skill-level");
const skillStatusInput = document.querySelector("#skill-status");
const skillConfidenceInput = document.querySelector("#skill-confidence");

skillForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newSkill = {
        name: skillNameInput.value,
        level: skillLevelInput.value,
        status: skillStatusInput.value,
        confidence: Number(skillConfidenceInput.value)
    };

    if (editingSkillIndex !== null) {
        skills[editingSkillIndex] = newSkill;
    } else {
        skills.push(newSkill);
    }
    

    saveSkills();
    renderSkills();
    getPracticeRecommendations();

    skillForm.reset();

    editingSkillIndex = null;
    skillSubmitButton.textContent = "Add Skill";
    skillForm.classList.remove("visible");
    showSkillFormButton.style.display = "block";
    
});

const skillSubmitButton = document.querySelector("#skill-submit");

const showSkillFormButton = document.querySelector("#show-skill-form");
showSkillFormButton.addEventListener("click", function(){
    skillForm.classList.add("visible");
    showSkillFormButton.style.display = "none";
});

const cancelSkillButton = document.querySelector("#cancel-skill");
cancelSkillButton.addEventListener("click", function () {
    skillForm.reset();
    skillForm.classList.remove("visible");
    showSkillFormButton.style.display = "block";

    editingSkillIndex = null;
    skillSubmitButton.textContent = "Add Skill";
});

const savedSkills = localStorage.getItem("skills");
if (savedSkills) {
    skills = JSON.parse(savedSkills);
}

function saveSkills() {
    localStorage.setItem("skills", JSON.stringify(skills));
}

const skillList = document.querySelector("#skill-list");

function renderSkills() {
    skillList.innerHTML = "";

    skills.forEach(function (skill, index) {
        const skillCard = document.createElement("div");
        skillCard.classList.add("skill-card");

        const skillName = document.createElement("h3");
        skillName.textContent = skill.name;

        const skillLevel = document.createElement("p");
        skillLevel.textContent = `Level: ${skill.level}`;

        const skillStatus = document.createElement("span");
        skillStatus.textContent = skill.status;
        skillStatus.classList.add("status-badge");
        skillStatus.classList.add(skill.status.toLowerCase());

        const skillConfidence = document.createElement("p");
        skillConfidence.textContent = `Confidence: ${skill.confidence}/5`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");


        deleteButton.addEventListener("click", function(){
            skills.splice(index, 1);
            saveSkills();
            renderSkills();
            getPracticeRecommendations();
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button");

        editButton.addEventListener("click", function () {
            skillNameInput.value = skill.name;
            skillLevelInput.value = skill.level;
            skillStatusInput.value = skill.status;
            skillConfidenceInput.value = skill.confidence;

            editingSkillIndex = index;
            skillSubmitButton.textContent = "Update Skill";
            skillForm.classList.add("visible");
            showSkillFormButton.style.display = "none";

            
        });

        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("skill-actions");

        skillCard.appendChild(skillName);
        skillCard.appendChild(skillLevel);
        skillCard.appendChild(skillStatus);
        skillCard.appendChild(skillConfidence);
        buttonGroup.appendChild(deleteButton);
        buttonGroup.appendChild(editButton);
        skillCard.appendChild(buttonGroup);

        skillList.appendChild(skillCard);
    });
}

renderSkills();

getPracticeRecommendations();

const startButton = document.querySelector("#start-practice");
const practiceStatus = document.querySelector("#practice-status");

startButton.addEventListener("click", function () {
    if (practiceInProgress === false) {
        practiceInProgress = true;

        practiceStatus.textContent = "Practice in progress 🛼";
        startButton.textContent = "Finish Practice";
    } else {
        practiceInProgress = false;

        practiceStatus.textContent = "Nice work! Log your session.";
        startButton.textContent = "Start Practice";

        sessionForm.classList.add("visible");
        showSessionFormButton.style.display = "none";

        const today = new Date().toISOString().split("T")[0];
        sessionDateInput.value = today;

        Array.from(sessionSkillsInput.options).forEach(function (option) {
            option.selected = recommendedSkills.some(function (skill) {
                return skill.name === option.value;
            });
        });
    }
});
