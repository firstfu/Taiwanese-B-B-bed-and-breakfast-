document.addEventListener("DOMContentLoaded", () => {
  // 獲取所有需要的元素
  const tabBtns = document.querySelectorAll(".tab-btn");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // 切換表單頁籤
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // 移除所有活動狀態
      tabBtns.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".form-content").forEach(form => form.classList.remove("active"));

      // 添加當前活動狀態
      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      document.getElementById(`${tabId}Form`).classList.add("active");
    });
  });

  // 表單驗證函數
  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = password => {
    return password.length >= 6;
  };

  const validatePhone = phone => {
    const re = /^09\d{8}$/;
    return re.test(phone);
  };

  // 顯示錯誤訊息
  const showError = (input, message) => {
    const formGroup = input.parentElement;
    formGroup.classList.add("error");

    let errorMessage = formGroup.querySelector(".error-message");
    if (!errorMessage) {
      errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      formGroup.appendChild(errorMessage);
    }
    errorMessage.textContent = message;
  };

  // 清除錯誤訊息
  const clearError = input => {
    const formGroup = input.parentElement;
    formGroup.classList.remove("error");
    const errorMessage = formGroup.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.textContent = "";
    }
  };

  // 處理登入表單提交
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    let isValid = true;
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    // 驗證電子郵件
    if (!validateEmail(email.value)) {
      showError(email, "請輸入有效的電子郵件地址");
      isValid = false;
    } else {
      clearError(email);
    }

    // 驗證密碼
    if (!validatePassword(password.value)) {
      showError(password, "密碼長度至少需要6個字元");
      isValid = false;
    } else {
      clearError(password);
    }

    if (isValid) {
      // TODO: 在此處理登入邏輯
      console.log("登入表單提交", {
        email: email.value,
        password: password.value,
        rememberMe: document.getElementById("rememberMe").checked,
      });
    }
  });

  // 處理註冊表單提交
  registerForm.addEventListener("submit", e => {
    e.preventDefault();
    let isValid = true;
    const name = document.getElementById("registerName");
    const email = document.getElementById("registerEmail");
    const password = document.getElementById("registerPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const phone = document.getElementById("phone");

    // 驗證姓名
    if (name.value.trim() === "") {
      showError(name, "請輸入姓名");
      isValid = false;
    } else {
      clearError(name);
    }

    // 驗證電子郵件
    if (!validateEmail(email.value)) {
      showError(email, "請輸入有效的電子郵件地址");
      isValid = false;
    } else {
      clearError(email);
    }

    // 驗證密碼
    if (!validatePassword(password.value)) {
      showError(password, "密碼長度至少需要6個字元");
      isValid = false;
    } else {
      clearError(password);
    }

    // 驗證確認密碼
    if (password.value !== confirmPassword.value) {
      showError(confirmPassword, "密碼不一致");
      isValid = false;
    } else {
      clearError(confirmPassword);
    }

    // 驗證手機號碼
    if (!validatePhone(phone.value)) {
      showError(phone, "請輸入有效的手機號碼 (格式：09xxxxxxxx)");
      isValid = false;
    } else {
      clearError(phone);
    }

    if (isValid) {
      // TODO: 在此處理註冊邏輯
      console.log("註冊表單提交", {
        name: name.value,
        email: email.value,
        password: password.value,
        phone: phone.value,
      });
    }
  });
});
