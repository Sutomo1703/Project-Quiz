async function getQuizById(id) {
  const response = await fetch("http://127.0.0.1:5000/api/quizzes/" + id, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  return await response.json();
}

async function updateQuizById(id, data) {
  const response = await fetch("http://127.0.0.1:5000/api/quizzes/" + id, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await response.json();
}

async function createQuestion(data) {
  const response = await fetch("http://127.0.0.1:5000/api/questions", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

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

async function updateQuestionById(id, data) {
  const response = await fetch("http://127.0.0.1:5000/api/questions/" + id, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

async function deleteQuestionById(id) {
  const response = await fetch("http://127.0.0.1:5000/api/questions/" + id, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

async function createChoice(data) {
  const response = await fetch("http://127.0.0.1:5000/api/choices", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

async function updateChoiceById(id, data) {
  const response = await fetch("http://127.0.0.1:5000/api/choices/" + id, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

document.addEventListener("DOMContentLoaded", async function (event) {
  if (sessionStorage.getItem("status") !== null) {
    let title;
    if (sessionStorage.getItem("message") == "edit-quiz-title") {
      title = "Judul kuis berhasil diubah";
    } else if (sessionStorage.getItem("message") == "create-question") {
      title = "Pertanyaan berhasil dibuat";
    } else if (sessionStorage.getItem("message") == "edit-question") {
      title = "Pertanyaan berhasil diubah";
    } else if (sessionStorage.getItem("message") == "delete-question") {
      title = "Pertanyaan berhasil dihapus";
    }
    Swal.fire({
      toast: true,
      icon: "success",
      text: title,
      showConfirmButton: false,
      position: "top-end",
      padding: ".5rem .75rem",
      width: "350px",
      timer: 3000,
      showClass: {
        popup: "animate__animated animate__slideInRight animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__slideOutRight animate__faster",
      },
    });
    sessionStorage.clear();
  }

  // Get Quiz Title From DB
  const id = document
    .getElementById("edit-quiz-title")
    .getAttributeNames()[7]
    .substring(5);
  const response = await getQuizById(parseInt(id));
  const status_code = response.payload.status_code;
  const quiz = response.payload.data;
  var quizTitle = document.getElementById("quiz-title-text");
  if (status_code === 200) {
    quizTitle.innerHTML = quiz.quiz_name;
  } else {
    quizTitle.innerHTML = "Undefined";
  }

  // BOOTSTRAP MODAL
  var modalWrap = null;
  var modal;

  var questionList = document.getElementById("question-list");

  const editQuizTitleBtn = document.getElementById("edit-quiz-title");
  const createQuestionBtn = document.getElementById("create-question");
  const backBtn = document.getElementById("back");
  var index = 1;
  let alphabet = ["A", "B", "C", "D"];
  // SHOW QUESTION QUIZ
  if (status_code === 200) {
    const response = await getQuestionsByIdQuiz(id);
    const questions = response.payload.data.sort((a, b) => a.id - b.id);
    if (questions.length === 0) {
      document.getElementById(
        "main"
      ).innerHTML = `<span class="fs-3 text-muted text-center animate__animated animate__fadeInUp animate__fast">Pertanyaan Tidak Ada!</span>`;
    } else {
      for (const question of questions) {
        let choices = "";
        let alpha_index = 0;
        for (const choice of question.choices.sort(function (a, b) {
          return a.id - b.id;
        })) {
          let is_correct = choice.is_correct
            ? `
          <span class="correct">
          </span>`
            : "";
          let data = `
      <div class="d-flex align-items-start w-50" data-${choice.id}>
          <span class="text-dark">
            <p>${alphabet[alpha_index]}.&nbsp;${choice.answer}</p>
          </span>${is_correct}
      </div>`;
          choices += data;
          alpha_index += 1;
        }
        const html = `
    <div class="card my-2 shadow-sm animate__animated animate__fadeInUp animate__fast">
      <div class="card-header d-flex flex-row justify-content-between p-2">
          <button class="edit-question btn btn-sm" data-${question.id} data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title="Sunting pertanyaan ini">
              Pertanyaan ${index}
              <span class="text-secondary">|</span>
          </button>
          <div class="d-flex">
              <button class="delete-question btn btn-sm btn-outline-danger" data-${question.id} data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title="Hapus pertanyaan ini">
              </button>
          </div>
      </div>
      <div class="card-body fw-lighter p-4 fs-875">
          <div class="d-flex align-items-center mb-4">
              <span translate="no">Q.&nbsp;${question.question}</span>
          </div>
          <hr class="px-3 my-0">
          <div class="d-flex flex-row flex-wrap">
          ${choices}
          </div>
      </div>
    </div>`;
        questionList.innerHTML += html;
        index += 1;
      }
    }
  }
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );

  editQuizTitleBtn.addEventListener("click", function () {
    modalWrap = document.createElement("div");
    modalWrap.innerHTML = `
    <div class="modal fade" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Quiz Title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="edit-quiz-title-form" class="needs-validation" novalidate>
                    <div class="modal-body">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="quizTitle" placeholder="placeholder" required>
                            <label for="quizTitle" class="form-label">Quiz Title</label>
                            <div class="invalid-feedback">Judul quiz harus diisi</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn text-danger" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-bg-273656">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
    document.body.append(modalWrap);
    modal = new bootstrap.Modal(modalWrap.querySelector(".modal"));
    modal.show();
    let quizTitle = this.children[0].innerText;
    let newQuizTitle = document.getElementById("quizTitle");
    newQuizTitle.value = quizTitle;
  });

  createQuestionBtn.addEventListener("click", function () {
    modalWrap = document.createElement("div");
    modalWrap.innerHTML = `
    <div class="modal fade" id="createQuestionModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Buat Pertanyaan Baru</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="create-question-form" class="needs-validation" novalidate>
                    <div class="modal-body">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="newQuestionContent" placeholder="placeholder" required>
                            <label for="questionContent" class="form-label">Pertanyaan</label>
                            <div class="invalid-feedback">Pertanyaan harus diisi</div>
                        </div>
                        <hr class="px-3 my-0">
                        <div class="d-flex flex-wrap">
                            <div class="d-flex align-items-start mb-2 w-50">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="is_correct"
                                        data-bs-toggle="tooltip" data-bs-container="body" data-bs-trigger="hover"  data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                        title="Tandai sebagai jawaban yang benar" required>
                                    <input type="text" class="w-75 form-control form-control-sm" placeholder="Isi jawaban..." required>
                                    <div class="invalid-feedback">jawaban harus diisi</div>
                                </div>
                            </div>
                            <div class="d-flex align-items-start mb-2 w-50">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="is_correct"
                                        data-bs-toggle="tooltip" data-bs-container="body" data-bs-trigger="hover"  data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                        title="Tandai sebagai jawaban yang benar" required>
                                    <input type="text" class="w-75 form-control form-control-sm" placeholder="Isi jawaban..." required>
                                    <div class="invalid-feedback">jawaban harus diisi</div>
                                </div>
                            </div>
                            <div class="d-flex align-items-start mb-2 w-50">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="is_correct"
                                        data-bs-toggle="tooltip" data-bs-container="body" data-bs-trigger="hover"  data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                        title="Tandai sebagai jawaban yang benar" required>
                                    <input type="text" class="w-75 form-control form-control-sm" placeholder="Isi jawaban..." required>
                                    <div class="invalid-feedback">jawaban harus diisi</div>
                                </div>
                            </div>
                            <div class="d-flex align-items-start mb-2 w-50">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="is_correct"
                                        data-bs-toggle="tooltip" data-bs-container="body" data-bs-trigger="hover"  data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                        title="Tandai sebagai jawaban yang benar" required>
                                    <input type="text" class="w-75 form-control form-control-sm" placeholder="Isi jawaban..." required>
                                    <div class="invalid-feedback">jawaban harus diisi</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                      <div class="d-flex justify-content-start">
                          <select class="form-select me-2" id="timer">
                              <option>5 Seconds</option>
                              <option>10 Seconds</option>
                              <option>20 Seconds</option>
                              <option selected>30 Seconds</option>
                              <option>45 Seconds</option>
                              <option>1 Minutes</option>
                              <option>2 Minutes</option>
                              <option>3 Minutes</option>
                              <option>5 Minutes</option>
                              <option>10 Minutes</option>
                              <option>15 Minutes</option>
                          </select>
                          <select class="form-select me-5" id="timer">
                              <option selected>1 Point</option>
                              <option>2 Points</option>
                              <option>5 Points</option>
                              <option>10 Points</option>
                              <option>20 Points</option>
                          </select>
                        </div>
                        <button type="button" class="btn text-danger" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-bg-273656" id="saveCreateQuestion">Buat</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
    document.body.append(modalWrap);
    modal = new bootstrap.Modal(modalWrap.querySelector(".modal"));
    modal.show();
    const tooltipTriggerList = modalWrap.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
  });

  backBtn.addEventListener("click", function () {
    window.location.href = "/activities";
  });

  // Binding "submit" event
  document.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (e.target.id === "edit-quiz-title-form") {
      if (!e.target.checkValidity()) {
        e.stopPropagation();
      } else {
        modal.hide();
        const new_quiz_title = document.getElementById("quizTitle");
        let data = {
          quiz_name: new_quiz_title.value,
        };
        await updateQuizById(id, data);
        sessionStorage.setItem("status", "success");
        sessionStorage.setItem("message", "edit-quiz-title");
        window.location.reload();
      }
      e.target.classList.add("was-validated");
    }
    if (e.target.id === "create-question-form") {
      if (!e.target.checkValidity()) {
        e.stopPropagation();
      } else {
        modal.hide();
        const question =
          e.target.firstElementChild.firstElementChild.firstElementChild;
        const choices = e.target.firstElementChild.lastElementChild.children;
        let question_data = {
          quiz_id: quiz.id,
          question: question.value,
        };
        const response = await createQuestion(question_data);
        const new_question = response.payload.data;
        for (const choice of choices) {
          let choice_data = {
            question_id: new_question.id,
            choice: choice.firstElementChild.children[1].value,
            is_correct: choice.firstElementChild.firstElementChild.checked,
          };
          await createChoice(choice_data);
        }
        sessionStorage.setItem("status", "success");
        sessionStorage.setItem("message", "create-question");
        window.location.reload();
      }
      e.target.classList.add("was-validated");
    }
    if (e.target.id === "edit-question-form") {
      if (!e.target.checkValidity()) {
        e.stopPropagation();
      } else {
        modal.hide();
        const question =
          e.target.firstElementChild.firstElementChild.firstElementChild;
        const id = e.target.lastElementChild.lastElementChild
          .getAttributeNames()[2]
          .substring(5);
        const choices = e.target.firstElementChild.lastElementChild.children;
        let question_data = {
          quiz_id: quiz.id,
          question: question.value,
        };
        const response = await updateQuestionById(id, question_data);
        const update_question = response.payload.data;
        for (const choice of choices) {
          const id = choice.lastElementChild.value;
          let choice_data = {
            question_id: update_question.id,
            choice: choice.firstElementChild.children[1].value,
            is_correct: choice.firstElementChild.firstElementChild.checked,
          };
          await updateChoiceById(id, choice_data);
        }
        sessionStorage.setItem("status", "success");
        sessionStorage.setItem("message", "edit-question");
        window.location.reload();
      }
      e.target.classList.add("was-validated");
    }
  });

  // Binding "hidden.bs.modal" event
  document.addEventListener("hidden.bs.modal", function (e) {
    if (e.target.classList.contains("modal")) {
      e.target.parentElement.remove();
    }
  });

  // Binding "click" event
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("delete-question")) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-bg-273656 ms-2",
          cancelButton: "btn text-danger me-2",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Apakah kamu yakin?",
          text: "Pertanyaan ini akan terhapus secara permanen!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, hapus!",
          cancelButtonText: "Tidak!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const questionid = e.target.getAttributeNames()[1].substring(5);
            await deleteQuestionById(questionid);
            sessionStorage.setItem("status", "success");
            sessionStorage.setItem("message", "delete-question");
            window.location.reload();
          }
        });
    }
    if (e.target.classList.contains("edit-question")) {
      modalWrap = document.createElement("div");
      modalWrap.innerHTML = `
        <div class="modal fade" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Pertanyaan</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form id="edit-question-form" class="needs-validation" novalidate>
                        <div class="modal-body">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="edit-question-content" placeholder="placeholder" required>
                                <label for="questionContent" class="form-label">Pertanyaan</label>
                                <div class="invalid-feedback">Pertanyaan harus diisi</div>
                            </div>
                            <hr class="px-3 my-0">
                            <div id="editChoicesQuestion" class="d-flex flex-wrap">
                                <div class="d-flex align-items-start mb-2 w-50">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="is_correct"
                                            data-bs-toggle="tooltip" data-bs-trigger="hover"  data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                            title="Tandai sebagai jawaban yang benar" required>
                                        <input type="text" class="w-75 form-control form-control-sm" placeholder="Tulis jawaban..." required>
                                        <div class="invalid-feedback">jawaban harus diisi</div>
                                    </div>
                                    <input type="hidden" class="choice-id">
                                </div>
                                <div class="d-flex align-items-start mb-2 w-50">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="is_correct"
                                            data-bs-toggle="tooltip" data-bs-trigger="hover"  data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                            title="Tandai sebagai jawaban yang benar" required>
                                        <input type="text" class="w-75 form-control form-control-sm" placeholder="Tulis jawaban..." required>
                                        <div class="invalid-feedback">jawaban harus diisi</div>
                                    </div>
                                    <input type="hidden" class="choice-id">
                                </div>
                                <div class="d-flex align-items-start mb-2 w-50">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="is_correct"
                                            data-bs-toggle="tooltip" data-bs-trigger="hover"  data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                            title="Tandai sebagai jawaban yang benar" required>
                                        <input type="text" class="w-75 form-control form-control-sm" placeholder="Tulis jawaban..." required>
                                        <div class="invalid-feedback">jawaban harus diisi</div>
                                    </div>
                                    <input type="hidden" class="choice-id">
                                </div>
                                <div class="d-flex align-items-start mb-2 w-50">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="is_correct"
                                            data-bs-toggle="tooltip" data-bs-trigger="hover"  data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                            title="Tandai sebagai jawaban yang benar" required>
                                        <input type="text" class="w-75 form-control form-control-sm" placeholder="Tulis jawaban..." required>
                                        <div class="invalid-feedback">jawaban harus diisi</div>
                                    </div>
                                    <input type="hidden" class="choice-id">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn text-danger" data-bs-dismiss="modal">Batal</button>
                            <button type="submit" class="btn btn-bg-273656">
                                Simpan
                            </button>
                            <input type="hidden" id="question-id">
                        </div>
                    </form>
                </div>
            </div>
        </div>
      `;
      document.body.append(modalWrap);
      modal = new bootstrap.Modal(modalWrap.querySelector(".modal"));
      modal.show();
      const tooltipTriggerList = modalWrap.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
      );
      const tooltipList = [...tooltipTriggerList].map(
        (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
      );
      let question =
        e.target.parentElement.parentElement.children[1].children[0].innerText.substring(
          3
        );
      let editQuestion = document.getElementById("edit-question-content");
      let choices =
        e.target.parentElement.parentElement.children[1].children[2];
      let editChoices = document.getElementById("editChoicesQuestion");
      for (let index = 0; index < 4; index++) {
        editChoices.children[index].firstElementChild.children[1].value =
          choices.children[index].innerText.substring(3);
        editChoices.children[index].firstElementChild.children[0].checked =
          choices.children[index].getElementsByClassName("correct")[0] !==
          undefined
            ? true
            : false;
      }
      editQuestion.value = question;
      let idQuestion = document.getElementById("question-id");
      idQuestion.setAttribute(
        `data-${e.target.getAttributeNames()[1].substring(5)}`,
        ""
      );
      let idChoices = document.getElementsByClassName("choice-id");
      for (let i = 0; i < 4; i++) {
        idChoices[i].value =
          e.target.parentElement.parentElement.lastElementChild.lastElementChild.children[
            i
          ]
            .getAttributeNames()[1]
            .substring(5);
      }
    }
  });
});
