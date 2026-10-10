// Expand / collapse sidebar groups
document.querySelectorAll('.sidebar-group-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.parentElement.classList.toggle('open');
    });
});

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');
const backdrop = document.getElementById('sidebar-backdrop');

function closeSidebar() {
    sidebar.classList.remove('open');
    menuToggle.classList.remove('open');
    backdrop.classList.remove('show');
}

function toggleSidebar() {
    const isOpen = sidebar.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    backdrop.classList.toggle('show', isOpen);
}

if (menuToggle) {
    menuToggle.addEventListener('click', toggleSidebar);
}

if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
}

// Switch content sections
document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        const target = link.getAttribute('data-section');

        // Update active states in sidebar
        document.querySelectorAll('.sidebar-link, .sidebar-sublink').forEach(el => {
            el.classList.remove('active');
        });
        link.classList.add('active');

        // Show the correct content section
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        const section = document.getElementById(target);
        if (section) {
            section.classList.add('active');
            // Scroll main content to top
            document.getElementById('content').scrollTop = 0;
        }

        // Close mobile sidebar after navigation
        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    });
});