import { albumQuizData } from './albums.js'      
      

      // DOM elements
      const startScreen = document.getElementById("start-screen");
      const gameScreen = document.getElementById("game-screen");
      const feedbackScreen = document.getElementById("feedback-screen");
      const resultsScreen = document.getElementById("results-screen");

      const startBtn = document.getElementById("start-btn");
      const submitBtn = document.getElementById("submit-btn");
      const nextBtn = document.getElementById("next-btn");
      const restartBtn = document.getElementById("restart-btn");

      const albumCover = document.getElementById("album-cover");
      const answerInput = document.getElementById("answer-input");
      const timeDisplay = document.getElementById("time");
      const progressBar = document.getElementById("progress-bar");
      const scoreDisplay = document.getElementById("score");
      const finalScoreDisplay = document.getElementById("final-score");
      const totalQuestionsDisplay = document.getElementById("total-questions");
      const feedbackTitle = document.getElementById("feedback-title");
      const feedbackMessage = document.getElementById("feedback-message");
      const correctAnswerDisplay = document.getElementById("correct-answer");
      const correctAlbumDisplay = document.getElementById("correct-album");
      const attemptsDisplay = document.getElementById("attempts");
      const hintBtn = document.getElementById("hint-btn");
      const questionCountDisplay = document.getElementById("question-count");
      const feedbackImage = document.getElementById("feedback-image");

      // Game state
      let currentQuestionIndex = 0;
      let score = 0;
      let timeLeft = 30;
      let timer;
      let attemptsLeft = 3;
      let randomizedQuestions = [];

      // Initialize the game
      function initGame() {
        startBtn.addEventListener("click", startGame);
        submitBtn.addEventListener("click", checkAnswer);
        nextBtn.addEventListener("click", nextQuestion);
        restartBtn.addEventListener("click", restartGame);
        hintBtn.addEventListener("click", showHint);
        answerInput.addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            checkAnswer();
          }
        });
      }

      // Function to randomize and select 10 questions
      function randomizeQuestions() {
        // Create a copy of the albumQuizData array
        const allQuestions = [...albumQuizData];

        // Fisher-Yates shuffle algorithm
        for (let i = allQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allQuestions[i], allQuestions[j]] = [
            allQuestions[j],
            allQuestions[i],
          ];
        }

        // Select first 10 questions
        randomizedQuestions = allQuestions.slice(0, 10);

        return randomizedQuestions;
      }

      // Start the game
      function startGame() {
        // Randomize and select 10 questions before starting
        randomizeQuestions();
        currentQuestionIndex = 0;
        score = 0;
        scoreDisplay.textContent = score;

        showScreen(gameScreen);
        loadQuestion();
      }

      // Load a question
      function loadQuestion() {
        if (currentQuestionIndex >= randomizedQuestions.length) {
          showResults();
          return;
        }

        const question = randomizedQuestions[currentQuestionIndex];
        // Use the question image (clear) for the game screen
        albumCover.src = question.questionImage;
        answerInput.value = "";
        attemptsLeft = 3;
        attemptsDisplay.textContent = attemptsLeft;
        hintBtn.style.visibility = "visible";
        questionCountDisplay.textContent = currentQuestionIndex + 1;

        // Reset timer
        timeLeft = 30;
        timeDisplay.textContent = timeLeft;
        progressBar.style.width = "0%";

        startTimer();
      }

      // Start the timer
      function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            progressBar.style.width = `${((30 - timeLeft) / 30) * 100}%`;
          } else if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeUp();
          }
        }, 1000);
      }

      // Handle when time is up
      function handleTimeUp() {
        showFeedback(false, "Time's up!");
      }

      // Check the answer
      function checkAnswer() {
        if (timeLeft <= 0) return;

        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctAnswer =
          randomizedQuestions[currentQuestionIndex].artist.toLowerCase();

        if (userAnswer === "") return;

        if (userAnswer === correctAnswer) {
          clearInterval(timer);
          score++;
          scoreDisplay.textContent = score;
          showFeedback(true);
        } else {
          attemptsLeft--;
          attemptsDisplay.textContent = attemptsLeft;

          if (attemptsLeft <= 0) {
            clearInterval(timer);
            showFeedback(false, "Неверно! Попытки закончились.");
          } else {
            // Show error but allow another try
            answerInput.value = "";
            answerInput.placeholder = "Попробуйте снова...";
            setTimeout(() => {
              answerInput.placeholder = "Введите имя исполнителя...";
            }, 1000);
          }
        }
      }

      // Show feedback
      function showFeedback(isCorrect, message) {
        showScreen(feedbackScreen);
        feedbackTitle.textContent = isCorrect ? "Верно!" : "Неверно!";
        feedbackTitle.className = isCorrect ? "correct" : "incorrect";
        feedbackMessage.textContent =
          message || (isCorrect ? "Так держать!" : "Удачи в следующий раз!");
        feedbackMessage.className = isCorrect ? "correct" : "incorrect";
        correctAnswerDisplay.textContent =
          randomizedQuestions[currentQuestionIndex].artist;
        correctAlbumDisplay.textContent =
          randomizedQuestions[currentQuestionIndex].album;
        // Use the answer image for the feedback screen
        feedbackImage.src =
          randomizedQuestions[currentQuestionIndex].answerImage;
      }

      // Show hint
      function showHint() {
        alert(`Hint: ${randomizedQuestions[currentQuestionIndex].hint}`);
        hintBtn.style.visibility = "hidden";
      }

      // Next question
      function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < randomizedQuestions.length) {
          showScreen(gameScreen);
          loadQuestion();
        } else {
          showResults();
        }
      }

      // Show results
      function showResults() {
        showScreen(resultsScreen);
        finalScoreDisplay.textContent = score;
        totalQuestionsDisplay.textContent = randomizedQuestions.length;
      }

      // Restart game
      function restartGame() {
        currentQuestionIndex = 0;
        score = 0;
        scoreDisplay.textContent = score;
        showScreen(startScreen);
      }

      // Show a specific screen
      function showScreen(screen) {
        startScreen.style.display = "none";
        gameScreen.style.display = "none";
        feedbackScreen.style.display = "none";
        resultsScreen.style.display = "none";

        screen.style.display = "block";
      }

      // Initialize the game when the page loads
      window.onload = initGame;