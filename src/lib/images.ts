// Tiny inline SVG used as the `blurDataURL` for next/image's blur-up
// placeholder (Rule: blur placeholder generation). Real photography should
// eventually get a per-image generated blur hash (e.g. via `plaiceholder`
// at upload time); this shared, brand-tinted placeholder covers the
// hand-authored SVG illustrations in the meantime and costs nothing to
// compute since it's static.
export const BLUR_DATA_URL =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='6'%3E%3Crect width='8' height='6' fill='%23e2ebde'/%3E%3C/svg%3E";
