const API_KEY = "f269872efa4dce6e02988d4d89a68a9e";

const GNEWS_URL = `https://gnews.io/api/v4/search?q=noticias&lang=es&country=mx&max=10&apikey=${API_KEY}`;

const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(GNEWS_URL)}`;

const newsContainer = document.getElementById("news-container");
const refreshButton = document.getElementById("refreshButton");

async function fetchNews() {
  try {
    newsContainer.innerHTML = `<p class="placeholder">Cargando noticias...</p>`;
    refreshButton.textContent = "Cargando...";

    const response = await fetch(PROXY_URL);
    if (!response.ok) throw new Error(`Error HTTP o del Proxy: ${response.status}`);

    const wrappedData = await response.json();
    
    if (!wrappedData.contents) {
        throw new Error("El servicio Proxy no devolvió contenido de GNews.");
    }
    
    const data = JSON.parse(wrappedData.contents);

    if (!data.articles || data.articles.length === 0) {
      newsContainer.innerHTML = `<p>No se encontraron noticias disponibles.</p>`;
      refreshButton.textContent = "Actualizar Noticias";
      return;
    }

    newsContainer.innerHTML = "";
    data.articles.forEach(article => {
      const newsItem = document.createElement("article");
      newsItem.classList.add("news-item");

      newsItem.innerHTML = `
        <img src="${article.image || 'https://via.placeholder.com/300x180?text=Sin+imagen'}" alt="Imagen de noticia">
        <div class="news-item-content">
          <h2><a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a></h2>
          <p>${article.description || 'Sin descripción disponible.'}</p>
        </div>
      `;

      newsContainer.appendChild(newsItem);
    });

    refreshButton.textContent = "Noticias actualizadas";
    setTimeout(() => (refreshButton.textContent = "Actualizar Noticias"), 2000);

  } catch (error) {
    newsContainer.innerHTML = `<p style="color:red; font-weight: bold;">Ocurrió un error al cargar las noticias. Posiblemente la clave API expiró o el Proxy falló: ${error.message}</p>`;
    refreshButton.textContent = "Intentar de nuevo";
  }
}

refreshButton.textContent = "Actualizar Noticias";
refreshButton.addEventListener("click", fetchNews);

fetchNews();
