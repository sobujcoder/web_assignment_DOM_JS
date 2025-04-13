
const questions = [
     {
      question: "What is the capital of Bangladesh? ",
      answers: ["Dhaka", "Chittagong", "Coxs Bazar", "Gazipur"],
      correct: 0
    },
    {
      question: "Which language runs in a web browser?",
      answers: ["Python", "Java", "C", "JavaScript"],
      correct: 3
    },
    {
      question: "What does CSS stand for?",
      answers: ["Central Style Sheets", "Cascading Style Sheets", "Computer Style System", "Creative Style Sheet"],
      correct: 1
    },
    {
        question: "What does HTML stand for?",
        answers: ["Hyper Markup Language", "HyperText Markup Language", "Hyper Markup Language", "Creative Style Sheet"],
        correct: 1
      },
      {
        question: "What is the effect of the <b> tag?",
        answers: ["none of the above", "Bold" ,"italic", "It is used to change the front size"],
        correct: 1
      }

     
  ];
  
  let currentQuestionIndex = 0;
  let score = 0;
  let timer;
  let timeLeft = 20;
  let selectedAnswers = [];
  
  const questionEl = document.getElementById('question');
  const answersEl = document.getElementById('answers');
  const nextBtn = document.getElementById('nextBtn');
  const scoreEl = document.getElementById('score');
  
  function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswers = [];
    localStorage.removeItem('quiz-progress');
    showQuestion();
    scoreEl.classList.add("hidden");
    nextBtn.textContent = "Next";
    nextBtn.classList.add("hidden");
  }
  
  function showQuestion() {
    clearInterval(timer);
    timeLeft = 20;
    updateTimer();
  
    const current = questions[currentQuestionIndex];
    questionEl.textContent = current.question;
    answersEl.innerHTML = '';
    nextBtn.classList.add("hidden");
  
    current.answers.forEach((answer, index) => {
      const btn = document.createElement('button');
      btn.textContent = answer;
      btn.classList.add('answer-btn');
      btn.dataset.index = index;
      btn.addEventListener('click', () => selectAnswer(btn, index));
      answersEl.appendChild(btn);
    });
  
    document.querySelectorAll('.answer-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
  
    document.querySelector('.quiz-container').classList.add('fade');
    setTimeout(() => {
      document.querySelector('.quiz-container').classList.remove('fade');
    }, 300);
  
    startTimer();
  }
  
  function selectAnswer(btn, index) {
    // Deselect all first
    document.querySelectorAll('.answer-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  
    selectedAnswers[currentQuestionIndex] = index;
    nextBtn.classList.remove("hidden");
  
    saveProgress();
  }
  
  function startTimer() {
    timer = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft === 0) {
        clearInterval(timer);
        if (selectedAnswers[currentQuestionIndex] === undefined) {
          selectedAnswers[currentQuestionIndex] = null;
        }
        nextBtn.classList.remove("hidden");
      }
    }, 1000);
  }
  
  function updateTimer() {
    questionEl.innerHTML = `(${timeLeft}s) ${questions[currentQuestionIndex].question}`;
  }
  
  nextBtn.addEventListener('click', () => {
    clearInterval(timer);
    if (selectedAnswers[currentQuestionIndex] === questions[currentQuestionIndex].correct) {
      score++;
    }
  
    currentQuestionIndex++;
  
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showScore();
    }
  });
  
  function showScore() {
    questionEl.textContent = "Quiz Completed!";
    answersEl.innerHTML = '';
    nextBtn.textContent = "Restart Quiz";
    nextBtn.removeEventListener("click", showQuestion);
    nextBtn.addEventListener("click", startQuiz);
  
    let summary = `<p>Your Score: ${score} / ${questions.length}</p><ul>`;
    questions.forEach((q, i) => {
      const userAnswer = selectedAnswers[i];
      const correctText = q.answers[q.correct];
      const userText = userAnswer !== null && userAnswer !== undefined ? q.answers[userAnswer] : "No answer";
      const color = userAnswer === q.correct ? "#28a745" : "#dc3545";
  
      summary += `
        <li style="margin: 10px 0; text-align: left;">
          <strong>Q${i + 1}:</strong> ${q.question}<br/>
          <span style="color: ${color};">Your Answer: ${userText}</span><br/>
          <span style="color: #555;">Correct Answer: ${correctText}</span>
        </li>`;
    });
  
    summary += "</ul>";
    scoreEl.innerHTML = summary;
    scoreEl.classList.remove("hidden");
  
    localStorage.removeItem('quiz-progress');
  }
  
  // Save progress
  function saveProgress() {
    localStorage.setItem('quiz-progress', JSON.stringify({
      currentQuestionIndex,
      selectedAnswers,
      score
    }));
  }
  
  // Load progress on refresh (optional)
  window.addEventListener('load', () => {
    const saved = localStorage.getItem('quiz-progress');
    if (saved) {
      const data = JSON.parse(saved);
      currentQuestionIndex = data.currentQuestionIndex;
      selectedAnswers = data.selectedAnswers;
      score = data.score;
      showQuestion();
    } else {
      startQuiz();
    }
  });
  