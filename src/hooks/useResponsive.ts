import { useTheme, useMediaQuery, Breakpoint } from '@mui/material';
import { useAppState } from './useAppState';

export function useResponsive() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { layout } = useAppState();

  const getContainerWidth = (): Breakpoint | false => {
    if (isMobile) return false;
    if (isTablet) return 'md';
    switch (layout) {
      case 'compact':
        return 'md';
      case 'comfortable':
        return 'lg';
      default:
        return 'xl';
    }
  };

  const getSpacing = (base: number = 1) => {
    if (isMobile) return base;
    if (isTablet) return base * 2;
    return layout === 'compact' ? base * 2 : base * 3;
  };

  const getFontSize = (base: number = 1) => {
    if (isMobile) return base * 0.875;
    if (isTablet) return base * 0.9375;
    return base;
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    getContainerWidth,
    getSpacing,
    getFontSize,
    layout
  };
} 