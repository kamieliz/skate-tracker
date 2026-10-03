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

let editingSkillIndex = null;

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