const API_KEY = "f269872efa4dce6e02988d4d89a68a9e";
const API_URL = `https://gnews.io/api/v4/top-headlines?category=general&lang=es&max=10&apikey=${API_KEY}`;

const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(API_URL)}`;

async function fetchNews() {
  try {
    newsContainer.innerHTML = `<p class="placeholder">Cargando noticias...</p>`;

    const response = await fetch(PROXY_URL);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const proxyData = await response.json();
    const data = JSON.parse(proxyData.contents);

    if (!data.articles || data.articles.length === 0) {
      newsContainer.innerHTML = `<p>No se encontraron noticias disponibles.</p>`;
      return;
    }

    newsContainer.innerHTML = "";
    data.articles.forEach(article => {
      const newsItem = document.createElement("article");
      newsItem.classList.add("news-item");

      newsItem.innerHTML = `
        <img src="${article.image || 'https://via.placeholder.com/300x180?text=Sin+imagen'}" alt="Imagen de noticia">
        <div class="news-item-content">
          <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
          <p>${article.description || 'Sin descripción disponible.'}</p>
        </div>
      `;

      newsContainer.appendChild(newsItem);
    });

  } catch (error) {
    newsContainer.innerHTML = `<p style="color:red;">Ocurrió un error al cargar las noticias: ${error.message}</p>`;
  }
}
