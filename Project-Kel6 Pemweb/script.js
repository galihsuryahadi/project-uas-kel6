const LS_CART = "toko_sepeda_cart";

function getCart(){
  try { return JSON.parse(localStorage.getItem(LS_CART)) || []; }
  catch { return []; }
}
function cartCount(){
  return getCart().reduce((a,x)=>a+(x.qty||0),0);
}
function updateBadge(){
  const el = document.getElementById("cartBadge");
  if(el) el.textContent = "Keranjang: " + cartCount();
}

function setActiveNav(){
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a, .nav-panel a").forEach(a=>{
    a.classList.toggle("active",(a.getAttribute("href")||"").toLowerCase()===path);
  });
}

/* Hamburger */
function initHamburger(){
  const menuBtn  = document.getElementById("menuBtn");
  const navPanel = document.getElementById("navPanel");
  const overlay  = document.getElementById("overlay");
  if(!menuBtn || !navPanel || !overlay) return;

  function openMenu(){
    menuBtn.setAttribute("aria-expanded","true");
    navPanel.style.display = "block";
    overlay.classList.add("show");
  }
  function closeMenu(){
    menuBtn.setAttribute("aria-expanded","false");
    navPanel.style.display = "none";
    overlay.classList.remove("show");
  }
  function toggleMenu(){
    const expanded = menuBtn.getAttribute("aria-expanded")==="true";
    expanded ? closeMenu() : openMenu();
  }

  navPanel.style.display = "none";

  menuBtn.addEventListener("click", (e)=>{ e.stopPropagation(); toggleMenu(); });
  overlay.addEventListener("click", closeMenu);

  navPanel.querySelectorAll("a").forEach(a=>a.addEventListener("click", closeMenu));

  document.addEventListener("keydown",(e)=>{ if(e.key==="Escape") closeMenu(); });

  document.addEventListener("click",(e)=>{
    if(menuBtn.getAttribute("aria-expanded")!=="true") return;
    const inside = navPanel.contains(e.target) || menuBtn.contains(e.target);
    if(!inside) closeMenu();
  });
}

/* ===== SLIDER ETALASE (TAMBAHAN) ===== */
let sliderIndex = 0;
let sliderTimer = null;

function initSlider(){
  const slidesEl = document.getElementById("slides");
  if(!slidesEl) return; // kalau halaman lain gak punya slider, aman

  const total = slidesEl.children.length;
  if(total <= 1) return;

  const dotsEl = document.getElementById("dots");
  if(dotsEl){
    dotsEl.innerHTML = Array.from({length: total}, (_, i) =>
      `<button class="dot ${i===0 ? "active" : ""}" type="button" aria-label="Slide ${i+1}" data-dot="${i}"></button>`
    ).join("");

    dotsEl.querySelectorAll("[data-dot]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        sliderIndex = Number(btn.getAttribute("data-dot"));
        showSlide();
        resetAutoSlide();
      });
    });
  }

  showSlide();
  startAutoSlide();
}

function showSlide(){
  const slidesEl = document.getElementById("slides");
  if(!slidesEl) return;

  const total = slidesEl.children.length;
  sliderIndex = (sliderIndex + total) % total;

  slidesEl.style.transform = `translateX(-${sliderIndex * 100}%)`;

  const dotsEl = document.getElementById("dots");
  if(dotsEl){
    dotsEl.querySelectorAll(".dot").forEach((d,i)=>{
      d.classList.toggle("active", i === sliderIndex);
    });
  }
}

function nextSlide(){
  const slidesEl = document.getElementById("slides");
  if(!slidesEl) return;

  sliderIndex += 1;
  showSlide();
  resetAutoSlide();
}

function prevSlide(){
  const slidesEl = document.getElementById("slides");
  if(!slidesEl) return;

  sliderIndex -= 1;
  showSlide();
  resetAutoSlide();
}

function startAutoSlide(){
  stopAutoSlide();
  sliderTimer = setInterval(()=>{
    sliderIndex += 1;
    showSlide();
  }, 5000); // 5 detik
}

function stopAutoSlide(){
  if(sliderTimer){
    clearInterval(sliderTimer);
    sliderTimer = null;
  }
}

function resetAutoSlide(){
  startAutoSlide();
}

/* init */
document.addEventListener("DOMContentLoaded", ()=>{
  updateBadge();
  setActiveNav();
  initHamburger();
  initSlider(); // TAMBAHAN
});
