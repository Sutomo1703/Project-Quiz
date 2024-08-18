async function login(data) {
  const response = await fetch("http://127.0.0.1:5000/api/users/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await response.json();
}

document.addEventListener("submit", async function (e) {
  e.preventDefault();
  let nrp = document.getElementById("nrp");
  let password = document.getElementById("password");
  let data = {
    nrp: nrp.value,
    password: password.value,
    remember: true,
  };
  const response = await login(data);
  const status_code = response.payload.status_code;
  const message = response.payload.message;
  const next = response.payload.next;
  Swal.fire({
    icon: status_code === 200 ? "success" : "error",
    title: message,
    showConfirmButton: false,
    timer: 1500,
  }).then(() => {
    if (status_code === 200) {
      window.location.reload();
    }
  });
});
