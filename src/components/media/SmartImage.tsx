import Image, { type ImageProps } from 'next/image';

/**
 * SmartImage — one image primitive for the whole marketplace.
 *
 * Why a custom loader: listing/store photos come back as SHORT-LIVED SIGNED R2
 * URLs (a fresh signature every request). Feeding those to Vercel's optimizer
 * would cache-miss on every render and burn the optimization quota, so for
 * signed/remote URLs we pass the URL straight through (loader returns it
 * unchanged) — we still keep next/image's lazy-loading, priority hint, async
 * decode, blur-up and zero-layout-shift behaviour, just without re-encoding.
 *
 * Stable CDN assets (assets.sovdigitalgroup.com) ARE optimized normally, so the
 * day listing images move to a public bucket this component upgrades for free.
 */

const passthrough = ({ src }: { src: string }) => src;

// Neutral blur used as the placeholder shimmer base.
const BLUR =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#d9d9d6"/></svg>`,
  ).toString('base64');

function isOptimizable(src: string) {
  return /(?:^|\.)assets\.sovdigitalgroup\.com\//.test(src) && !src.includes('?');
}

export type SmartImageProps = Omit<ImageProps, 'loader' | 'placeholder' | 'blurDataURL'> & {
  src: string;
};

export function SmartImage({ src, alt, ...rest }: SmartImageProps) {
  const optimize = isOptimizable(src);
  return (
    <Image
      src={src}
      alt={alt}
      loader={optimize ? undefined : passthrough}
      unoptimized={!optimize}
      placeholder="blur"
      blurDataURL={BLUR}
      {...rest}
    />
  );
}
