// Sidebar group expand/collapse
document.querySelectorAll('.sidebar-group-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.parentElement.classList.toggle('open');
    });
});

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

function getHashSection() {
    return window.location.hash.slice(1);
}


function showSection(target) {
    if (!target || !document.getElementById(target)) target = 'welcome';


    document.querySelectorAll('.sidebar-link, .sidebar-sublink').forEach(el => {
        el.classList.remove('active');
    });
    const activeLink = document.querySelector(`[data-section="${target}"]`);
    if (activeLink) activeLink.classList.add('active');


    document.querySelectorAll('.top-links a').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-section') === target);
    });


    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    const section = document.getElementById(target);
    if (section) {
        section.classList.add('active');
        document.getElementById('content').scrollTop = 0;
    }


    if (activeLink) {
        let parent = activeLink.closest('.sidebar-group, .sidebar-subgroup');
        while (parent) {
            parent.classList.add('open');
            parent = parent.parentElement.closest('.sidebar-group, .sidebar-subgroup');
        }
    }
}


document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-section');
        history.pushState(null, '', '#' + target);
        showSection(target);

        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    });
});


window.addEventListener('DOMContentLoaded', () => {
    showSection(getHashSection());
});


window.addEventListener('popstate', () => {
    showSection(getHashSection());
});
