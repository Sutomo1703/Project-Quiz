async function getQuiz(page = 1) {
  const response = await fetch(
    "http://127.0.0.1:5000/api/quizzes?page=" + page,
    {
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

async function deleteQuiz(quiz_id) {
  const response = await fetch("http://127.0.0.1:5000/api/quizzes/" + quiz_id, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error(`Error! status: ${response.status}`);
  return await response.json();
}

document.addEventListener("DOMContentLoaded", async function () {
  let page_num =
    window.location.search.substring(6) !== ""
      ? window.location.search.substring(6)
      : 1;
  const containerbox = document.querySelector(".isi-list");
  let response = await getQuiz(page_num);
  let status_code = response.payload.status_code;
  let quizzes = response.payload.data.sort((a, b) => a.id - b.id);
  const pagination = response.payload.pagination;
  let next = pagination.next;
  let prev = pagination.prev;
  let total_pages = pagination.total_pages;
  let current_page = pagination.current_page;
  if (status_code === 200) {
    if (quizzes.length <= 0) {
      containerbox.innerHTML = `<span class="fs-3 text-muted text-center animate__animated animate__fadeInUp animate__fast">Quiz Tidak Ada!</span>`;
    } else {
      for (const quiz of quizzes) {
        let card = document.createElement("div");
        card.classList.add(
          "card",
          "mb-2",
          "shadow-sm",
          "animate__animated",
          "animate__fadeInUp",
          "animate__fast"
        );
        card.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between">
                <div class="fs-5 fw-semibold text-wrap" style="width:196px;">${quiz.quiz_name}</div>
                <div class="d-flex align-items-center">
                    <button type="button" class="btn btn-sm text-success play-quiz" data-${quiz.id} data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title="Mainkan Kuis"></button>
                    <button type="button" class="btn btn-sm text-warning edit-quiz" data-${quiz.id} data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title="Sunting Kuis"></button>
                    <button type="button" class="btn btn-sm text-danger delete-quiz" data-${quiz.id} data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title="Hapus Kuis"></button>
                </div>
            </div>
            <div class="d-flex gap-3 pt-2">
                <small class="fw-lighter total-question">${quiz.questions.length} Pertanyaan</small>
                <small class="fw-lighter total-play-quiz">${quiz.record_quizzes.length} Bermain</small>
            </div>
        </div> 
        `;
        containerbox.append(card);
      }
      let page = document.createElement("nav");
      let prev_page =
        prev !== null
          ? `<li class="page-item">
              <a class="page-link" href="/activities?page=${prev}" aria-label="Next">
                <span class="text-dark" aria-hidden="true">&laquo;</span>
              </a>
          </li>`
          : ``;
      let next_page =
        next !== null
          ? `<li class="page-item">
                  <a class="page-link" href="/activities?page=${next}" aria-label="Next">
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
        }" href="/activities?page=${i}">${i}</a></li>`;
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
    }
  } else {
    containerbox.innerHTML = `<span class="fs-3 text-muted text-center animate__animated animate__fadeInUp animate__fast">Quiz Tidak Ada!</span>`;
  }

  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );

  if (sessionStorage.getItem("status") !== null) {
    let title;
    if (sessionStorage.getItem("message") == "delete-quiz") {
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

  // Binding "click" event
  document.addEventListener("click", async function (e) {
    // Edit Quiz
    if (e.target.classList.contains("edit-quiz")) {
      const quizid = e.target.getAttributeNames()[2].substring(5);
      window.location.href = `/quiz/${quizid}/edit`;
    }
    // Delete Quiz
    if (e.target.classList.contains("delete-quiz")) {
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
          text: "Kuis ini akan terhapus secara permanen!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, hapus!",
          cancelButtonText: "Tidak!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const quizid = e.target.getAttributeNames()[2].substring(5);
            await deleteQuiz(quizid);
            sessionStorage.setItem("status", "success");
            sessionStorage.setItem("message", "delete-quiz");
            const quizzes = document.querySelector(".isi-list").children;
            if (quizzes.length - 1 === 0 && current_page !== 1) {
              window.location.href = "/activities?page=" + (current_page - 1);
            } else {
              window.location.reload();
            }
          }
        });
    }
    // Play Quiz
    if (e.target.classList.contains("play-quiz")) {
      const quizid = e.target.getAttributeNames()[2].substring(5);
      const total_question =
        e.target.parentElement.parentElement.nextElementSibling
          .firstElementChild.innerHTML[0];
      if (Number(total_question) <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Pertanyaan belum tersedia",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        window.location.href = `/quiz/${quizid}/play`;
      }
    }
  });
});
