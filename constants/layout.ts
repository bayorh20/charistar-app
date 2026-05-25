export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

export const WEB = {
  maxContentWidth: 1280,
  sidebarWidth: 260,
  authMaxWidth: 480,
};

/** Portrait phone frame for centered web preview (width × height ratio). */
export const APP_FRAME = {
  maxWidth: 430,
  /** width / height — e.g. 9:19.5 iPhone-like portrait */
  aspectRatio: 9 / 19.5,
};

/** Product card image width / height */
export const PRODUCT_IMAGE_ASPECT = 4 / 5;

/** Home hero banner width / height */
export const HERO_ASPECT = 16 / 9;
export const HERO_ASPECT_DESKTOP = 21 / 9;

/** White pill bar height */
export const TAB_BAR_HEIGHT = 64;

/** Green cart FAB diameter */
export const TAB_BAR_CART_SIZE = 56;

/** How far the cart button rises above the pill bar */
export const TAB_BAR_CART_LIFT = 22;

/** Total bottom chrome: bar + cart protrusion + breathing room */
export const FLOATING_TAB_BAR_HEIGHT =
  TAB_BAR_HEIGHT + TAB_BAR_CART_LIFT + 16;

export const WEB_SAFE_TOP = 16;
export const WEB_SAFE_BOTTOM = 12;

export const STACK_FOOTER_HEIGHT = 88;
