// Global variables
let quizHistory = [];
let selectedSubjects = [];
let quizQuestions = [];
let userAnswers = {};
let scoreChartInstance = null; // Store reference to the score chart instance
let performanceChartInstance = null; // Store reference to the quiz performance chart instance

// Courses and subjects
const courses = {
  "dataScience": ["IoT", "Python Basics", "Machine Learning"],
  "python": ["Python Basics", "Advanced Python", "Data Structures"],
  "AI and DS": ["IoT", "Python Basics", "Principles of Programming"],
  "CS": ["DVP", "DDCO", "Python Basics"],
  "EC": ["Electronic Devices", "Analog Circuits", "Digital Systems"]
};

// Quiz questions for different subjects
const quizzes = {
  "IoT": [
    {
      question: "What does IoT stand for?",
      options: ["Internet of Things", "Internal of Technology", "International of Transactions", "Internal Operating Technique"],
      correctAnswer: "Internet of Things"
    },
    {
      question: "Which protocol is commonly used in IoT devices?",
      options: ["HTTP", "MQTT", "FTP", "SMTP"],
      correctAnswer: "MQTT"
    }
  ],
  "Python Basics": [
    {
      question: "What is the first step in the Data Science workflow?",
      options: ["Data Collection", "Data Cleaning", "Model Training", "Data Visualization"],
      correctAnswer: "Data Collection"
    },
    {
      question: "Which algorithm is used in supervised learning?",
      options: ["K-Means", "Linear Regression", "DBSCAN", "K-NN"],
      correctAnswer: "Linear Regression"
    }
  ]
};

// Authentication Toggle
document.getElementById('showSignup').onclick = function() {
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('signupContainer').style.display = 'block';
};

document.getElementById('showLogin').onclick = function() {
  document.getElementById('signupContainer').style.display = 'none';
  document.getElementById('loginContainer').style.display = 'block';
};

// Login and Signup Handling
document.getElementById('loginForm').onsubmit = function(e) {
  e.preventDefault();
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('courseSelectionContainer').style.display = 'block';
  showCourseSubjects();
};

document.getElementById('signupForm').onsubmit = function(e) {
  e.preventDefault();
  alert('Signup successful!');
  document.getElementById('signupContainer').style.display = 'none';
  document.getElementById('courseSelectionContainer').style.display = 'block';
  showCourseSubjects();
};

// Show Subjects Based on Selected Course
function showCourseSubjects() {
  const course = document.getElementById('courseSelect').value;
  const subjectsContainer = document.getElementById('subjects-container');
  const subjectsList = document.getElementById('subjects-list');

  subjectsList.innerHTML = '';
  selectedSubjects = [];

  if (course && courses[course]) {
    subjectsContainer.style.display = 'block';
    courses[course].forEach(subject => {
      const subjectElement = document.createElement('div');
      subjectElement.className = 'subject';
      subjectElement.innerHTML = subject;
      subjectElement.onclick = () => selectSubject(subjectElement, subject);
      subjectsList.appendChild(subjectElement);
    });
  } else {
    subjectsContainer.style.display = 'none';
  }
}

// Course Selection Event Listener
document.getElementById('courseSelect').onchange = showCourseSubjects;

// Subject Selection
function selectSubject(element, subject) {
  // Clear all selections
  const allSubjects = document.querySelectorAll('.subjects-list .subject');
  allSubjects.forEach(sub => {
    sub.classList.remove('selected');
  });

  // Update selectedSubjects to have only one subject
  selectedSubjects = [subject];
  element.classList.add('selected');
}

// Start Learning/Quiz
function startLearning() {
  if (selectedSubjects.length === 0) {
    alert('Please select a subject');
    return;
  }

  quizQuestions = [];
  selectedSubjects.forEach(subject => {
    quizQuestions = [...quizQuestions, ...(quizzes[subject] || [])];
  });

  // Render quiz questions
  const quizQuestionsContainer = document.getElementById('quizQuestions');
  quizQuestionsContainer.innerHTML = '';

  quizQuestions.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `<p>${question.question}</p>`;
    question.options.forEach(option => {
      const optionElement = document.createElement('div');
      optionElement.innerHTML = `<input type="radio" name="question${index}" value="${option}"> ${option}`;
      questionElement.appendChild(optionElement);
    });
    quizQuestionsContainer.appendChild(questionElement);
  });

  document.getElementById('courseSelectionContainer').style.display = 'none';
  document.getElementById('quizContainer').style.display = 'block';
}

// Submit Quiz
function submitQuiz() {
  const allRadios = document.querySelectorAll('input[type="radio"]:checked');
  let score = 0;

  allRadios.forEach(radio => {
    const questionIndex = radio.name.replace('question', '');
    if (radio.value === quizQuestions[questionIndex].correctAnswer) {
      score++;
    }
  });

  const scoreText = `You scored ${score} out of ${quizQuestions.length}`;
  document.getElementById('quizScore').textContent = scoreText;

  // Store quiz performance
  quizHistory.push({ score, total: quizQuestions.length });

  // Destroy the previous chart instance
  if (scoreChartInstance) {
    scoreChartInstance.destroy();
  }

  // Generate score chart
  const ctx = document.getElementById('scoreChart').getContext('2d');
  scoreChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Correct', 'Incorrect'],
      datasets: [{
        data: [score, quizQuestions.length - score],
        backgroundColor: ['#28a745', '#dc3545'],
      }]
    }
  });

  document.getElementById('quizContainer').style.display = 'none';
  document.getElementById('quizResultsContainer').style.display = 'block';
}

// Show Quiz Dashboard
function showQuizDashboard() {
  document.getElementById('quizResultsContainer').style.display = 'none';
  document.getElementById('quizDashboardContainer').style.display = 'block';

  const totalQuizzes = quizHistory.length;
  const correctAnswers = quizHistory.reduce((acc, quiz) => acc + quiz.score, 0);
  const totalQuestions = quizHistory.reduce((acc, quiz) => acc + quiz.total, 0);

  // Display total quizzes and correct answers
  document.getElementById('totalQuizzes').textContent = `Total Quizzes Taken: ${totalQuizzes}, Total Correct Answers: ${correctAnswers} out of ${totalQuestions}`;

  // Calculate the user's level
  const performancePercentage = (correctAnswers / totalQuestions) * 100;
  let level = '';
  let recommendedCourse = '';

  if (performancePercentage < 40) {
    level = 'Beginner';
    recommendedCourse = 'Introduction to Python';
  } else if (performancePercentage < 70) {
    level = 'Intermediate';
    recommendedCourse = 'Data Analysis with Pandas';
  } else {
    level = 'Advanced';
    recommendedCourse = 'Deep Learning with TensorFlow';
  }

  // Display the user's level and course recommendation
  document.getElementById('userLevel').textContent = `Your Level: ${level}`;
  document.getElementById('recommendedCourse').textContent = `Recommended Course: ${recommendedCourse}`;

  // Destroy the previous performance chart instance
  if (performanceChartInstance) {
    performanceChartInstance.destroy();
  }

  // Display quiz performance chart
  const ctx = document.getElementById('quizPerformanceChart').getContext('2d');
  performanceChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Total Correct Answers', 'Total Questions'],
      datasets: [{
        label: 'Quiz Performance',
        data: [correctAnswers, totalQuestions],
        backgroundColor: ['#28a745', '#ffc107'],
      }]
    }
  });
}

// Restart Course
function restartCourse() {
  document.getElementById('quizResultsContainer').style.display = 'none';
  document.getElementById('quizDashboardContainer').style.display = 'none';
  document.getElementById('courseSelectionContainer').style.display = 'block';
}
