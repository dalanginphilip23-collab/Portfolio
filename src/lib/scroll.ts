/** Shared smooth-scroll helper — single source for nav/footer/hero offsets. */
export const SCROLL_OFFSET = 100;

export function scrollToId(targetId: string, offset = SCROLL_OFFSET): void {
  const elem = document.getElementById(targetId.replace('#', ''));
  if (!elem) return;
  const top = elem.getBoundingClientRect().top + window.pageYOffset - offset;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo({ top });
  } else {
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export function handleAnchorScroll(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  offset = SCROLL_OFFSET,
  after?: () => void,
): void {
  e.preventDefault();
  scrollToId(href, offset);
  after?.();
}
