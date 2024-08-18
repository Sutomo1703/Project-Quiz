//getting all required elements
// const quiz_box = document.querySelector(".quiz_box");
// const option_list = document.querySelector(".option_list");
// const timeCount = quiz_box.querySelector(".timer .timer_sec");
// const timeLine = quiz_box.querySelector("header .time_line");
// const timeOff = quiz_box.querySelector("header .time_text");

// Get all questions within a quiz
async function getQuestionsByIdQuiz(id_quiz) {
  const response = await fetch(
    "http://127.0.0.1:5000/api/quizzes/" + id_quiz + "/questions",
    { credentials: "include" }
  );
  return await response.json();
}

// Get all choices within a question
async function getChoicesByIdQuestions(question_id) {
  const response = await fetch(
    "http://127.0.0.1:5000/api/questions/" + question_id + "/choices",
    { credentials: "include" }
  );

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

// Get single choice within a question
async function getChoiceById(choice_id) {
  const response = await fetch(
    "http://127.0.0.1:5000/api/choices/" + choice_id,
    { credentials: "include" }
  );
  return await response.json();
}

// Create record quiz
async function createRecordQuiz(data) {
  const response = await fetch("http://127.0.0.1:5000/api/records", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

// Create record answer
async function createRecordAnswer(data) {
  const response = await fetch("http://127.0.0.1:5000/api/details", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

var que_numb = 0;
var user_score = 0;
var totalScore;
var counter;
var counterLine;
var time_in_s = 15;
var time_in_ms = time_in_s * 100;
var gmt;
var date_kerja_quiz;
var record_answers;

// Icon benar & salah
const tickIcon = '<div class="icon tick"><i class="fa fa-check"></i></div>';
const crossIcon = '<div class="icon cross"><i class="fa fa-times"></i></div>';

// Timer function
function startTimer(time, totalTime, question_id) {
  const timeCount = document.querySelector(".timer .timer_sec");
  const timeLine = document.querySelector("header .time_line");
  const timeOff = document.querySelector("header .time_text");
  const next_btn = document.querySelector(".next_btn");
  counter = setInterval(timer, 10);
  async function timer() {
    var res = time / 100;
    var barWidth = (res / totalTime) * 100;
    if (Math.round(res) < 10 && Math.round(res) >= 0) {
      timeCount.textContent = "0" + Math.round(res);
    } else if (Math.round(res) >= 10) {
      timeCount.textContent = Math.round(res) + "";
    }
    if (time < 0) {
      clearInterval(counter);
      timeOff.textContent = "Time Off";
      const option_list = document.querySelector(".option_list");
      var wrong_answer_id = [];
      const choices = (
        await getChoicesByIdQuestions(question_id)
      ).payload.data.sort((a, b) => a.id - b.id);
      for (let i = 0; i < choices.length; i++) {
        if (choices[i].is_correct) {
          option_list.children[i].setAttribute("class", "option correct");
          option_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
        } else {
          option_list.children[i].setAttribute("class", "option incorrect");
          option_list.children[i].insertAdjacentHTML("beforeend", crossIcon);

          wrong_answer_id.push(
            option_list.children[i].getAttributeNames()[1].substring(5)
          );
        }
        option_list.children[i].classList.add("disabled");
      }
      record_answers.push({
        question_id: question_id,
        choice_id:
          wrong_answer_id[Math.floor(Math.random() * wrong_answer_id.length)],
      });
      next_btn.style.display = "block";
    }
    timeLine.style.width = barWidth + "%";
    time--;
  }
}

// Display question
function showQuestions(index, questions) {
  let quiz_box = document.createElement("div");
  quiz_box.classList.add("quiz_box", "activeQuiz");
  quiz_box.innerHTML = `
      <header>
          <div class="title">Awesome Quiz Application</div>
          <div class="timer">
              <div class="time_text">Time Left</div>
              <div class="timer_sec"></div>
          </div>
          <div class="time_line"></div>
      </header>
      <section>
          <div class="que_text">
          </div>
          <div class="option_list">
          </div>
      </section>
      <!-- Quiz Box Footer -->
      <footer>
          <div class="total_que">
          </div>
          <button class="next_btn">Next Que</button>
      </footer>
      `;
  document.body.append(quiz_box);

  const timeCount = document.querySelector(".timer .timer_sec");
  const timeOff = document.querySelector("header .time_text");
  const bottom_ques_counter = document.querySelector(".total_que");
  const que_text = document.querySelector(".que_text");
  const option_list = document.querySelector(".option_list");
  const next_btn = document.querySelector(".next_btn");
  const number = index + 1;

  timeCount.textContent = time_in_s + "";
  startTimer(time_in_ms, time_in_s, questions[index].id);

  next_btn.style.display = "none";
  timeOff.textContent = "Time Left";
  questions[index].choices.sort((a, b) => a.id - b.id);
  let que_tag =
    "<span>" + number + ". " + questions[index].question + "</span>";
  let option_tag = `<div class="option" data-${questions[index].choices[0].id}>
        <span>${questions[index].choices[0].answer}</span>
    </div>
    <div class="option" data-${questions[index].choices[1].id}>
        <span>${questions[index].choices[1].answer}</span>
    </div>
    <div class="option" data-${questions[index].choices[2].id}>
        <span>${questions[index].choices[2].answer}</span>
    </div>
    <div class="option" data-${questions[index].choices[3].id}>
        <span>${questions[index].choices[3].answer}</span>
    </div>`;
  let totalQuesCountTag =
    "<span><p>" +
    number +
    "</p>of<p>" +
    questions.length +
    "</p>Questions</span>";

  que_text.setAttribute(`data-${questions[index].id}`, "");
  que_text.innerHTML = que_tag;
  option_list.innerHTML = option_tag;
  bottom_ques_counter.innerHTML = totalQuesCountTag;
  que_numb += 1;
}

// Display user score
function showResultBox(totalQuestion) {
  let result_box = document.createElement("div");
  result_box.classList.add("result_box", "activeResult");
  result_box.innerHTML = `
    <div class="icon">
        <i class="fa fa-star"></i>
    </div>
    <div class="complete_text">You have completed the Quiz!</div>
    <div class="score_text"></div>
    <div class="buttons">
        <button class="restart">Replay Quiz</button>
        <button class="finish">Quit Quiz</button>
    </div>
  `;
  document.body.append(result_box);
  let scoreTag;
  totalScore = (user_score / totalQuestion) * 100;
  const scoreText = result_box.querySelector(".score_text");
  scoreTag = `<span> You have answered ${Math.round(
    totalScore
  )}% questions correctly! </span>`;

  scoreText.innerHTML = scoreTag;
}

document.addEventListener("DOMContentLoaded", async function () {
  // Show an info quiz
  const id = document.body.getAttributeNames()[0].substring(5);
  const pengerja_id = document.body.getAttributeNames()[1].substring(5);
  const response = await getQuestionsByIdQuiz(id);
  const questions = response.payload.data.sort((a, b) => a.id - b.id);
  const start_btn = document.querySelector(".start_btn button");
  start_btn.addEventListener("click", function () {
    date_kerja_quiz = new Date(Date.now()).toISOString().split(".")[0] + "Z";
    record_answers = [];
    this.parentElement.remove();
    let info_box = document.createElement("div");
    info_box.classList.add("info_box", "activeInfo");
    info_box.innerHTML = `
    <div class="info_title">
        <span>Some Rules of this Quiz</span>
    </div>
    <div class="info_list">
        <div class="info">1. You will have only <span>15 seconds</span> per each question.</div>
        <div class="info">2. Once you select your answer, you can't reselect.</div>
        <div class="info">3. You can't select any option once time goes off.</div>
        <div class="info">4. You can't exit from the Quiz while you're playing.</div>
        <div class="info">5. You'll get points on the basis of your correct answers.</div>
    </div>
    <div class="buttons">
        <button class="quit">Exit Quiz</button>
        <button class="next_btn">Continue</button>
    </div>
    `;
    document.body.append(info_box);
  });
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("quit")) {
      window.location.href = "/activities";
    }
    if (e.target.classList.contains("finish")) {
      let data = {
        quiz_id: id,
        pengerja_id: pengerja_id,
        nilai: totalScore,
        tanggal_kerja: date_kerja_quiz,
      };
      const record_quiz = await createRecordQuiz(data);
      for (const record_answer of record_answers) {
        let data = {
          record_quiz_id: record_quiz.id,
          question_id: record_answer.question_id,
          choice_id: record_answer.choice_id,
        };
        await createRecordAnswer(data);
      }
      window.location.href = "/activities";
    }
    if (e.target.classList.contains("option")) {
      clearInterval(counter);
      const options = e.target.parentElement.children;
      const next_btn = document.querySelector(".next_btn");
      const question_id = document
        .querySelector(".que_text")
        .getAttributeNames()[1]
        .substring(5);
      const choice_id = e.target.getAttributeNames()[1].substring(5);
      const choice = (await getChoiceById(choice_id)).payload.data;
      if (choice.is_correct) {
        user_score += 1;
        e.target.classList.add("correct");
        e.target.insertAdjacentHTML("beforeend", tickIcon);
      } else {
        const choices = (
          await getChoicesByIdQuestions(question_id)
        ).payload.data.sort((a, b) => a.id - b.id);
        const option_list = e.target.parentElement;
        for (let i = 0; i < choices.length; i++) {
          if (choices[i].is_correct) {
            option_list.children[i].setAttribute("class", "option correct");
            option_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
          } else {
            option_list.children[i].setAttribute("class", "option incorrect");
            option_list.children[i].insertAdjacentHTML("beforeend", crossIcon);
          }
        }
      }
      for (const option of options) {
        option.classList.add("disabled");
      }
      record_answers.push({
        question_id: question_id,
        choice_id: choice_id,
      });
      next_btn.style.display = "block";
    }
    if (e.target.classList.contains("next_btn")) {
      e.target.parentElement.parentElement.remove();
      if (que_numb < questions.length) {
        showQuestions(que_numb, questions);
      } else {
        showResultBox(questions.length);
      }
    }
    if (e.target.classList.contains("restart")) {
      e.target.parentElement.parentElement.remove();
      que_numb = 0;
      user_score = 0;
      // gmt = new Date().getTimezoneOffset() * 60000;
      date_kerja_quiz = new Date(Date.now()).toISOString().split(".")[0] + "Z";
      record_answers = [];
      showQuestions(que_numb, questions);
    }
  });
});
