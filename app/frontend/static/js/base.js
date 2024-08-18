async function createQuiz(data) {
  const response = await fetch("http://127.0.0.1:5000/api/quizzes", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

async function logout() {
  const response = await fetch("http://127.0.0.1:5000/api/users/logout", {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

var modalWrap;
var modal;

document.addEventListener("DOMContentLoaded", function (event) {
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("create-quiz")) {
      modalWrap = document.createElement("div");
      modalWrap.classList.add("modal", "fade");
      modalWrap.tabIndex = -1;
      modalWrap.ariaHidden = true;
      modalWrap.innerHTML = `
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">Buat Quiz Title</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form>
                  <div class="modal-body">
                      <div class="form-floating mb-3">
                          <input type="text" class="form-control" id="quiz-title" placeholder="placeholder">
                          <label for="quizTitle" class="form-label">Quiz Title</label>
                      </div>
                  </div>
                  <div class="modal-footer">
                  <button type="button" class="btn text-danger" data-bs-dismiss="modal">Batal</button>
                      <button type="button" class="btn btn-bg-273656 save-create-quiz">
                          Buat
                      </button>
                  </div>
              </form>
          </div>
      </div>
      `;
      document.body.append(modalWrap);
      modal = new bootstrap.Modal(document.querySelector(".modal"));
      modal.show();
    }
    if (e.target.classList.contains("save-create-quiz")) {
      const quiz_name = document.getElementById("quiz-title");
      let data = {
        quiz_name: quiz_name.value,
      };
      const new_quiz = await createQuiz(data);
      window.location.href = "quiz/" + new_quiz.payload.data.id + "/edit";
    }
    if (e.target.classList.contains("logout")) {
      const response = await logout();
      const status_code = response.payload.status_code;
      const message = response.payload.message;
      Swal.fire({
        icon: status_code === 200 ? "success" : "error",
        title: message,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        if (status_code === 200) {
          window.location.href = "/login";
        }
      });
    }
  });

  document.addEventListener("hidden.bs.modal", function (e) {
    e.target.remove();
  });
});
