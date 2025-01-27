// 漢堡選單功能
document.addEventListener("DOMContentLoaded", function () {
  // 漢堡選單切換
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      // 切換漢堡選單動畫
      this.classList.toggle("active");
    });
  }

  // 動態載入熱門房型
  const roomGrid = document.querySelector(".room-grid");
  if (roomGrid) {
    loadFeaturedRooms();
  }

  // 動態載入旅客評價
  const testimonialSlider = document.querySelector(".testimonial-slider");
  if (testimonialSlider) {
    loadTestimonials();
  }
});

// 熱門房型資料
const featuredRooms = [
  {
    name: "豪華雙人房",
    image: "images/deluxe-double.jpg",
    price: "NT$ 6,800",
    description: "享受寧靜山景的豪華住宿體驗",
  },
  {
    name: "豪華四人房",
    image: "images/family-suite.jpg",
    price: "NT$ 9,800",
    description: "適合家庭入住的寬敞套房",
  },
  {
    name: "總統套房",
    image: "images/presidential-suite.jpg",
    price: "NT$ 28,800",
    description: "尊榮享受，頂級服務",
  },
];

// 載入熱門房型
function loadFeaturedRooms() {
  const roomGrid = document.querySelector(".room-grid");
  featuredRooms.forEach(room => {
    const roomCard = document.createElement("div");
    roomCard.className = "room-card";
    roomCard.innerHTML = `
            <img src="${room.image}" alt="${room.name}" loading="lazy">
            <div class="room-info">
                <h3>${room.name}</h3>
                <p>${room.description}</p>
                <div class="room-price">${room.price} / 晚</div>
                <a href="rooms.html" class="room-button">查看詳情</a>
            </div>
        `;
    roomGrid.appendChild(roomCard);
  });
}

// 旅客評價資料
const testimonials = [
  {
    name: "張小姐",
    date: "2024/12",
    content: "環境優美，服務親切，是放鬆身心的好地方！",
    rating: 5,
  },
  {
    name: "王先生",
    date: "2024/11",
    content: "房間乾淨舒適，景觀絕佳，值得再次造訪。",
    rating: 5,
  },
  {
    name: "李小姐",
    date: "2024/10",
    content: "服務人員非常貼心，設施完善，推薦給大家！",
    rating: 5,
  },
];

// 載入旅客評價
function loadTestimonials() {
  const slider = document.querySelector(".testimonial-slider");
  testimonials.forEach(testimonial => {
    const testimonialCard = document.createElement("div");
    testimonialCard.className = "testimonial-card";
    testimonialCard.innerHTML = `
            <div class="testimonial-content">
                <p>${testimonial.content}</p>
                <div class="rating">
                    ${"★".repeat(testimonial.rating)}
                </div>
                <div class="testimonial-info">
                    <span class="name">${testimonial.name}</span>
                    <span class="date">${testimonial.date}</span>
                </div>
            </div>
        `;
    slider.appendChild(testimonialCard);
  });
}

// 平滑滾動功能
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});
