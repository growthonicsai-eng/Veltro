import { useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';

// Scrolls to the top on page change, or to the matching element when the URL has a #hash
// (e.g. /about#meet-the-team). Works for same-page hash clicks too.
const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useLayoutEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            return;
        }
        const id = decodeURIComponent(hash.slice(1));
        let tries = 0;
        let timer;
        const go = () => {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (tries++ < 20) {
                timer = setTimeout(go, 50); // wait for the page to render
            }
        };
        go();
        return () => clearTimeout(timer);
    }, [pathname, hash]);

    return null;
}

export default ScrollToTop;
