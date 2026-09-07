document.addEventListener("DOMContentLoaded", async () => {
  // 1. Fetch & Render Slideshow from MongoDB
  try {
    const slideRes = await fetch('http://localhost:5000/api/slides');
    const slideData = await slideRes.json();
    
    const wrapper = document.querySelector('.slideshow-wrapper');
    const dotsContainer = document.getElementById("dotsContainer");

    if (slideData.length > 0 && wrapper) {
      slideData.forEach((item) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide fade';
        slideDiv.innerHTML = `<img src="${item.image_path}" alt="${item.alt_text}">`;
        wrapper.insertBefore(slideDiv, dotsContainer);
      });

      initSlideshow();
    }
  } catch (err) {
    console.error('Error fetching slides from DB:', err);
  }

  // 2. Fetch & Render Categories from MongoDB
  try {
    const catRes = await fetch('http://localhost:5000/api/categories');
    const categories = await catRes.json();

    const categoryGrid = document.querySelector('.category-grid');
    if (categoryGrid) {
      categoryGrid.innerHTML = ''; // Clear hardcoded HTML

      categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
          <a href="${cat.page_link}">
            <div class="card-img-wrapper">
              <img src="${cat.image_path}" alt="${cat.title}">
            </div>
            <div class="card-body">
              <h3>${cat.title}</h3>
              <p>${cat.description}</p>
              <span class="card-link">Explore ${cat.title} &rarr;</span>
            </div>
          </a>
        `;
        categoryGrid.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Error fetching categories from DB:', err);
  }

  // 3. Mobile Navbar Navigation Toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }
});

// Slideshow animation controller
function initSlideshow() {
  let slideIndex = 0;
  let slideInterval;
  const slides = document.getElementsByClassName("slide");
  const dotsContainer = document.getElementById("dotsContainer");

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("span");
    dot.className = "dot" + (i === 0 ? " active-dot" : "");
    dotsContainer.appendChild(dot);
  }

  const dots = document.getElementsByClassName("dot");

  function showSlides() {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
      if (dots[i]) dots[i].classList.remove("active-dot");
    }
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;

    slides[slideIndex - 1].style.display = "block";
    if (dots[slideIndex - 1]) dots[slideIndex - 1].classList.add("active-dot");

    slideInterval = setTimeout(showSlides, 3500);
  }

  showSlides();

  // Pause slideshow on hover
  const slideshowWrapper = document.querySelector(".slideshow-wrapper");
  if (slideshowWrapper) {
    slideshowWrapper.addEventListener("mouseenter", () => clearTimeout(slideInterval));
    slideshowWrapper.addEventListener("mouseleave", () => {
      slideInterval = setTimeout(showSlides, 3500);
    });
  }
}