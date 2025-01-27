// 房型價格配置
const ROOM_PRICES = {
  mountain: 3800, // 山景豪華雙人房
  family: 4500, // 溫馨家庭套房
  single: 2800, // 精緻單人房
};

// 房型名稱對照
const ROOM_NAMES = {
  mountain: "山景豪華雙人房",
  family: "溫馨家庭套房",
  single: "精緻單人房",
};

// DOM 元素
const bookingForm = document.getElementById("bookingForm");
const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const roomOptions = document.getElementsByName("roomType");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");

// 明細顯示元素
const summaryCheckIn = document.getElementById("summaryCheckIn");
const summaryCheckOut = document.getElementById("summaryCheckOut");
const summaryNights = document.getElementById("summaryNights");
const summaryRoom = document.getElementById("summaryRoom");
const summaryPrice = document.getElementById("summaryPrice");
const summaryTotal = document.getElementById("summaryTotal");

// 初始化日期選擇器
function initializeDatePickers() {
  // 獲取今天的日期
  const today = new Date();

  // 入住日期選擇器
  flatpickr(checkInInput, {
    locale: "zh_tw",
    dateFormat: "Y/m/d",
    minDate: today,
    onChange: function (selectedDates) {
      // 更新退房日期選擇器的最小日期
      checkOutPicker.set("minDate", selectedDates[0]);
      updateBookingSummary();
    },
  });

  // 退房日期選擇器
  const checkOutPicker = flatpickr(checkOutInput, {
    locale: "zh_tw",
    dateFormat: "Y/m/d",
    minDate: today,
    onChange: function () {
      updateBookingSummary();
    },
  });
}

// 計算住宿天數
function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const oneDay = 24 * 60 * 60 * 1000;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  return Math.round((checkOutDate - checkInDate) / oneDay);
}

// 更新訂房明細
function updateBookingSummary() {
  const checkIn = checkInInput.value;
  const checkOut = checkOutInput.value;
  const selectedRoom = Array.from(roomOptions).find(radio => radio.checked);

  // 更新入住和退房日期
  summaryCheckIn.textContent = checkIn || "-";
  summaryCheckOut.textContent = checkOut || "-";

  // 計算並更新住宿天數
  const nights = calculateNights(checkIn, checkOut);
  summaryNights.textContent = nights ? `${nights}晚` : "-";

  // 更新房型和價格資訊
  if (selectedRoom) {
    const roomType = selectedRoom.value;
    const pricePerNight = ROOM_PRICES[roomType];
    summaryRoom.textContent = ROOM_NAMES[roomType];
    summaryPrice.textContent = `NT$ ${pricePerNight.toLocaleString()}`;
    summaryTotal.textContent = nights ? `NT$ ${(pricePerNight * nights).toLocaleString()}` : "-";
  } else {
    summaryRoom.textContent = "-";
    summaryPrice.textContent = "-";
    summaryTotal.textContent = "-";
  }
}

// 表單驗證
function validateForm() {
  let isValid = true;
  const errorMessages = [];

  // 清除之前的錯誤提示
  document.querySelectorAll(".error-message").forEach(el => el.remove());
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

  // 驗證入住日期
  if (!checkInInput.value) {
    showError(checkInInput, "請選擇入住日期");
    isValid = false;
  }

  // 驗證退房日期
  if (!checkOutInput.value) {
    showError(checkOutInput, "請選擇退房日期");
    isValid = false;
  }

  // 驗證是否選擇房型
  if (!Array.from(roomOptions).some(radio => radio.checked)) {
    showError(roomOptions[0].parentElement, "請選擇房型");
    isValid = false;
  }

  // 驗證姓名
  if (!nameInput.value.trim()) {
    showError(nameInput, "請輸入姓名");
    isValid = false;
  }

  // 驗證電話
  const phonePattern = /^[0-9]{8,10}$/;
  if (!phonePattern.test(phoneInput.value.trim())) {
    showError(phoneInput, "請輸入有效的電話號碼");
    isValid = false;
  }

  // 驗證 Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value.trim())) {
    showError(emailInput, "請輸入有效的 Email 地址");
    isValid = false;
  }

  return isValid;
}

// 顯示錯誤訊息
function showError(element, message) {
  element.classList.add("input-error");
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  element.parentNode.appendChild(errorDiv);
}

// 處理表單提交
async function handleSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const submitButton = document.querySelector(".submit-booking");
  submitButton.classList.add("loading");
  submitButton.disabled = true;

  try {
    // 模擬 API 請求
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 構建訂房資料
    const bookingData = {
      checkIn: checkInInput.value,
      checkOut: checkOutInput.value,
      roomType: Array.from(roomOptions).find(radio => radio.checked).value,
      guestInfo: {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        specialRequests: document.getElementById("special-requests").value.trim(),
      },
      totalNights: calculateNights(checkInInput.value, checkOutInput.value),
      totalPrice: parseInt(summaryTotal.textContent.replace(/[^0-9]/g, "")),
    };

    // 這裡應該要發送到後端 API
    console.log("預訂資料：", bookingData);

    // 顯示成功訊息
    alert("預訂成功！我們會盡快與您聯繫確認訂單。");

    // 重置表單
    bookingForm.reset();
    updateBookingSummary();
  } catch (error) {
    console.error("預訂失敗：", error);
    alert("預訂發生錯誤，請稍後再試。");
  } finally {
    submitButton.classList.remove("loading");
    submitButton.disabled = false;
  }
}

// 事件監聽
document.addEventListener("DOMContentLoaded", () => {
  initializeDatePickers();

  // 房型選擇變更時更新明細
  roomOptions.forEach(radio => {
    radio.addEventListener("change", updateBookingSummary);
  });

  // 表單提交處理
  bookingForm.addEventListener("submit", handleSubmit);

  // 檢查 URL 參數是否有預選房型
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedRoom = urlParams.get("room");
  if (preSelectedRoom) {
    const roomRadio = document.querySelector(`input[name="roomType"][value="${preSelectedRoom}"]`);
    if (roomRadio) {
      roomRadio.checked = true;
      updateBookingSummary();
    }
  }
});

// 自動填充已登入用戶資料
function fillUserData(userData) {
  if (userData) {
    nameInput.value = userData.name || "";
    phoneInput.value = userData.phone || "";
    emailInput.value = userData.email || "";
  }
}

// 監聽視窗大小變化，調整 UI
window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    document.querySelector(".booking-summary").style.position = "static";
  } else {
    document.querySelector(".booking-summary").style.position = "sticky";
  }
});
