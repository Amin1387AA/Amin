"use strict";

const typingElement = document.getElementById("typingText");
const words = ["برنامه‌نویس وب", "طراح رابط کاربری", "علاقه‌مند به فناوری"];
let wordIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeWords() {
  const word = words[wordIndex];
  typingElement.textContent = word.slice(0, letterIndex);

  if (!deleting && letterIndex < word.length) {
    letterIndex++;
    setTimeout(typeWords, 95);
  } else if (deleting && letterIndex > 0) {
    letterIndex--;
    setTimeout(typeWords, 45);
  } else {
    deleting = !deleting;
    if (!deleting) wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeWords, deleting ? 1300 : 350);
  }
}
typeWords();

// منوی موبایل
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "بستن منو" : "باز کردن منو");
});

navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// نمایش تدریجی بخش‌ها هنگام اسکرول
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

// شمارنده‌های آماری
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const element = entry.target;
    const target = Number(element.dataset.count);
    const startTime = performance.now();
    const duration = 1300;

    function updateCount(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString("fa-IR");
      if (progress < 1) requestAnimationFrame(updateCount);
    }

    requestAnimationFrame(updateCount);
    countObserver.unobserve(element);
  });
}, { threshold: 0.6 });

document.querySelectorAll("[data-count]").forEach(element => countObserver.observe(element));

// فیلتر نمونه‌کارها
document.getElementById("projectFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  document.querySelectorAll(".filter-button").forEach(item => item.classList.remove("active"));
  button.classList.add("active");

  const filter = button.dataset.filter;
  document.querySelectorAll(".project-card").forEach(card => {
    const shouldShow = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("is-hidden", !shouldShow);
  });
});

// فرم فقط یک ایمیل در برنامه‌ی کاربر آماده می‌کند؛ اطلاعات به سرور ارسال نمی‌شود.
document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const subject = encodeURIComponent(`پیام از سایت شخصی - ${name}`);
  const body = encodeURIComponent(`نام: ${name}\nایمیل: ${email}\n\nپیام:\n${message}`);
  window.location.href = `mailto:amin@example.com?subject=${subject}&body=${body}`;
});

// افکت ذرات پس‌زمینه
const canvas = document.getElementById("particles");
const context = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let particles = [];
let animationFrame;

function setupParticles() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const count = Math.min(Math.floor(window.innerWidth / 13), 75);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.5 + 0.4,
    speed: Math.random() * 0.22 + 0.06,
    alpha: Math.random() * 0.45 + 0.12
  }));
}

function drawParticles() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach(particle => {
    particle.y -= particle.speed;
    if (particle.y < -3) {
      particle.y = window.innerHeight + 3;
      particle.x = Math.random() * window.innerWidth;
    }

    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(150, 170, 255, ${particle.alpha})`;
    context.fill();
  });

  animationFrame = requestAnimationFrame(drawParticles);
}

if (!reduceMotion) {
  setupParticles();
  drawParticles();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    setupParticles();
    drawParticles();
  });
}

document.getElementById("year").textContent = new Date().getFullYear();