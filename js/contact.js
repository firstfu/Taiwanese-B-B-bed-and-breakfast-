// DOM 元素
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");
const submitButton = document.querySelector(".submit-button");

// 表單驗證
function validateForm() {
  let isValid = true;

  // 移除所有錯誤提示
  clearErrors();

  // 驗證姓名
  if (!nameInput.value.trim()) {
    showError(nameInput, "請輸入姓名");
    isValid = false;
  }

  // 驗證 Email
  if (!validateEmail(emailInput.value)) {
    showError(emailInput, "請輸入有效的 Email 地址");
    isValid = false;
  }

  // 驗證電話（如果有填寫）
  if (phoneInput.value.trim() && !validatePhone(phoneInput.value)) {
    showError(phoneInput, "請輸入有效的電話號碼");
    isValid = false;
  }

  // 驗證主旨
  if (!subjectInput.value.trim()) {
    showError(subjectInput, "請輸入主旨");
    isValid = false;
  }

  // 驗證訊息內容
  if (!messageInput.value.trim()) {
    showError(messageInput, "請輸入訊息內容");
    isValid = false;
  } else if (messageInput.value.trim().length < 10) {
    showError(messageInput, "訊息內容至少需要10個字");
    isValid = false;
  }

  return isValid;
}

// Email 格式驗證
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 電話格式驗證
function validatePhone(phone) {
  const re = /^[0-9]{8,10}$/;
  return re.test(phone.replace(/[-\s]/g, ""));
}

// 顯示錯誤訊息
function showError(element, message) {
  // 移除現有的錯誤訊息
  const existingError = element.parentElement.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // 添加錯誤樣式
  element.classList.add("input-error");

  // 創建錯誤訊息元素
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;

  // 插入錯誤訊息
  element.parentElement.appendChild(errorDiv);
}

// 清除所有錯誤提示
function clearErrors() {
  // 移除所有錯誤訊息
  document.querySelectorAll(".error-message").forEach(error => error.remove());

  // 移除所有錯誤樣式
  document.querySelectorAll(".input-error").forEach(element => {
    element.classList.remove("input-error");
  });
}

// 處理表單提交
async function handleSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  // 添加載入狀態
  submitButton.classList.add("loading");
  submitButton.disabled = true;

  try {
    // 模擬 API 請求
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 構建表單資料
    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      subject: subjectInput.value.trim(),
      message: messageInput.value.trim(),
      newsletter: document.querySelector('input[name="newsletter"]').checked,
    };

    // 這裡應該要發送到後端 API
    console.log("聯絡表單資料：", formData);

    // 顯示成功訊息
    showSuccessMessage();

    // 重置表單
    contactForm.reset();
  } catch (error) {
    console.error("提交失敗：", error);
    showErrorMessage("提交失敗，請稍後再試。");
  } finally {
    submitButton.classList.remove("loading");
    submitButton.disabled = false;
  }
}

// 顯示成功訊息
function showSuccessMessage() {
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.innerHTML = `
        <div class="success-content">
            <h3>感謝您的來信</h3>
            <p>我們已收到您的訊息，將會在24小時內回覆。</p>
            <button onclick="this.parentElement.parentElement.remove()">確定</button>
        </div>
    `;
  document.body.appendChild(successDiv);
}

// 顯示錯誤通知
function showErrorMessage(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-notification";
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);

  // 3秒後自動移除
  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

// 即時驗證
function setupLiveValidation() {
  const inputs = [nameInput, emailInput, phoneInput, subjectInput, messageInput];

  inputs.forEach(input => {
    // 當輸入框失去焦點時驗證
    input.addEventListener("blur", () => {
      // 清除該輸入框的錯誤
      const existingError = input.parentElement.querySelector(".error-message");
      if (existingError) {
        existingError.remove();
      }
      input.classList.remove("input-error");

      // 根據不同輸入框執行對應的驗證
      if (input === emailInput && input.value) {
        if (!validateEmail(input.value)) {
          showError(input, "請輸入有效的 Email 地址");
        }
      } else if (input === phoneInput && input.value) {
        if (!validatePhone(input.value)) {
          showError(input, "請輸入有效的電話號碼");
        }
      } else if (input === messageInput && input.value) {
        if (input.value.trim().length < 10) {
          showError(input, "訊息內容至少需要10個字");
        }
      }
    });

    // 當輸入內容時移除錯誤提示
    input.addEventListener("input", () => {
      const existingError = input.parentElement.querySelector(".error-message");
      if (existingError) {
        existingError.remove();
      }
      input.classList.remove("input-error");
    });
  });
}

// 事件監聽
document.addEventListener("DOMContentLoaded", () => {
  setupLiveValidation();
  contactForm.addEventListener("submit", handleSubmit);
});

// 地圖相關功能
function initMap() {
  // 如果需要額外的地圖功能可以在這裡實現
  const mapWrapper = document.querySelector(".map-wrapper");

  // 點擊地圖時在新視窗開啟 Google Maps
  if (mapWrapper) {
    const iframe = mapWrapper.querySelector("iframe");
    iframe.addEventListener("click", e => {
      e.preventDefault();
      window.open(iframe.src, "_blank");
    });
  }
}

// 社群媒體分享功能
function setupSocialSharing() {
  const socialLinks = document.querySelectorAll(".social-link");

  socialLinks.forEach(link => {
    link.addEventListener("click", e => {
      const platform = link.getAttribute("data-platform");
      if (platform) {
        e.preventDefault();
        // 這裡可以實現各平台的分享功能
        console.log(`分享至 ${platform}`);
      }
    });
  });
}
