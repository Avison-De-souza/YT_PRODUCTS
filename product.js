document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById('primeProductGrid');
  if (!grid) return;

  try {
    const response = await fetch('http://localhost:5000/api/products/prime');
    const products = await response.json();

    grid.innerHTML = '';

    if (products.length === 0) {
      grid.innerHTML = '<p style="text-align:center;">No Prime products found in database.</p>';
      return;
    }

    products.forEach(item => {
      const card = document.createElement('div');
      card.className = 'category-card';
      card.style.cursor = 'pointer';

      // Fallback link if buy_url isn't set
      const destinationUrl = item.buy_url || 'https://drinkprime.com';

      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${item.image_path}" alt="${item.title}">
        </div>
        <div class="card-body">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem;">
            <span class="card-link" style="font-size:1.2rem; color:#ff0000; font-weight:700;">${item.price}</span>
            <a href="${destinationUrl}" target="_blank" rel="noopener noreferrer" style="padding: 8px 14px; background: #ff0000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 0.85rem;">Buy Now ↗</a>
          </div>
        </div>
      `;

      // Redirect user when clicking anywhere on the card
      card.addEventListener('click', (e) => {
        // Prevent double trigger if user clicked directly on the anchor tag
        if (e.target.tagName !== 'A') {
          window.open(destinationUrl, '_blank');
        }
      });

      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Error fetching Prime products:', err);
    grid.innerHTML = '<p style="text-align:center; color:red;">Failed to connect to backend server.</p>';
  }
});