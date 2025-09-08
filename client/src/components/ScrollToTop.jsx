import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, search, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            // If there's an anchor hash, let the browser handle it after a tick
            setTimeout(() => {
                const el = document.querySelector(hash);
                if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
                else { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }
            }, 0);
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
    }, [pathname, search, hash]);

    return null;
};

export default ScrollToTop;


