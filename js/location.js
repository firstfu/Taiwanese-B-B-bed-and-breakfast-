// DOM 元素載入完成後執行
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  setupAttractionCards();
  setupTransportCards();
  initScrollAnimation();
});

// 初始化地圖相關功能
function initMap() {
  const mapWrapper = document.querySelector(".map-wrapper");
  if (!mapWrapper) return;

  // 點擊地圖時在新視窗開啟完整地圖
  mapWrapper.addEventListener("click", () => {
    const iframe = mapWrapper.querySelector("iframe");
    if (iframe) {
      const mapUrl = iframe.src;
      window.open(mapUrl, "_blank");
    }
  });

  // 添加地圖互動提示
  const interactionHint = document.createElement("div");
  interactionHint.className = "map-interaction-hint";
  interactionHint.textContent = "點擊開啟完整地圖";
  mapWrapper.appendChild(interactionHint);
}

// 設置景點卡片效果
function setupAttractionCards() {
  const cards = document.querySelectorAll(".attraction-card");

  cards.forEach(card => {
    // 滑鼠進入效果
    card.addEventListener("mouseenter", () => {
      card.classList.add("hover");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("hover");
    });

    // 圖片載入失敗時的處理
    const img = card.querySelector("img");
    if (img) {
      img.onerror = () => {
        img.src = "images/placeholder.jpg";
      };
    }

    // 點擊卡片時顯示詳細資訊
    card.addEventListener("click", () => {
      const title = card.querySelector("h3").textContent;
      const description = card.querySelector("p:not(.distance)").textContent;
      showAttractionDetail(title, description, img.src);
    });
  });
}

// 顯示景點詳細資訊
function showAttractionDetail(title, description, imageSrc) {
  const modal = document.createElement("div");
  modal.className = "attraction-modal";

  modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="${imageSrc}" alt="${title}">
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="attraction-actions">
                <button class="action-btn" onclick="window.open('https://www.google.com/maps/search/${encodeURIComponent(title)}', '_blank')">
                    在地圖中查看
                </button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // 關閉按鈕功能
  const closeBtn = modal.querySelector(".close-modal");
  closeBtn.onclick = () => modal.remove();

  // 點擊模態框外部關閉
  modal.onclick = e => {
    if (e.target === modal) modal.remove();
  };

  // 顯示動畫
  setTimeout(() => modal.classList.add("show"), 10);
}

// 設置交通方式卡片效果
function setupTransportCards() {
  const cards = document.querySelectorAll(".transport-card");

  cards.forEach(card => {
    // 添加懸停效果
    card.addEventListener("mouseenter", () => {
      card.classList.add("hover");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("hover");
    });

    // 點擊顯示更多資訊
    card.addEventListener("click", () => {
      const type = card.querySelector("h3").textContent;
      const content = card.querySelector(".transport-content").innerHTML;
      showTransportDetail(type, content);
    });
  });
}

// 顯示交通方式詳細資訊
function showTransportDetail(type, content) {
  const modal = document.createElement("div");
  modal.className = "transport-modal";

  modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>${type}</h3>
            <div class="transport-detail">
                ${content}
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // 關閉按鈕功能
  const closeBtn = modal.querySelector(".close-modal");
  closeBtn.onclick = () => modal.remove();

  // 點擊模態框外部關閉
  modal.onclick = e => {
    if (e.target === modal) modal.remove();
  };

  // 顯示動畫
  setTimeout(() => modal.classList.add("show"), 10);
}

// 初始化滾動動畫
function initScrollAnimation() {
  const elements = document.querySelectorAll(".transport-card, .attraction-card");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  elements.forEach(element => {
    element.classList.add("fade-in-hidden");
    observer.observe(element);
  });
}

// 輔助功能：計算兩點之間的距離
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球半徑（公里）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

// 更新景點距離資訊
function updateDistances(userLat, userLon) {
  const cards = document.querySelectorAll(".attraction-card");

  cards.forEach(card => {
    const distance = card.getAttribute("data-distance");
    if (distance) {
      const [lat, lon] = distance.split(",");
      const distanceKm = calculateDistance(userLat, userLon, lat, lon);
      const distanceText = card.querySelector(".distance");
      if (distanceText) {
        distanceText.textContent = `距離：${distanceKm}公里`;
      }
    }
  });
}

// 處理地理位置錯誤
function handleLocationError(error) {
  console.error("無法獲取位置資訊:", error);
}

// 如果瀏覽器支援，獲取用戶位置
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    updateDistances(latitude, longitude);
  }, handleLocationError);
}
