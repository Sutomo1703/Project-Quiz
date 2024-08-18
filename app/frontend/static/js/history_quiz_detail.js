async function getRecordsQuizbyId(id) {
  const response = await fetch("http://127.0.0.1:5000/api/records/" + id, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

async function getQuestionbyId(id) {
  const response = await fetch("http://127.0.0.1:5000/api/questions/" + id, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

async function getChoicebyId(choice_id) {
  const response = await fetch(
    "http://127.0.0.1:5000/api/choices/" + choice_id,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );
  return await response.json();
}

document.addEventListener("DOMContentLoaded", async function () {
  const record_quiz_id = document
    .querySelector(".isi-list")
    .getAttributeNames()[2]
    .substring(5);
  let records = await getRecordsQuizbyId(record_quiz_id);
  let alphabet = ["A", "B", "C", "D"];
  let number = 1;
  for (const record_answer of records.record_answers) {
    const question_id = record_answer.question_id;
    const choice_id = record_answer.choice_id;
    const question_response = await getQuestionbyId(question_id);
    const question = question_response.payload.data;
    const choice_response = await getChoicebyId(choice_id);
    const choice = choice_response.payload.data;
    let choices = "";
    let alpha_index = 0;
    for (const choice of question.choices.sort(function (a, b) {
      return a.id - b.id;
    })) {
      let selected =
        choice.id === choice_id
          ? `<span class="p-1" style="border: 1px solid black; border-radius: 50%">${alphabet[alpha_index]}.</span>`
          : `<span class="p-1">${alphabet[alpha_index]}.</span>`;
      let is_correct = choice.is_correct
        ? `
            <span class="correct">
            </span>`
        : "";
      let data = `
        <div class="d-flex align-items-start w-50">
            <span class="text-dark">
              <p>${selected}&nbsp;${choice.answer}</p>
            </span>${is_correct}
        </div>`;
      choices += data;
      alpha_index += 1;
    }
    let card = document.createElement("div");
    card.classList.add(
      "card",
      "shadow-sm",
      "animate__animated",
      "animate__fadeInUp",
      "animate__fast"
    );
    card.style.borderLeft = `5px solid ${
      choice.is_correct ? "#59d149" : "#d14949"
    }`;

    card.innerHTML = `
    <div class="card-body fw-lighter p-4 fs-875">
        <div class="d-flex align-items-center mb-4">
            <span translate="no">${number}.&nbsp;${question.question}</span>
        </div>
        <hr class="px-3 my-0">
        <div class="d-flex flex-row flex-wrap">
        ${choices}
        </div>
    </div>
    `;
    document.querySelector(".isi-list").append(card);
    number += 1;
  }
});
