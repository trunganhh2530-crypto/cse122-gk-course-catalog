/* =========================================================
   StudyPath AI — JS trang Danh mục học phần (Course Catalog – Khách)
   Chức năng: render dữ liệu từ mảng, tìm kiếm, lọc, phân trang,
   trạng thái rỗng/đang tải, modal xem chi tiết học phần.
   ========================================================= */

/* ===== 1. DỮ LIỆU GIẢ LẬP (thay cho API/backend) ===== */
const COURSES = [
  { id: 1,  code: "IT1010", name: "Nhập môn lập trình",                    credits: 4, program: "Công nghệ thông tin",  year: "2023–2024", status: "Đang mở",  description: "Giới thiệu tư duy lập trình, biến, kiểu dữ liệu, câu lệnh điều kiện và vòng lặp." },
  { id: 2,  code: "IT2010", name: "Cấu trúc dữ liệu và giải thuật",        credits: 4, program: "Công nghệ thông tin",  year: "2024–2025", status: "Đang mở",  description: "Mảng, danh sách liên kết, stack, queue, cây và các giải thuật tìm kiếm, sắp xếp." },
  { id: 3,  code: "IT3090", name: "Mạng máy tính",                         credits: 4, program: "Công nghệ thông tin",  year: "2023–2024", status: "Tạm ngưng", description: "Mô hình OSI/TCP-IP, địa chỉ IP, định tuyến và các giao thức mạng cơ bản." },
  { id: 4,  code: "CS1010", name: "Toán rời rạc",                          credits: 4, program: "Khoa học máy tính",     year: "2023–2024", status: "Đang mở",  description: "Logic mệnh đề, tập hợp, quan hệ, đồ thị và tổ hợp phục vụ khoa học máy tính." },
  { id: 5,  code: "CS2010", name: "Lý thuyết đồ thị",                      credits: 3, program: "Khoa học máy tính",     year: "2024–2025", status: "Đang mở",  description: "Các khái niệm đồ thị, cây khung, đường đi ngắn nhất và bài toán luồng." },
  { id: 6,  code: "CS3010", name: "Trí tuệ nhân tạo",                      credits: 5, program: "Khoa học máy tính",     year: "2024–2025", status: "Đang mở",  description: "Tìm kiếm heuristic, hệ chuyên gia, máy học cơ bản và ứng dụng AI." },
  { id: 7,  code: "IS2010", name: "Cơ sở dữ liệu",                         credits: 4, program: "Hệ thống thông tin",    year: "2023–2024", status: "Đang mở",  description: "Mô hình dữ liệu quan hệ, SQL, thiết kế lược đồ và chuẩn hóa." },
  { id: 8,  code: "IS2020", name: "Phân tích thiết kế hệ thống thông tin", credits: 3, program: "Hệ thống thông tin",    year: "2024–2025", status: "Đang mở",  description: "Khảo sát yêu cầu, mô hình hóa nghiệp vụ, sơ đồ luồng dữ liệu và thiết kế giao diện." },
  { id: 9,  code: "IS3010", name: "Hệ thống thông tin quản lý",            credits: 3, program: "Hệ thống thông tin",    year: "2023–2024", status: "Tạm ngưng", description: "Tổng quan hệ thống ERP, quy trình nghiệp vụ và báo cáo quản trị." },
  { id: 10, code: "AT1010", name: "An toàn thông tin",                     credits: 3, program: "An toàn thông tin",     year: "2023–2024", status: "Đang mở",  description: "Các nguyên lý bảo mật, quản lý rủi ro và tiêu chuẩn an toàn thông tin." },
  { id: 11, code: "AT2010", name: "Mật mã học cơ sở",                      credits: 4, program: "An toàn thông tin",     year: "2024–2025", status: "Đang mở",  description: "Mã hóa đối xứng, bất đối xứng, hàm băm và chữ ký số." },
  { id: 12, code: "AT3010", name: "Bảo mật ứng dụng web",                  credits: 5, program: "An toàn thông tin",     year: "2024–2025", status: "Đang mở",  description: "Các lỗ hổng web phổ biến (OWASP) và kỹ thuật phòng chống trong thực tế." }
];

const PAGE_SIZE = 6;
let currentPage = 1;

/* ===== 2. LẤY CÁC PHẦN TỬ DOM ===== */
const courseGrid  = document.getElementById("courseGrid");
const resultSummary = document.getElementById("resultSummary");
const emptyState  = document.getElementById("emptyState");
const pagination  = document.getElementById("pagination");
const filterForm  = document.getElementById("filterForm");
const searchInput = document.getElementById("searchInput");
const filterProgram = document.getElementById("filterProgram");
const filterCredits = document.getElementById("filterCredits");
const filterStatus  = document.getElementById("filterStatus");
const resetFiltersBtn = document.getElementById("resetFilters");
const emptyResetBtn  = document.getElementById("emptyReset");
const courseModal = document.getElementById("courseModal");
const modalTitle  = document.getElementById("modalTitle");
const modalTag    = document.getElementById("modalTag");
const modalCode   = document.getElementById("modalCode");
const modalCredits = document.getElementById("modalCredits");
const modalProgram = document.getElementById("modalProgram");
const modalYear   = document.getElementById("modalYear");
const modalDesc   = document.getElementById("modalDesc");
const modalClose  = document.getElementById("modalClose");
const modalCancel = document.getElementById("modalCancel");

/* ===== 3. LỌC DỮ LIỆU THEO TỪ KHÓA VÀ CÁC BỘ LỌC ===== */
function getFilteredCourses() {
  const keyword = searchInput.value.trim().toLowerCase();
  const program = filterProgram.value;
  const credits = filterCredits.value;
  const status  = filterStatus.value;

  return COURSES.filter(function (course) {
    const matchesKeyword = keyword === "" ||
      course.name.toLowerCase().includes(keyword) ||
      course.code.toLowerCase().includes(keyword);
    const matchesProgram = program === "" || course.program === program;
    const matchesCredits = credits === "" || course.credits === Number(credits);
    const matchesStatus  = status === "" || course.status === status;

    return matchesKeyword && matchesProgram && matchesCredits && matchesStatus;
  });
}

/* ===== 4. RENDER LƯỚI HỌC PHẦN ===== */
function statusTagClass(status) {
  if (status === "Đang mở") {
    return "tag-green";
  }
  return "tag-amber";
}

function courseCardHTML(course) {
  return `
    <article class="course-card card">
      <div class="course-card-head">
        <h3 class="course-name">${course.name}</h3>
        <span class="tag ${statusTagClass(course.status)}">${course.status}</span>
      </div>
      <p class="course-meta text-sm text-muted">
        <span>${course.code}</span>
        <span>·</span>
        <span>${course.credits} tín chỉ</span>
        <span>·</span>
        <span>Năm học ${course.year}</span>
      </p>
      <p class="text-sm">${course.description}</p>
      <div class="course-card-foot">
        <span class="chip">${course.program}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-action="detail" data-id="${course.id}">Xem chi tiết</button>
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

/* ===== 5. PHÂN TRANG ===== */
function renderPagination(totalCount) {
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<button type="button" class="page-btn active" data-page="${i}">${i}</button>`;
    } else {
      html += `<button type="button" class="page-btn" data-page="${i}">${i}</button>`;
    }
  }
  pagination.innerHTML = html;
}

/* ===== 6. CẬP NHẬT TOÀN BỘ GIAO DIỆN ===== */
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
    resultSummary.textContent = "Không tìm thấy học phần phù hợp";
    emptyState.classList.remove("hidden");
  } else {
    resultSummary.textContent =
      `Hiển thị ${start + 1}–${start + pageCourses.length} trong ${filtered.length} học phần`;
    emptyState.classList.add("hidden");
  }
}

/* ===== 7. MODAL CHI TIẾT HỌC PHẦN ===== */
function openCourseModal(id) {
  let course = null;
  for (let i = 0; i < COURSES.length; i++) {
    if (COURSES[i].id === id) {
      course = COURSES[i];
      break;
    }
  }
  if (course === null) {
    return;
  }

  modalTitle.textContent = course.name;
  modalTag.textContent = course.status;
  modalTag.className = "tag " + statusTagClass(course.status);
  modalCode.textContent = course.code;
  modalCredits.textContent = course.credits;
  modalProgram.textContent = course.program;
  modalYear.textContent = course.year;
  modalDesc.textContent = course.description;

  courseModal.classList.remove("hidden");
}

function closeCourseModal() {
  courseModal.classList.add("hidden");
}

/* ===== 8. TRẠNG THÁI ĐANG TẢI (SKELETON) ===== */
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

/* ===== 9. GẮN SỰ KIỆN ===== */

// Form lọc: chặn gửi trang, áp dụng bộ lọc ngay
filterForm.addEventListener("submit", function (event) {
  event.preventDefault();
  currentPage = 1;
  updateView();
});

// Tìm kiếm tức thì khi người dùng gõ
searchInput.addEventListener("input", function () {
  currentPage = 1;
  updateView();
});

// Đổi bộ lọc → trở về trang 1 và render lại
filterProgram.addEventListener("change", function () {
  currentPage = 1;
  updateView();
});

filterCredits.addEventListener("change", function () {
  currentPage = 1;
  updateView();
});

filterStatus.addEventListener("change", function () {
  currentPage = 1;
  updateView();
});

// Đặt lại toàn bộ bộ lọc
function resetFiltersAndRender() {
  filterForm.reset();
  currentPage = 1;
  updateView();
}

resetFiltersBtn.addEventListener("click", resetFiltersAndRender);
emptyResetBtn.addEventListener("click", resetFiltersAndRender);

// Bấm nút "Xem chi tiết" trên thẻ (ủy quyền sự kiện trên lưới)
courseGrid.addEventListener("click", function (event) {
  const detailBtn = event.target.closest('[data-action="detail"]');
  if (detailBtn) {
    openCourseModal(Number(detailBtn.dataset.id));
  }
});

// Chuyển trang (ủy quyền sự kiện trên thanh phân trang)
pagination.addEventListener("click", function (event) {
  const pageBtn = event.target.closest("[data-page]");
  if (pageBtn) {
    currentPage = Number(pageBtn.dataset.page);
    updateView();
  }
});

// Đóng modal
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

/* ===== 10. KHỞI ĐỘNG: hiển thị skeleton rồi tải dữ liệu ===== */
showSkeleton();
setTimeout(updateView, 700);
