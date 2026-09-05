// =========================================
// TEXT READABILITY ANALYZER
// FINAL FRONTEND JAVASCRIPT
// =========================================

// =========================================
// ELEMENT REFERENCES
// =========================================

const textInput = document.getElementById("textInput");

const wordCount = document.getElementById("wordCount");

const analyzeButton = document.getElementById("analyzeButton");

const analyzeTextLabel = document.getElementById("analyzeText");

const loadingSpinner = document.getElementById("loadingSpinner");

const clearButton = document.getElementById("clearButton");

const results = document.getElementById("results");

const errorMessage = document.getElementById("errorMessage");

const finalReadability = document.getElementById("finalReadability");

const resultDescription = document.getElementById("resultDescription");

const ensembleSummary = document.getElementById("ensembleSummary");

const fleschScore = document.getElementById("fleschScore");

const fkglScore = document.getElementById("fkglScore");

const colemanScore = document.getElementById("colemanScore");

const sentenceCount = document.getElementById("sentenceCount");

const resultWordCount = document.getElementById("resultWordCount");

const syllableCount = document.getElementById("syllableCount");

const sentenceLength = document.getElementById("sentenceLength");

const syllablesPerWord = document.getElementById("syllablesPerWord");

const fleschClassification = document.getElementById("fleschClassification");

const fkglClassification = document.getElementById("fkglClassification");

const colemanClassification = document.getElementById("colemanClassification");

const themeToggle = document.getElementById("themeToggle");

const themeIcon = document.getElementById("themeIcon");

// =========================================
// WORD COUNTER
// =========================================

textInput.addEventListener("input", updateWordCount);

function updateWordCount() {
  const text = textInput.value.trim();

  if (!text) {
    wordCount.textContent = "0 words";

    return;
  }

  const words = text.split(/\s+/).filter((word) => word.length > 0);

  wordCount.textContent = `${words.length} ${
    words.length === 1 ? "word" : "words"
  }`;
}

// =========================================
// CLEAR BUTTON
// =========================================

clearButton.addEventListener("click", clearText);

function clearText() {
  textInput.value = "";

  updateWordCount();

  results.classList.add("hidden");

  errorMessage.classList.add("hidden");

  textInput.focus();
}

// =========================================
// THEME SWITCHING
// =========================================

themeToggle.addEventListener("click", toggleTheme);

function toggleTheme() {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  themeIcon.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Restore saved theme

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");

  themeIcon.textContent = "☀️";
}

// =========================================
// ANALYZE BUTTON
// =========================================

analyzeButton.addEventListener("click", analyzeText);

async function analyzeText() {
  const text = textInput.value.trim();

  // Hide previous error

  errorMessage.classList.add("hidden");

  // Validate input

  if (!text) {
    results.classList.add("hidden");

    showError("Please enter some text to analyze.");

    textInput.focus();

    return;
  }

  // Start loading state

  setLoading(true);

  try {
    const response = await fetch(
      "https://text-readability-analyzer-glmo.onrender.com/analyze",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          text: text,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to analyze the text.");
    }
    //await new Promise((resolve) => setTimeout(resolve, 300));

    displayResults(data);
  } catch (error) {
    results.classList.add("hidden");

    showError(error.message || "Unable to connect to the server.");
  } finally {
    setLoading(false);
  }
}

// =========================================
// LOADING STATE
// =========================================

function setLoading(isLoading) {
  analyzeButton.disabled = isLoading;

  clearButton.disabled = isLoading;

  if (isLoading) {
    analyzeTextLabel.textContent = "Analyzing";

    loadingSpinner.classList.remove("hidden");
  } else {
    analyzeTextLabel.textContent = "Analyze Text";

    loadingSpinner.classList.add("hidden");
  }
}

// =========================================
// ERROR DISPLAY
// =========================================

function showError(message) {
  errorMessage.textContent = message;

  errorMessage.classList.remove("hidden");
}

// =========================================
// DISPLAY RESULTS
// =========================================

function displayResults(data) {
  // -------------------------------
  // Main result
  // -------------------------------

  finalReadability.textContent = data.final_readability;

  // -------------------------------
  // Scores
  // -------------------------------

  fleschScore.textContent = data.flesch_score;

  fkglScore.textContent = data.fkgl_score;

  colemanScore.textContent = data.coleman_liau_score;

  // -------------------------------
  // Statistics
  // -------------------------------

  sentenceCount.textContent = data.sentences;

  resultWordCount.textContent = data.words;

  syllableCount.textContent = data.syllables;

  sentenceLength.textContent = data.average_sentence_length;

  syllablesPerWord.textContent = data.average_syllables_per_word;

  // -------------------------------
  // Individual classifications
  // -------------------------------

  fleschClassification.textContent = data.flesch_classification;

  fkglClassification.textContent = data.fkgl_classification;

  colemanClassification.textContent = data.coleman_liau_classification;

  // -------------------------------
  // Overall description
  // -------------------------------

  updateResultDescription(data.final_readability);

  // -------------------------------
  // Ensemble explanation
  // -------------------------------

  updateEnsembleSummary(data);

  // -------------------------------
  // Result color
  // -------------------------------

  setReadabilityStyle(data.final_readability);

  // -------------------------------
  // Show results
  // -------------------------------

  results.classList.remove("hidden");

  // -------------------------------
  // Scroll to result
  // -------------------------------

  setTimeout(() => {
    results.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}

// =========================================
// RESULT DESCRIPTION
// =========================================

function updateResultDescription(level) {
  if (level === "Easy") {
    resultDescription.textContent = "Your text is easy to read and understand.";
  } else if (level === "Medium") {
    resultDescription.textContent =
      "Your text has a moderate level of reading difficulty.";
  } else {
    resultDescription.textContent =
      "Your text may require more effort to read and understand.";
  }
}

// =========================================
// ENSEMBLE EXPLANATION
// =========================================

function updateEnsembleSummary(data) {
  const classifications = [
    data.flesch_classification,

    data.fkgl_classification,

    data.coleman_liau_classification,
  ];

  const finalLevel = data.final_readability;

  const votes = classifications.filter((value) => value === finalLevel).length;

  if (votes === 3) {
    ensembleSummary.textContent = `All 3 readability metrics classified this text as ${finalLevel}.`;
  } else {
    ensembleSummary.textContent = `${votes} of 3 readability metrics classified this text as ${finalLevel}.`;
  }
}

// =========================================
// RESULT COLOR
// =========================================

function setReadabilityStyle(level) {
  finalReadability.style.color = "";

  if (level === "Easy") {
    finalReadability.style.color = "var(--success)";
  } else if (level === "Medium") {
    finalReadability.style.color = "var(--warning)";
  } else {
    finalReadability.style.color = "var(--danger)";
  }
}
