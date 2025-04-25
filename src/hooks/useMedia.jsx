import { useMediaQuery } from 'react-responsive';

export const useMedia = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 767.98px)' });
    const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1279px)' });
    const isDesktop = useMediaQuery({ query: '(min-width: 1280px)' });
    return { isMobile, isTablet, isDesktop };
}