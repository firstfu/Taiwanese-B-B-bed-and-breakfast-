// 照片瀏覽功能
class PhotoViewer {
  constructor() {
    this.modal = document.getElementById("photo-modal");
    this.modalImg = document.getElementById("modal-img");
    this.currentPhotoIndex = 0;
    this.photos = [];

    // 綁定事件
    this.bindEvents();
  }

  bindEvents() {
    // 點擊主要照片和縮圖開啟 Modal
    document.querySelectorAll(".main-photo, .thumbnail").forEach(img => {
      img.addEventListener("click", e => this.openModal(e.target));
    });

    // 關閉 Modal
    document.querySelector(".close-modal").addEventListener("click", () => this.closeModal());

    // 上一張/下一張按鈕
    document.querySelector(".modal-prev").addEventListener("click", () => this.showPrevPhoto());
    document.querySelector(".modal-next").addEventListener("click", () => this.showNextPhoto());

    // ESC 鍵關閉 Modal
    window.addEventListener("keydown", e => {
      if (e.key === "Escape") this.closeModal();
      if (e.key === "ArrowLeft") this.showPrevPhoto();
      if (e.key === "ArrowRight") this.showNextPhoto();
    });
  }

  openModal(clickedImg) {
    const roomCard = clickedImg.closest(".room-card");
    this.photos = Array.from(roomCard.querySelectorAll(".main-photo, .thumbnail")).map(img => img.src);
    this.currentPhotoIndex = this.photos.indexOf(clickedImg.src);
    this.modalImg.src = this.photos[this.currentPhotoIndex];
    this.modal.style.display = "block";
  }

  closeModal() {
    this.modal.style.display = "none";
  }

  showPrevPhoto() {
    this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.photos.length) % this.photos.length;
    this.modalImg.src = this.photos[this.currentPhotoIndex];
  }

  showNextPhoto() {
    this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.photos.length;
    this.modalImg.src = this.photos[this.currentPhotoIndex];
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
  new PhotoViewer();
  new RoomComparison();
  new LiveUpdate();
  new BookingProcess();
});
