document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.docs-section');

    // Función para mostrar la sección correcta
    function showSection(targetId) {
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
            setTimeout(() => targetSection.classList.add('active'), 10); // Activar animación
        }
    }

    // Manejar clics en el menú
    navItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const targetId = item.getAttribute('href');

            // Actualiza la clase 'active' del menú
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Muestra la sección
            showSection(targetId);

            // Scroll suave
            targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Mostrar la primera sección al cargar
    showSection(navItems[0].getAttribute('href'));
});