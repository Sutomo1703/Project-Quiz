async function getRecordsQuiz(page = 1) {
  const response = await fetch(
    "http://127.0.0.1:5000/api/records?page=" + page,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

async function getQuizbyId(id) {
  const response = await fetch("http://127.0.0.1:5000/api/quizzes/" + id, {
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

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

async function getQuestionsByIdQuiz(id_quiz) {
  const response = await fetch(
    "http://127.0.0.1:5000/api/quizzes/" + id_quiz + "/questions",
    { credentials: "include" }
  );
  return await response.json();
}

function getAttributeByRegex(element, regex) {
  const attributes = element.attributes;
  for (let i = attributes.length - 1; i >= 0; i--) {
    const attr = attributes[i];
    if (regex.test(attr.name)) {
      return attr.name;
    }
    return undefined;
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  let page_num =
    window.location.search.substring(6) !== ""
      ? window.location.search.substring(6)
      : 1;
  const containerbox = document.querySelector(".isi-list");
  let response = await getRecordsQuiz(page_num);
  const records = response.payload.data;
  const pagination = response.payload.pagination;
  let next = pagination.next;
  let prev = pagination.prev;
  let total_pages = pagination.total_pages;
  let current_page = pagination.current_page;
  for (const record of records.sort(function (a, b) {
    return new Date(b.tanggal_kerja) - new Date(a.tanggal_kerja);
  })) {
    let card = document.createElement("div");
    const response = await getQuizbyId(record.quiz_id);
    const quiz = response.payload.data;
    card.classList.add(
      "card",
      "shadow-sm",
      "animate__animated",
      "animate__fadeInUp",
      "animate__fast"
    );
    card.setAttribute(`data-${record.id}`, "");
    card.innerHTML = `
    <div class="card-body" data-${record.id}>
        <div class="d-flex justify-content-start" data-${record.id}>
            <div class="fs-5 fw-semibold text-wrap" style="width:196px;" data-${
              record.id
            }>${quiz.quiz_name}</div>
        </div>
        <div class="pt-2 d-flex justify-content-between" data-${record.id}>
            <small class="fw-lighter date-play-quiz" data-${
              record.id
            }>${record.tanggal_kerja.split("T").join(" ")}</small>
            <div class="d-flex gap-3">
                <small class="fw-lighter score" data-${record.id}>${
      record.nilai % 1 != 0 ? record.nilai.toFixed(2) : record.nilai
    }%</small>
                <small class="fw-lighter total-question" data-${record.id}>${
      quiz.questions.length
    } Pertanyaan</small>
            </div>
        </div>
    </div> 
    `;
    containerbox.append(card);
  }
  let page = document.createElement("nav");
  let prev_page =
    prev !== null
      ? `<li class="page-item">
              <a class="page-link" href="/records?page=${prev}" aria-label="Next">
                <span class="text-dark" aria-hidden="true">&laquo;</span>
              </a>
          </li>`
      : ``;
  let next_page =
    next !== null
      ? `<li class="page-item">
                  <a class="page-link" href="/records?page=${next}" aria-label="Next">
                    <span class="text-dark" aria-hidden="true">&raquo;</span>
                  </a>
              </li>`
      : ``;
  let list_page = "";
  let i = current_page + 2 > total_pages ? total_pages - 2 : current_page;
  i = i <= 0 ? 1 : i;
  let max = current_page + 2 > total_pages ? total_pages : current_page + 2;

  for (i; i <= max; i++) {
    list_page += `<li class="page-item"><a class="page-link ${
      i === Number(page_num) ? "active text-light" : "text-dark"
    }" href="/records?page=${i}">${i}</a></li>`;
  }

  page.classList.add(
    "d-flex",
    "justify-content-center",
    "animate__animated",
    "animate__fadeInUp",
    "animate__fast"
  );
  page.innerHTML = `
  <ul class="pagination">
      ${prev_page}
      ${list_page}
      ${next_page}
  </ul>
  `;

  document.getElementById("main").append(page);

  document.addEventListener("click", async function (e) {
    let attr_name = getAttributeByRegex(e.target, /data-[0-9]+/g);
    if (attr_name !== undefined) {
      window.location.href = `/records/${attr_name.substring(5)}/details`;
    }
  });
});
