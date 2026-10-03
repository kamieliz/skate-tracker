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

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
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
        sessionDuration.textContent = `${session.duration} min`;
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

renderSessions();

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


showSessionFormButton.addEventListener("click", function () {
    sessionForm.classList.add("visible");
    showSessionFormButton.style.display = "none";
});

cancelSessionButton.addEventListener("click", function () {
    sessionForm.reset();
    sessionForm.classList.remove("visible");
    showSessionFormButton.style.display = "block";
});


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

const startButton = document.querySelector("#start-practice");

console.log(startButton);
startButton.addEventListener("click", function () {
    console.log("Practice started!");
});

const practiceStatus = document.querySelector("#practice-status");
startButton.addEventListener("click", function () {
    practiceStatus.textContent = "Practice in progress 🛼";
});


