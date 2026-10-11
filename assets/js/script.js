(() => {
    "use strict";

    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    const content = document.getElementById("content");

    const sections = Array.from(
        document.querySelectorAll(".content-section")
    );

    const sectionIds = new Set(
        sections.map(section => section.id)
    );

    const navigationLinks = document.querySelectorAll(
        "[data-section]"
    );

    const groupButtons = document.querySelectorAll(
        ".sidebar-group-toggle"
    );

    const mobileQuery = window.matchMedia("(max-width: 768px)");

    function getCurrentSection() {
        let hash = "";

        try {
            hash = decodeURIComponent(
                window.location.hash.slice(1)
            );
        } catch {
            hash = window.location.hash.slice(1);
        }

        return sectionIds.has(hash) ? hash : "welcome";
    }


    function closeSidebar() {
        if (!sidebar || !menuToggle || !backdrop) {
            return;
        }

        sidebar.classList.remove("open");
        menuToggle.classList.remove("open");
        backdrop.classList.remove("show");

        menuToggle.setAttribute("aria-expanded", "false");
    }


    function toggleSidebar() {
        if (!sidebar || !menuToggle || !backdrop) {
            return;
        }

        const shouldOpen = !sidebar.classList.contains("open");

        sidebar.classList.toggle("open", shouldOpen);
        menuToggle.classList.toggle("open", shouldOpen);
        backdrop.classList.toggle("show", shouldOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(shouldOpen)
        );
    }


    function expandActiveGroups(sectionId) {
        const activeLink = document.querySelector(
            `.sidebar [data-section="${sectionId}"]`
        );

        if (!activeLink) {
            return;
        }

        let parent = activeLink.parentElement;

        while (parent && parent !== sidebar) {
            if (
                parent.classList.contains("sidebar-group") ||
                parent.classList.contains("sidebar-subgroup")
            ) {
                parent.classList.add("open");

                const button = parent.querySelector(
                    ":scope > .sidebar-group-toggle"
                );

                if (button) {
                    button.setAttribute("aria-expanded", "true");
                }
            }

            parent = parent.parentElement;
        }
    }

    function renderSection(sectionId) {
        const selectedId = sectionIds.has(sectionId)
            ? sectionId
            : "welcome";

        sections.forEach(section => {
            const isActive = section.id === selectedId;

            section.classList.toggle("is-active", isActive);
            section.setAttribute(
                "aria-hidden",
                String(!isActive)
            );
        });

        navigationLinks.forEach(link => {
            const isActive =
                link.dataset.section === selectedId;

            link.classList.toggle("active", isActive);

            if (link.matches(".sidebar-link, .sidebar-sublink, .top-links a")) {
                if (isActive) {
                    link.setAttribute("aria-current", "page");
                } else {
                    link.removeAttribute("aria-current");
                }
            }
        });

        expandActiveGroups(selectedId);


        if (content) {
            content.scrollTop = 0;
            content.scrollLeft = 0;
        }

        if (mobileQuery.matches) {
            closeSidebar();
        }
    }

    function navigateTo(sectionId) {
        if (!sectionIds.has(sectionId)) {
            return;
        }

        const newHash = "#" + encodeURIComponent(sectionId);

        if (window.location.hash !== newHash) {
            window.history.pushState(
                { section: sectionId },
                "",
                newHash
            );
        }

        renderSection(sectionId);
    }


    document.addEventListener("click", event => {
        const link = event.target.closest("a[data-section]");

        if (!link || event.defaultPrevented) {
            return;
        }

        if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        if (link.hasAttribute("target")) {
            return;
        }

        const sectionId = link.dataset.section;

        if (!sectionIds.has(sectionId)) {
            return;
        }

        event.preventDefault();
        navigateTo(sectionId);
    });


    groupButtons.forEach(button => {
        button.addEventListener("click", () => {
            const group = button.parentElement;

            if (!group) {
                return;
            }

            const isOpen = group.classList.toggle("open");

            button.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    });


    if (menuToggle) {
        menuToggle.addEventListener("click", toggleSidebar);
    }

    if (backdrop) {
        backdrop.addEventListener("click", closeSidebar);
    }


    window.addEventListener("popstate", () => {
        renderSection(getCurrentSection());
    });

 
    window.addEventListener("hashchange", () => {
        renderSection(getCurrentSection());
    });


    mobileQuery.addEventListener("change", event => {
        if (!event.matches) {
            closeSidebar();
        }
    });

    window.addEventListener("pageshow", () => {
        renderSection(getCurrentSection());

        if (document.documentElement.scrollTop !== 0) {
            window.scrollTo(0, 0);
        }
    });

    if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
    renderSection(getCurrentSection());
})();