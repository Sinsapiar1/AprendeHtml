// Función para alternar entre el contenido principal y la referencia HTML
function toggleHtmlReference() {
    const referenceSection = document.getElementById('html-reference');
    const mainContent = document.getElementById('main-content');
    
    if (referenceSection.style.display === 'none' || referenceSection.style.display === '') {
        referenceSection.style.display = 'block';
        mainContent.style.display = 'none';
        // Guardar estado en localStorage
        localStorage.setItem('showReference', 'true');
    } else {
        referenceSection.style.display = 'none';
        mainContent.style.display = 'block';
        // Guardar estado en localStorage
        localStorage.setItem('showReference', 'false');
    }
}

// Función para mostrar directamente la sección de referencia
function showReference() {
    // Guardar el estado para mostrar la referencia
    localStorage.setItem('showReference', 'true');
}

// Función para verificar el estado guardado cuando se carga la página
function checkReferenceState() {
    const showReference = localStorage.getItem('showReference');
    
    // Si estamos en la página de referencia-html.html
    if (window.location.href.includes('referencia-html.html')) {
        const referenceSection = document.getElementById('html-reference');
        const mainContent = document.getElementById('main-content');
        
        // Si el localStorage indica que debemos mostrar la referencia
        if (showReference === 'true') {
            if (referenceSection && mainContent) {
                referenceSection.style.display = 'block';
                mainContent.style.display = 'none';
            }
        }
        
        // Si la URL contiene #html-reference, mostrar la sección de referencia
        if (window.location.hash === '#html-reference') {
            if (referenceSection && mainContent) {
                referenceSection.style.display = 'block';
                mainContent.style.display = 'none';
            }
        }
    }
}

// Función para desplazarse suavemente a las secciones al hacer clic en enlaces del índice
document.addEventListener('DOMContentLoaded', function() {
    // Verificar el estado guardado
    checkReferenceState();
    
    // Agregar eventos de clic a enlaces internos para desplazamiento suave
    const internalLinks = document.querySelectorAll('.toc a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Agregar evento al botón "Volver arriba"
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Mostrar/ocultar botón "Volver arriba" según el desplazamiento
    window.addEventListener('scroll', function() {
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        }
    });
});

// Función para buscar en las tablas de referencia
function searchTags() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const tables = document.querySelectorAll('#html-reference table');
    const sections = document.querySelectorAll('#html-reference .section');
    let foundResults = false;
    
    // Restaurar todas las secciones antes de buscar
    sections.forEach(section => {
        section.style.display = 'block';
    });
    
    // Si no hay término de búsqueda, mostrar todas las filas y salir
    if (searchTerm === '') {
        tables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                row.style.display = '';
            });
        });
        document.getElementById('noResults').style.display = 'none';
        return;
    }
    
    // Buscar en cada tabla
    tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        let tableHasVisibleRows = false;
        
        // Siempre mantener la fila de encabezado visible
        const headerRow = rows[0];
        headerRow.style.display = '';
        
        // Comprobar cada fila (excepto la de encabezado)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const text = row.textContent.toLowerCase();
            
            if (text.includes(searchTerm)) {
                row.style.display = '';
                tableHasVisibleRows = true;
                foundResults = true;
            } else {
                row.style.display = 'none';
            }
        }
        
        // Encontrar la sección padre de esta tabla
        const parentSection = table.closest('.section');
        if (parentSection && !tableHasVisibleRows) {
            parentSection.style.display = 'none';
        }
    });
    
    // Mostrar mensaje si no se encuentran resultados
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = foundResults ? 'none' : 'block';
    }
}

// Inicializar el buscador cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', searchTags);
    }
});