// ---------------- AUTHENTICATION ----------------
function checkAuth(requiredRole) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser || loggedInUser.role !== requiredRole) {
    alert("Access Denied! Please login again.");
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// ---------------- NOTICE MANAGEMENT ----------------
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("noticeForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;
      const photoFile = document.getElementById("photo").files[0];
      const pdfFile = document.getElementById("pdf").files[0];

      let notice = { title, content, photo: null, pdf: null };

      // ✅ Support both image + PDF
      if (photoFile) {
        const reader = new FileReader();
        reader.onload = function () {
          notice.photo = reader.result;
          saveNotice(notice);
        };
        reader.readAsDataURL(photoFile);
      } else if (pdfFile) {
        const reader = new FileReader();
        reader.onload = function () {
          notice.pdf = reader.result;
          saveNotice(notice);
        };
        reader.readAsDataURL(pdfFile);
      } else {
        saveNotice(notice);
      }
    });
  }
});

function saveNotice(notice) {
  let notices = JSON.parse(localStorage.getItem("notices")) || [];
  notices.push(notice);
  localStorage.setItem("notices", JSON.stringify(notices));

  document.getElementById("noticeForm").reset();
  loadNotices();
}

function loadNotices() {
  const board = document.getElementById("noticeBoard");
  if (!board) return;

  board.innerHTML = "";
  let notices = JSON.parse(localStorage.getItem("notices")) || [];

  notices.forEach((n) => {
    const div = document.createElement("div");
    div.className = "notice";

    div.innerHTML = `<h3>${n.title}</h3><p>${n.content}</p>`;

    if (n.photo) {
      const img = document.createElement("img");
      img.src = n.photo;
      img.style.maxWidth = "200px";
      div.appendChild(img);
    }

    if (n.pdf) {
      const link = document.createElement("a");
      link.href = n.pdf;
      link.target = "_blank";
      link.textContent = "📄 View PDF";
      div.appendChild(link);
    }

    board.appendChild(div);
  });
}

