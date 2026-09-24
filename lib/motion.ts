/* Shared easing + timing so every animation on the site feels related. */

/** Expressive ease-out. The house curve — used for nearly every reveal. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Symmetrical ease for things that move both ways (menus, curtains). */
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

/** How long the opening curtain holds before the page is interactive. */
export const INTRO_MS = 2000;

/** Viewport config for scroll reveals: fire once, slightly before centre. */
export const IN_VIEW = { once: true, margin: "-12% 0px -12% 0px" } as const;
