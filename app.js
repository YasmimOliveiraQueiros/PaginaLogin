// app.js
function qs(selector, root = document) {
  return root.querySelector(selector);
}

function setPanel(active) {
  const loginTab = qs("#tab-login");
  const signupTab = qs("#tab-signup");
  const loginPanel = qs("#panel-login");
  const signupPanel = qs("#panel-signup");
  const hint = qs("#cardHint");

  const loginActive = active === "login";
  loginTab.classList.toggle("tab--active", loginActive);
  signupTab.classList.toggle("tab--active", !loginActive);

  loginTab.setAttribute("aria-selected", String(loginActive));
  signupTab.setAttribute("aria-selected", String(!loginActive));
  loginTab.tabIndex = loginActive ? 0 : -1;
  signupTab.tabIndex = loginActive ? -1 : 0;

  loginPanel.classList.toggle("panel--active", loginActive);
  signupPanel.classList.toggle("panel--active", !loginActive);
  loginPanel.hidden = !loginActive;
  signupPanel.hidden = loginActive;

  hint.textContent = loginActive
    ? "Use seu e-mail corporativo para continuar."
    : "Crie sua conta para comecar. Voce pode alterar depois.";

  document.title = loginActive ? "StartupID · Login" : "StartupID · Cadastro";
}

function setFieldError(inputEl, errorEl, message) {
  if (!inputEl || !errorEl) return;
  const hasError = Boolean(message);
  inputEl.setAttribute("aria-invalid", hasError ? "true" : "false");
  errorEl.textContent = message || "";
}

function isEmailValid(value) {
  const email = String(value || "").trim();
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function toast(title, msg) {
  const root = qs("#toast");
  const titleEl = qs("#toastTitle");
  const msgEl = qs("#toastMsg");
  const close = qs("#toastClose");
  if (!root || !titleEl || !msgEl || !close) return;

  titleEl.textContent = title;
  msgEl.textContent = msg;
  root.hidden = false;

  const timeout = window.setTimeout(() => {
    root.hidden = true;
  }, 5200);

  close.onclick = () => {
    window.clearTimeout(timeout);
    root.hidden = true;
  };
}

function bindTabs() {
  const loginTab = qs("#tab-login");
  const signupTab = qs("#tab-signup");
  const toLogin = qs("#toLogin");

  loginTab.addEventListener("click", () => setPanel("login"));
  signupTab.addEventListener("click", () => setPanel("signup"));
  toLogin.addEventListener("click", () => setPanel("login"));

  const tabs = [loginTab, signupTab];
  tabs.forEach((tab, idx) => {
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = (idx + dir + tabs.length) % tabs.length;
      tabs[next].focus();
      tabs[next].click();
    });
  });
}

function bindPasswordToggles() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-toggle-password]");
    if (!btn) return;

    const targetId = btn.getAttribute("data-toggle-password");
    const input = qs(`#${CSS.escape(targetId)}`);
    if (!input) return;

    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    btn.textContent = showing ? "Mostrar" : "Ocultar";
    btn.setAttribute("aria-label", showing ? "Mostrar senha" : "Ocultar senha");
  });
}

function bindFakeLinks() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-fake-action]");
    if (!link) return;
    e.preventDefault();

    const action = link.getAttribute("data-fake-action");
    const map = {
      forgot: { title: "Recuperacao", msg: "Fluxo de recuperacao (demo)." },
      terms: { title: "Termos", msg: "Pagina de termos (demo)." },
      privacy: { title: "Privacidade", msg: "Politica de privacidade (demo)." },
    };

    const item = map[action] || { title: "Info", msg: "Acao (demo)." };
    toast(item.title, item.msg);
  });
}

function validateLogin() {
  const email = qs("#loginEmail");
  const pass = qs("#loginPassword");

  const emailErr = qs("#loginEmailError");
  const passErr = qs("#loginPasswordError");

  let ok = true;
  if (!isEmailValid(email.value)) {
    setFieldError(email, emailErr, "Informe um e-mail valido.");
    ok = false;
  } else {
    setFieldError(email, emailErr, "");
  }

  if (String(pass.value || "").length < 8) {
    setFieldError(pass, passErr, "Sua senha deve ter 8+ caracteres.");
    ok = false;
  } else {
    setFieldError(pass, passErr, "");
  }

  return ok;
}

function validateSignup() {
  const name = qs("#signupName");
  const email = qs("#signupEmail");
  const pass = qs("#signupPassword");
  const confirm = qs("#signupConfirm");
  const terms = qs("#terms");

  const nameErr = qs("#signupNameError");
  const emailErr = qs("#signupEmailError");
  const passErr = qs("#signupPasswordError");
  const confirmErr = qs("#signupConfirmError");
  const termsErr = qs("#termsError");

  let ok = true;

  if (String(name.value || "").trim().length < 2) {
    setFieldError(name, nameErr, "Digite seu nome (minimo 2 letras).");
    ok = false;
  } else {
    setFieldError(name, nameErr, "");
  }

  if (!isEmailValid(email.value)) {
    setFieldError(email, emailErr, "Informe um e-mail valido.");
    ok = false;
  } else {
    setFieldError(email, emailErr, "");
  }

  if (String(pass.value || "").length < 8) {
    setFieldError(pass, passErr, "Crie uma senha com 8+ caracteres.");
    ok = false;
  } else {
    setFieldError(pass, passErr, "");
  }

  if (String(confirm.value || "") !== String(pass.value || "")) {
    setFieldError(confirm, confirmErr, "As senhas nao conferem.");
    ok = false;
  } else {
    setFieldError(confirm, confirmErr, "");
  }

  if (!terms.checked) {
    termsErr.textContent = "Voce precisa aceitar os termos para continuar.";
    ok = false;
  } else {
    termsErr.textContent = "";
  }

  return ok;
}

function bindForms() {
  const loginForm = qs("#loginForm");
  const signupForm = qs("#signupForm");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    toast("Bem-vindo", "Login validado (demo). Conecte isso ao seu backend.");
    loginForm.reset();
  });

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    toast("Conta criada", "Cadastro validado (demo). Conecte isso ao seu backend.");
    signupForm.reset();
    setPanel("login");
    qs("#loginEmail").focus();
  });

  ["#loginEmail", "#loginPassword"].forEach((sel) => {
    const el = qs(sel);
    el.addEventListener("blur", validateLogin);
  });
  ["#signupName", "#signupEmail", "#signupPassword", "#signupConfirm"].forEach(
    (sel) => {
      const el = qs(sel);
      el.addEventListener("blur", validateSignup);
    },
  );
}

function main() {
  setPanel("login");
  bindTabs();
  bindPasswordToggles();
  bindForms();
  bindFakeLinks();
}

document.addEventListener("DOMContentLoaded", main);
