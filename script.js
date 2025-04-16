let debounceTimer;
let fuse = null;
let fullData = [];

const API_URL = 'https://bucanero-production.up.railway.app/api/bucanero/productos';

// Cargar los datos de la API
async function loadData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        fullData = data.result || [];

        initializeFuse();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

// Inicializar Fuse.js para búsqueda rápida
function initializeFuse() {
    const options = {
        keys: ['MATERIAL','PLU','PRODUCTO','MARCA','ESTADO','NATURALEZA'],
        threshold: 0.3,
    };
    fuse = new Fuse(fullData, options);
}

// Manejo de la entrada de búsqueda con debounce
function handleInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const query = document.getElementById('searchInput').value.trim();
        if (query) {
            performSearch(query);
        } else {
            document.getElementById('results').innerHTML = '';
        }
    }, 300);
}

// Realizar búsqueda con Fuse.js
function performSearch(query) {
    const results = fuse.search(query).map(result => result.item);
    renderResults(results);
}

// Renderizar los resultados en HTML con animaciones
function renderResults(results) {
    let output = `<h2>Resultados (${results.length} encontrados):</h2>`;

    if (results.length > 0) {
        results.forEach(result => {
            output += `
                <div class="result-item">
                    <h3>${result.PRODUCTO}</h3>
                    <ul>
                        <li>
                            <strong>Material:</strong> ${result.MATERIAL} 
                            <i class="material-icons copy-icon" onclick="copyToClipboard('${result.MATERIAL}')">content_copy</i>
                        </li>
                        <li><strong>Plu:</strong> ${result.PLU || 'N/A'}</li>
                        <li><strong>Marca:</strong> ${result.MARCA || 'N/A'}</li>
                        <li><strong>Estado:</strong> ${result.ESTADO || 'N/A'}</li>
                        <li><strong>Naturaleza:</strong> ${result.NATURALEZA || 'N/A'}</li>
                    </ul>
                </div>
            `;
        });
    } else {
        output += '<p>No se encontraron resultados.</p>';
    }

    document.getElementById('results').innerHTML = output;
}

// Copiar al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => alert('Documento copiado al portapapeles'))
        .catch(err => console.error('Error:', err));
}

// Modo Oscuro
document.getElementById("darkModeToggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

// Cargar datos al inicio
loadData();
