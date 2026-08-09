(() => {
    const mq = window.matchMedia('(max-width: 600px)');
    const controls = document.getElementById('controls-panel');
    const btnGroup = controls ? controls.querySelector('.btn-group') : null;
    const filters = controls ? controls.querySelector('.filters') : null;
    const sidebar = document.querySelector('.sidebar');
    const legendHeading = sidebar ? sidebar.querySelector('h3') : null;
    const timelineToggle = document.getElementById('timeline-toggle-btn');
    const visualization = document.getElementById('visualization');

    let toolsButton = null;

    function redrawTimelineForMobile() {
        if (!mq.matches || !visualization || !visualization.classList.contains('mobile-visible')) return;
        const h = Math.max(260, Math.min(360, Math.round(window.innerHeight * 0.42)));
        try {
            if (typeof timeline !== 'undefined' && timeline) {
                timeline.setOptions({ height: h + 'px' });
                timeline.redraw();
            }
        } catch (_) {}
    }

    function setToolsOpen(open) {
        if (!controls || !toolsButton) return;
        controls.classList.toggle('mobile-tools-open', open);
        toolsButton.setAttribute('aria-expanded', String(open));
        toolsButton.innerHTML = open
            ? '<i class="fas fa-chevron-up"></i> Dölj filter & verktyg'
            : '<i class="fas fa-sliders-h"></i> Filter & verktyg';
    }

    if (controls && btnGroup && filters) {
        toolsButton = document.createElement('button');
        toolsButton.type = 'button';
        toolsButton.className = 'secondary mobile-filter-toggle';
        toolsButton.setAttribute('aria-expanded', 'false');
        toolsButton.innerHTML = '<i class="fas fa-sliders-h"></i> Filter & verktyg';
        controls.insertBefore(toolsButton, btnGroup);
        toolsButton.addEventListener('click', () => {
            setToolsOpen(!controls.classList.contains('mobile-tools-open'));
        });
    }

    function setLegendCollapsed(collapsed) {
        if (!sidebar || !legendHeading) return;
        sidebar.classList.toggle('mobile-collapsed', collapsed);
        legendHeading.setAttribute('aria-expanded', String(!collapsed));
    }

    if (sidebar && legendHeading) {
        legendHeading.classList.add('legend-toggle-heading');
        legendHeading.setAttribute('role', 'button');
        legendHeading.setAttribute('tabindex', '0');
        legendHeading.setAttribute('aria-controls', 'legend-container');

        const toggleLegend = () => setLegendCollapsed(!sidebar.classList.contains('mobile-collapsed'));
        legendHeading.addEventListener('click', toggleLegend);
        legendHeading.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleLegend();
            }
        });
    }

    if (timelineToggle) {
        timelineToggle.addEventListener('click', () => {
            setTimeout(redrawTimelineForMobile, 120);
        });
    }

    function applyMode() {
        if (mq.matches) {
            setToolsOpen(false);
            setLegendCollapsed(true);
            if (visualization && !visualization.classList.contains('mobile-visible')) {
                // befintlig mobilfunktion håller tidslinjen stängd tills användaren öppnar den
            } else {
                redrawTimelineForMobile();
            }
        } else {
            if (controls) controls.classList.remove('mobile-tools-open');
            if (sidebar) sidebar.classList.remove('mobile-collapsed');
            if (legendHeading) legendHeading.setAttribute('aria-expanded', 'true');
            try {
                if (typeof timeline !== 'undefined' && timeline && !document.fullscreenElement) {
                    timeline.setOptions({ height: '500px' });
                    timeline.redraw();
                }
            } catch (_) {}
        }
    }

    mq.addEventListener ? mq.addEventListener('change', applyMode) : mq.addListener(applyMode);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(redrawTimelineForMobile, 120);
    });

    applyMode();
    setTimeout(redrawTimelineForMobile, 180);
})();
