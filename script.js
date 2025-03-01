const questions = [
    { question: "What is the capital of France?", options: ["Paris", "Berlin", "Madrid", "Rome"], answer: "Paris" },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
    { question: "What is the largest mammal?", options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"], answer: "Blue Whale" },
    { question: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Dickens", "Hemingway", "Austen"], answer: "Shakespeare" },
    { question: "What is the square root of 64?", options: ["6", "8", "10", "12"], answer: "8" },
    { question: "What is the fastest land animal?", options: ["Cheetah", "Lion", "Horse", "Kangaroo"], answer: "Cheetah" },
    { question: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: "Nile" },
    { question: "What is the national flower of Japan?", options: ["Cherry Blossom", "Rose", "Lotus", "Tulip"], answer: "Cherry Blossom" },
    { question: "How many legs does a spider have?", options: ["6", "8", "10", "12"], answer: "8" },
    { question: "Who discovered gravity?", options: ["Newton", "Einstein", "Galileo", "Tesla"], answer: "Newton" }
];


let players = [];
let currentPlayerIndex = 0;
let currentQuestionIndex = 0;
let selectedAnswer = null;

function startGame() {
    const playerNamesInput = document.getElementById("player-names").value.trim();
    if (!playerNamesInput) {
        alert("Please enter player names!");
        return;
    }

    let nameList = playerNamesInput.split(",").map(name => name.trim());
    if (nameList.length !== 5) {
        alert("Please enter exactly 5 player names!");
        return;
    }
    if (nameList.some(name => name === "")) {
        alert("Player names cannot be empty!");
        return;
    }
    if (new Set(nameList).size !== nameList.length) {
        alert("Duplicate names are not allowed!");
        return;
    }

    players = nameList.map(name => ({ name, score: 0 }));
    localStorage.setItem("players", JSON.stringify(players));

    document.getElementById("player-input").style.display = "none";
    document.getElementById("player-turn").style.display = "block";

    currentPlayerIndex = 0;
    currentQuestionIndex = 0;
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        saveScore();
        return;
    }
    document.getElementById("player-turn").innerText = `Current Player: ${players[currentPlayerIndex].name}`;
    document.getElementById("question-number").innerText = `Question ${currentQuestionIndex + 1}/5`;
    const questionData = questions[currentQuestionIndex];
    document.getElementById("question").innerText = questionData.question;
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    selectedAnswer = null;

    questionData.options.forEach(option => {
        const optionElement = document.createElement("div");
        optionElement.classList.add("option");
        optionElement.textContent = option;
        optionElement.onclick = function () { selectAnswer(this, option); };
        optionsContainer.appendChild(optionElement);
    });
    document.getElementById("next-btn").disabled = true;
}

function selectAnswer(element, selectedOption) {
    if (selectedAnswer) return;
    selectedAnswer = selectedOption;
    document.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
    element.classList.add("selected");
    document.getElementById("next-btn").disabled = false;
}

function nextQuestion() {
    if (!selectedAnswer) return;
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
        players[currentPlayerIndex].score++;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        currentPlayerIndex++;
        if (currentPlayerIndex < players.length) {
            currentQuestionIndex = 0;
            loadQuestion();
        } else {
            displayLeaderboard();
        }
    }
}

function displayLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";
    players.sort((a, b) => b.score - a.score);
    players.forEach(player => {
        const li = document.createElement("li");
        li.textContent = `${player.name}: ${player.score}`;
        leaderboard.appendChild(li);
    });
    document.getElementById("winner").innerText = `Winner: ${players[0].name}`;
}

document.getElementById("next-btn").addEventListener("click", nextQuestion);
