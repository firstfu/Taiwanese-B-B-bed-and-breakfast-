// 房間輪播功能
class RoomCarousel {
  constructor(carouselElement) {
    this.carousel = carouselElement;
    this.track = this.carousel.querySelector(".carousel-track");
    this.slides = Array.from(this.track.querySelectorAll(".carousel-slide"));
    this.dotsContainer = this.carousel.querySelector(".carousel-dots");
    this.nextButton = this.carousel.querySelector(".next");
    this.prevButton = this.carousel.querySelector(".prev");

    this.currentSlide = 0;
    this.slideCount = this.slides.length;
    this.autoplayInterval = null;

    this.initializeCarousel();
    this.bindEvents();
    this.startAutoplay();
  }

  initializeCarousel() {
    // 設定輪播軌道寬度
    this.track.style.width = `${this.slideCount * 100}%`;
    this.slides.forEach(slide => {
      slide.style.width = `${100 / this.slideCount}%`;
    });

    // 創建導航點
    this.slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot");
      if (index === 0) dot.classList.add("active");
      this.dotsContainer.appendChild(dot);
    });
  }

  bindEvents() {
    this.nextButton.addEventListener("click", () => {
      this.stopAutoplay();
      this.nextSlide();
      this.startAutoplay();
    });

    this.prevButton.addEventListener("click", () => {
      this.stopAutoplay();
      this.prevSlide();
      this.startAutoplay();
    });

    this.dotsContainer.addEventListener("click", e => {
      if (!e.target.matches(".carousel-dot")) return;

      const dotIndex = Array.from(this.dotsContainer.children).indexOf(e.target);
      this.stopAutoplay();
      this.goToSlide(dotIndex);
      this.startAutoplay();
    });

    // 滑鼠懸停時暫停自動播放
    this.carousel.addEventListener("mouseenter", () => this.stopAutoplay());
    this.carousel.addEventListener("mouseleave", () => this.startAutoplay());

    // 點擊圖片開啟 Modal
    this.slides.forEach(slide => {
      slide.addEventListener("click", () => this.openModal(slide));
    });
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slideCount;
    this.updateCarousel();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
    this.updateCarousel();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateCarousel();
  }

  updateCarousel() {
    // 更新輪播軌道位置
    this.track.style.transform = `translateX(-${this.currentSlide * (100 / this.slideCount)}%)`;

    // 更新導航點狀態
    const dots = this.dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentSlide);
    });
  }

  startAutoplay() {
    if (this.autoplayInterval) return;
    this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  openModal(clickedImg) {
    const modal = document.getElementById("photo-modal");
    const modalImg = document.getElementById("modal-img");
    modalImg.src = clickedImg.src;
    modal.style.display = "block";

    // 在 Modal 中設置當前圖片索引
    modal.dataset.currentIndex = this.slides.indexOf(clickedImg);
    modal.dataset.carouselId = this.carousel.id;
  }
}

// Modal 視窗控制
class ModalController {
  constructor() {
    this.modal = document.getElementById("photo-modal");
    this.modalImg = document.getElementById("modal-img");

    this.bindEvents();
  }

  bindEvents() {
    // 關閉按鈕
    document.querySelector(".close-modal").addEventListener("click", () => this.closeModal());

    // Modal 的上一張/下一張按鈕
    document.querySelector(".modal-prev").addEventListener("click", () => this.showPrevPhoto());
    document.querySelector(".modal-next").addEventListener("click", () => this.showNextPhoto());

    // 鍵盤控制
    window.addEventListener("keydown", e => {
      if (!this.modal.style.display || this.modal.style.display === "none") return;

      if (e.key === "Escape") this.closeModal();
      if (e.key === "ArrowLeft") this.showPrevPhoto();
      if (e.key === "ArrowRight") this.showNextPhoto();
    });
  }

  closeModal() {
    this.modal.style.display = "none";
  }

  getCurrentCarousel() {
    const carouselId = this.modal.dataset.carouselId;
    return document.getElementById(carouselId);
  }

  showPrevPhoto() {
    const carousel = this.getCurrentCarousel();
    const slides = carousel.querySelectorAll(".carousel-slide");
    let currentIndex = parseInt(this.modal.dataset.currentIndex);

    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    this.modalImg.src = slides[currentIndex].src;
    this.modal.dataset.currentIndex = currentIndex;
  }

  showNextPhoto() {
    const carousel = this.getCurrentCarousel();
    const slides = carousel.querySelectorAll(".carousel-slide");
    let currentIndex = parseInt(this.modal.dataset.currentIndex);

    currentIndex = (currentIndex + 1) % slides.length;
    this.modalImg.src = slides[currentIndex].src;
    this.modal.dataset.currentIndex = currentIndex;
  }
}

// 房型比較功能
class RoomComparison {
  constructor() {
    this.comparisonSection = document.getElementById("room-comparison");
    this.comparisonTable = document.getElementById("comparison-table");
    this.selectedRooms = new Set();

    this.bindEvents();
  }

  bindEvents() {
    document.querySelectorAll(".compare-btn").forEach(btn => {
      btn.addEventListener("click", () => this.toggleRoomComparison(btn));
    });
  }

  toggleRoomComparison(btn) {
    const roomCard = btn.closest(".room-card");
    const roomId = btn.dataset.room;

    if (this.selectedRooms.has(roomId)) {
      this.selectedRooms.delete(roomId);
      btn.textContent = "加入比較";
      btn.classList.remove("active");
    } else {
      if (this.selectedRooms.size >= 3) {
        alert("最多只能同時比較3個房型");
        return;
      }
      this.selectedRooms.add(roomId);
      btn.textContent = "取消比較";
      btn.classList.add("active");
    }

    this.updateComparisonTable();
  }

  updateComparisonTable() {
    if (this.selectedRooms.size === 0) {
      this.comparisonSection.classList.add("hidden");
      return;
    }

    this.comparisonSection.classList.remove("hidden");
    const tbody = this.comparisonTable.querySelector("tbody");
    tbody.innerHTML = "";

    const selectedRoomCards = Array.from(this.selectedRooms).map(roomId => document.querySelector(`[data-room="${roomId}"]`).closest(".room-card"));

    selectedRoomCards.forEach(card => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${card.querySelector("h2").textContent}</td>
        <td>${card.querySelector(".room-features span:nth-child(3)").textContent}</td>
        <td>${card.querySelector(".room-features span:nth-child(2)").textContent}</td>
        <td>${card.querySelector(".price .amount").textContent}</td>
        <td>${Array.from(card.querySelectorAll(".room-amenities li"))
          .map(li => li.textContent)
          .join("、")}</td>
      `;
      tbody.appendChild(row);
    });
  }
}

// 即時更新功能
class LiveUpdate {
  constructor() {
    this.initializeUpdates();
  }

  initializeUpdates() {
    // 模擬即時更新價格和空房狀態
    setInterval(() => {
      document.querySelectorAll(".room-card").forEach(card => {
        // 隨機更新價格（示範用）
        const price = card.querySelector(".amount");
        const currentPrice = parseInt(price.textContent.replace(/[^\d]/g, ""));
        const variation = Math.floor(Math.random() * 200) - 100;
        price.textContent = `NT$ ${(currentPrice + variation).toLocaleString()}`;

        // 隨機更新空房狀態（示範用）
        const availability = card.querySelector(".availability");
        const isAvailable = Math.random() > 0.3;
        availability.textContent = isAvailable ? "目前尚有空房" : "今日客滿";
        availability.style.color = isAvailable ? "#27ae60" : "#e74c3c";
      });
    }, 30000); // 每30秒更新一次
  }
}

// 訂房流程功能
class BookingProcess {
  constructor() {
    this.bindEvents();
  }

  bindEvents() {
    document.querySelectorAll(".book-btn").forEach(btn => {
      btn.addEventListener("click", e => this.startBooking(e));
    });
  }

  startBooking(e) {
    const roomCard = e.target.closest(".room-card");
    const roomName = roomCard.querySelector("h2").textContent;
    const price = roomCard.querySelector(".price .amount").textContent;

    // 儲存選擇的房型資訊到 sessionStorage
    sessionStorage.setItem(
      "selectedRoom",
      JSON.stringify({
        name: roomName,
        price: price,
      })
    );

    // 導向訂房頁面
    window.location.href = "booking.html";
  }
}

// 初始化所有功能
document.addEventListener("DOMContentLoaded", () => {
  // 初始化每個輪播
  document.querySelectorAll(".room-carousel").forEach((carousel, index) => {
    carousel.id = `carousel-${index}`;
    new RoomCarousel(carousel);
  });

  // 初始化其他功能
  new ModalController();
  new RoomComparison();
  new LiveUpdate();
  new BookingProcess();
});
