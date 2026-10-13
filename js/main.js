/* =========================================================
   StudyPath AI — JS trang Danh mục học phần (Course Catalog – Khách)
   Chức năng: sinh và render 128 học phần từ 6 chương trình, tìm kiếm,
   lọc (chương trình / tín chỉ / chỉ học phần đang mở), sắp xếp,
   phân trang, trạng thái đang tải (skeleton), trạng thái rỗng,
   modal xem chi tiết học phần.
   ========================================================= */

/* ===== 1. DỮ LIỆU: 6 chương trình đào tạo, mỗi chương trình gồm các học phần theo mức 1–5 ===== */
const PROGRAMS = [
  {
    name: "Công nghệ thông tin",
    prefix: "IT",
    faculty: "Khoa Công nghệ thông tin",
    levels: [
      ["Nhập môn lập trình", "Kỹ thuật lập trình", "Kiến trúc máy tính", "Hệ điều hành", "Kỹ thuật số"],
      ["Lập trình hướng đối tượng", "Lập trình web cơ bản", "Lập trình thiết bị di động", "Đồ họa máy tính"],
      ["Lập trình nâng cao", "Xử lý ảnh số", "Truyền thông dữ liệu", "Khai thác dữ liệu", "Hệ thống nhúng", "Cơ sở dữ liệu"],
      ["Hệ thống phân tán", "Thiết kế phần mềm", "Quản lý dự án CNTT", "Cấu trúc dữ liệu và giải thuật"],
      ["Điện toán đám mây", "Internet vạn vật", "Điện toán di động", "Bảo mật mạng", "Đồ án công nghệ thông tin", "Mạng máy tính"]
    ]
  },
  {
    name: "Khoa học máy tính",
    prefix: "MA",
    faculty: "Khoa Toán — Tin",
    levels: [
      ["Giải tích 1", "Giải tích 2", "Đại số tuyến tính", "Nhập môn khoa học máy tính"],
      ["Toán rời rạc", "Xác suất thống kê", "Lý thuyết đồ thị", "Tối ưu hóa"],
      ["Trí tuệ nhân tạo", "Học máy", "Logic tính toán", "Lý thuyết automata", "Độ phức tạp tính toán"],
      ["Học sâu", "Xử lý ngôn ngữ tự nhiên", "Thị giác máy tính", "Mạng nơ-ron"],
      ["Đồ án khoa học máy tính", "Chuyên đề học máy", "Hệ chuyên gia", "Kho dữ liệu"]
    ]
  },
  {
    name: "Kỹ thuật phần mềm",
    prefix: "SE",
    faculty: "Khoa Công nghệ thông tin",
    levels: [
      ["Nhập môn kỹ thuật phần mềm", "Lập trình Python", "Phân tích yêu cầu", "Kỹ năng giao tiếp"],
      ["Lập trình Java", "Thiết kế giao diện người dùng", "Quản lý cấu hình", "Kiểm thử phần mềm"],
      ["Kiểu mẫu thiết kế", "Kiến trúc phần mềm", "Tích hợp hệ thống", "Quản lý chất lượng"],
      ["DevOps cơ bản", "Tự động hóa kiểm thử", "Quản trị mã nguồn", "Triển khai phần mềm"],
      ["Đồ án kỹ thuật phần mềm", "Thực tập doanh nghiệp", "Quản trị dự án phần mềm", "Chuyên đề Agile", "Đồ án tốt nghiệp"]
    ]
  },
  {
    name: "Hệ thống thông tin",
    prefix: "IS",
    faculty: "Khoa Hệ thống thông tin",
    levels: [
      ["Nhập môn hệ thống thông tin", "Tin học văn phòng", "Kinh tế học vi mô", "Quản trị học"],
      ["Cơ sở dữ liệu quản trị", "Hệ thống thông tin quản lý", "Phân tích thiết kế HTTT", "Kế toán quản trị"],
      ["Hệ quản trị cơ sở dữ liệu", "Kho dữ liệu", "Trí tuệ kinh doanh", "Mạng doanh nghiệp"],
      ["Hệ thống ERP", "Quản trị quy trình nghiệp vụ", "An toàn hệ thống thông tin", "Phân tích dữ liệu"],
      ["Đồ án hệ thống thông tin", "Chuyên đề chuyển đổi số", "Quản trị dự án CNTT", "Kiến trúc doanh nghiệp", "Đồ án tốt nghiệp"]
    ]
  },
  {
    name: "An toàn thông tin",
    prefix: "AT",
    faculty: "Khoa An toàn thông tin",
    levels: [
      ["Nhập môn an toàn thông tin", "Tin học pháp lý", "Mật mã sơ cấp", "Quản lý rủi ro"],
      ["Mật mã học ứng dụng", "An toàn hệ điều hành", "An toàn web", "Điều tra số"],
      ["An toàn mạng", "Kỹ thuật kiểm tra xâm nhập", "Phân tích mã độc", "Bảo mật đám mây"],
      ["Giám sát an ninh", "Khôi phục sự cố", "An toàn ứng dụng di động", "Pháp chế an ninh mạng"],
      ["Đồ án an toàn thông tin", "Chuyên đề phòng chống tấn công", "Quản trị an toàn thông tin", "Thực tập an ninh mạng"]
    ]
  },
  {
    name: "Khoa học dữ liệu",
    prefix: "DA",
    faculty: "Khoa Khoa học dữ liệu & AI",
    levels: [
      ["Nhập môn khoa học dữ liệu", "Lập trình R", "Thống kê mô tả", "Thu thập dữ liệu"],
      ["Làm sạch dữ liệu", "Trực quan hóa dữ liệu", "Học máy cơ sở", "Xác suất cho dữ liệu"],
      ["Khai phá dữ liệu", "Học sâu cơ sở", "Dữ liệu lớn", "Xử lý ngôn ngữ tự nhiên ứng dụng"],
      ["Hệ thống khuyến nghị", "Dữ liệu chuỗi thời gian", "Thực nghiệm A/B", "Kỹ thuật đặc trưng"],
      ["Đồ án khoa học dữ liệu", "Chuyên đề trí tuệ nhân tạo", "Triển khai mô hình", "Đạo đức dữ liệu"]
    ]
  }
];

/* Một số học phần được đánh dấu "Tạm ngưng" để trình diễn bộ lọc trạng thái */
const PAUSED_CODES = new Set([
  "IT5060", "IT3030", "MA4010", "SE5010", "IS3010", "AT3010", "DA2010", "IS5020"
]);

/* Chu kỳ tín chỉ: lặp lại 4, 4, 3, 3, 5 cho từng học phần trong chương trình */
const CREDIT_PATTERN = [4, 4, 3, 3, 5];

/* ===== 2. SINH DANH SÁCH 128 HỌC PHẦN TỪ DỮ LIỆU TRÊN ===== */
const COURSES = [];
let courseId = 0;

PROGRAMS.forEach(function (program) {
  let flatIndex = 0;
  let prevCode = "";

  program.levels.forEach(function (names, levelIndex) {
    names.forEach(function (name, k) {
      flatIndex++;
      courseId++;

      /* Mã học phần: TIỀN TỐ + MỨC + SỐ THỨ TỰ + "0", ví dụ IT1010, MA2010 */
      const code = program.prefix + (levelIndex + 1) + String(k + 1).padStart(2, "0") + "0";

      /* Tiên quyết: học phần liền trước trong chương trình;
         từ học phần thứ hai của mỗi mức thì thêm Toán rời rạc (MA2010),
         riêng chương trình Toán — Tin thì không tự thêm chính nó */
      const prereqs = [];
      if (prevCode !== "") {
        prereqs.push(prevCode);
        if (k >= 1 && program.prefix !== "MA") {
          prereqs.push("MA2010");
        }
      }

      const status = PAUSED_CODES.has(code) ? "Tạm ngưng" : "Đang mở";

      COURSES.push({
        id: courseId,
        code: code,
        name: name,
        credits: CREDIT_PATTERN[(flatIndex - 1) % CREDIT_PATTERN.length],
        prereqs: prereqs,
        program: program.name,
        faculty: program.faculty,
        status: status,
        description: "Học phần " + name + " (" + code + ") do " + program.faculty +
          " phụ trách, thuộc chương trình " + program.name + "."
      });

      prevCode = code;
    });
  });
});

const PAGE_SIZE = 6;
let currentPage = 1;

/* ===== 3. LẤY CÁC PHẦN TỬ DOM ===== */
const subtitleEl  = document.getElementById("courseSubtitle");
const summaryEl   = document.getElementById("resultSummary");
const courseGrid  = document.getElementById("courseGrid");
const emptyState  = document.getElementById("emptyState");
const pagination  = document.getElementById("pagination");
const filterForm  = document.getElementById("filterForm");
const searchInput = document.getElementById("searchInput");
const programSelect = document.getElementById("filterProgram");
const creditsSelect = document.getElementById("filterCredits");
const openOnlyCheckbox = document.getElementById("openOnly");
const sortSelect = document.getElementById("sortSelect");
const resetFiltersBtn = document.getElementById("resetFilters");
const emptyResetBtn   = document.getElementById("emptyReset");
const courseModal = document.getElementById("courseModal");
const modalTitle  = document.getElementById("modalTitle");
const modalTag    = document.getElementById("modalTag");
const modalCode   = document.getElementById("modalCode");
const modalCredits = document.getElementById("modalCredits");
const modalProgram = document.getElementById("modalProgram");
const modalFaculty = document.getElementById("modalFaculty");
const modalPrereqs = document.getElementById("modalPrereqs");
const modalStatus  = document.getElementById("modalStatus");
const modalDesc   = document.getElementById("modalDesc");
const modalClose  = document.getElementById("modalClose");
const modalCancel = document.getElementById("modalCancel");

/* ===== 4. LỌC + SẮP XẾP ===== */
const SORTERS = {
  code: function (a, b) { return a.code.localeCompare(b.code); },
  name: function (a, b) { return a.name.localeCompare(b.name, "vi"); },
  credits: function (a, b) { return a.credits - b.credits || a.code.localeCompare(b.code); }
};

function getFilteredCourses() {
  const keyword = searchInput.value.trim().toLowerCase();
  const program = programSelect.value;
  const credits = creditsSelect.value;
  const openOnly = openOnlyCheckbox.checked;
  const sorter = SORTERS[sortSelect.value] || SORTERS.code;

  const result = COURSES.filter(function (course) {
    const matchesKeyword = keyword === "" ||
      course.name.toLowerCase().includes(keyword) ||
      course.code.toLowerCase().includes(keyword);
    const matchesProgram = program === "" || course.program === program;
    const matchesCredits = credits === "" || course.credits === Number(credits);
    const matchesStatus  = !openOnly || course.status === "Đang mở";

    return matchesKeyword && matchesProgram && matchesCredits && matchesStatus;
  });

  return result.sort(sorter);
}

/* ===== 5. RENDER LƯỚI HỌC PHẦN ===== */
function courseCardHTML(course) {
  const prereqText = course.prereqs.length > 0 ? course.prereqs.join(", ") : "Không";
  const statusClass = course.status === "Đang mở" ? "status-open" : "status-paused";

  return `
    <article class="course-card card">
      <div class="course-card-top">
        <span class="course-code">${course.code}</span>
        <span class="course-status ${statusClass}"><span class="status-dot"></span>${course.status}</span>
      </div>
      <h3 class="course-name">${course.name}</h3>
      <ul class="course-meta text-sm text-muted">
        <li>${course.credits} tín chỉ</li>
        <li>Tiên quyết: ${prereqText}</li>
        <li>${course.faculty}</li>
      </ul>
      <div class="course-card-foot">
        <button type="button" class="card-link" data-action="detail" data-id="${course.id}">Xem chi tiết →</button>
      </div>
    </article>`;
}

function renderGrid(list) {
  if (list.length === 0) {
    courseGrid.innerHTML = "";
    return;
  }
  courseGrid.innerHTML = list.map(courseCardHTML).join("");
}

/* ===== 6. PHÂN TRANG (‹ 1 2 3 … N ›) ===== */
function pageList(current, total) {
  const items = [];
  for (let i = 1; i <= total; i++) {
    /* Luôn giữ trang đầu, trang cuối và các trang lân cận trang hiện tại */
    if (i === 1 || i === total || Math.abs(i - current) <= 1) {
      items.push(i);
    }
  }

  /* Chèn dấu "…" vào các khoảng bị bỏ qua */
  const result = [];
  let prev = 0;
  items.forEach(function (p) {
    if (p - prev > 1) {
      result.push("…");
    }
    result.push(p);
    prev = p;
  });
  return result;
}

function renderPagination(totalCount) {
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = `<button type="button" class="page-btn" data-page="prev" ${currentPage === 1 ? "disabled" : ""}>&lsaquo;</button>`;
  pageList(currentPage, totalPages).forEach(function (item) {
    if (item === "…") {
      html += `<span class="page-ellipsis">…</span>`;
    } else if (item === currentPage) {
      html += `<button type="button" class="page-btn active" data-page="${item}">${item}</button>`;
    } else {
      html += `<button type="button" class="page-btn" data-page="${item}">${item}</button>`;
    }
  });
  html += `<button type="button" class="page-btn" data-page="next" ${currentPage === totalPages ? "disabled" : ""}>&rsaquo;</button>`;

  pagination.innerHTML = html;
}

/* ===== 7. CẬP NHẬT TOÀN BỘ GIAO DIỆN ===== */
function updateView() {
  const filtered = getFilteredCourses();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageCourses = filtered.slice(start, start + PAGE_SIZE);

  renderGrid(pageCourses);
  renderPagination(filtered.length);

  if (filtered.length === 0) {
    summaryEl.textContent = "Không tìm thấy học phần phù hợp";
    emptyState.classList.remove("hidden");
  } else {
    summaryEl.textContent =
      "Hiển thị " + (start + 1) + "–" + (start + pageCourses.length) + " trong " + filtered.length + " học phần";
    emptyState.classList.add("hidden");
  }
}

/* ===== 8. MODAL CHI TIẾT HỌC PHẦN ===== */
function findCourseById(id) {
  for (let i = 0; i < COURSES.length; i++) {
    if (COURSES[i].id === id) {
      return COURSES[i];
    }
  }
  return null;
}

function openCourseModal(id) {
  const course = findCourseById(id);
  if (course === null) {
    return;
  }

  modalTitle.textContent = course.name;
  modalTag.textContent = course.status;
  modalTag.className = "tag " + (course.status === "Đang mở" ? "tag-green" : "tag-amber");
  modalCode.textContent = course.code;
  modalCredits.textContent = course.credits;
  modalProgram.textContent = course.program;
  modalFaculty.textContent = course.faculty;
  modalPrereqs.textContent = course.prereqs.length > 0 ? course.prereqs.join(", ") : "Không";
  modalStatus.textContent = course.status;
  modalDesc.textContent = course.description;

  courseModal.classList.remove("hidden");
}

function closeCourseModal() {
  courseModal.classList.add("hidden");
}

/* ===== 9. TRẠNG THÁI ĐANG TẢI (SKELETON) ===== */
function showSkeleton() {
  let html = "";
  for (let i = 0; i < PAGE_SIZE; i++) {
    html += `
      <article class="card skeleton-card" aria-hidden="true">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-chip"></div>
      </article>`;
  }
  courseGrid.innerHTML = html;
}

/* ===== 10. GẮN SỰ KIỆN ===== */

/* Nút "Lọc": chặn gửi trang, áp bộ lọc (tìm kiếm đã áp tức thì sẵn) */
filterForm.addEventListener("submit", function (event) {
  event.preventDefault();
  currentPage = 1;
  updateView();
});

/* Tìm kiếm tức thì khi người dùng gõ */
searchInput.addEventListener("input", function () {
  currentPage = 1;
  updateView();
});

/* Đổi bộ lọc hoặc kiểu sắp xếp → trở về trang 1 và render lại */
programSelect.addEventListener("change", function () {
  currentPage = 1;
  updateView();
});

creditsSelect.addEventListener("change", function () {
  currentPage = 1;
  updateView();
});

openOnlyCheckbox.addEventListener("change", function () {
  currentPage = 1;
  updateView();
});

sortSelect.addEventListener("change", function () {
  currentPage = 1;
  updateView();
});

/* Đặt lại toàn bộ bộ lọc về mặc định (checkbox giữ trạng thái checked như thiết kế) */
function resetFiltersAndRender() {
  filterForm.reset();
  currentPage = 1;
  updateView();
}

resetFiltersBtn.addEventListener("click", resetFiltersAndRender);
emptyResetBtn.addEventListener("click", resetFiltersAndRender);

/* Bấm "Xem chi tiết" trên thẻ (ủy quyền sự kiện trên lưới) */
courseGrid.addEventListener("click", function (event) {
  const detailBtn = event.target.closest('[data-action="detail"]');
  if (detailBtn) {
    openCourseModal(Number(detailBtn.dataset.id));
  }
});

/* Chuyển trang: số trang hoặc nút ‹ › (ủy quyền sự kiện trên thanh phân trang) */
pagination.addEventListener("click", function (event) {
  const pageBtn = event.target.closest("[data-page]");
  if (!pageBtn || pageBtn.disabled) {
    return;
  }

  const target = pageBtn.dataset.page;
  if (target === "prev") {
    currentPage = Math.max(1, currentPage - 1);
  } else if (target === "next") {
    currentPage = currentPage + 1;
  } else {
    currentPage = Number(target);
  }
  updateView();
});

/* Đóng modal: nút, bấm nền hoặc phím Esc */
modalClose.addEventListener("click", closeCourseModal);
modalCancel.addEventListener("click", closeCourseModal);
courseModal.addEventListener("click", function (event) {
  if (event.target === courseModal) {
    closeCourseModal();
  }
});
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeCourseModal();
  }
});

/* ===== 11. KHỞI ĐỘNG ===== */

/* Điền danh sách chương trình vào bộ lọc từ dữ liệu */
(function renderProgramOptions() {
  let html = "";
  PROGRAMS.forEach(function (program) {
    html += `<option value="${program.name}">${program.name}</option>`;
  });
  programSelect.innerHTML = programSelect.innerHTML + html;
})();

/* Dòng phụ đề dưới tiêu đề: tổng số học phần và số chương trình */
subtitleEl.textContent = COURSES.length + " học phần · " + PROGRAMS.length + " chương trình đào tạo";

/* Hiển thị skeleton rồi "tải" dữ liệu (giả lập thời gian tải) */
showSkeleton();
setTimeout(updateView, 700);
