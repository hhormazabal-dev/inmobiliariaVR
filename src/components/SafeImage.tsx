"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { FALLBACK_IMAGE_DATA } from "@/lib/fallbackImage";

type SafeImageProps = ImageProps & {
  fallbackSrc?: ImageProps["src"];
};

export default function SafeImage({
  src,
  fallbackSrc = FALLBACK_IMAGE_DATA,
  onError,
  alt,
  ...rest
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<ImageProps["src"]>(src);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasFailed(false);
  }, [src]);

  const effectiveSrc = hasFailed ? fallbackSrc : currentSrc;
  const shouldBypassOptimizer =
    typeof effectiveSrc === "string" && /^https?:\/\//i.test(effectiveSrc);

  return (
    <Image
      {...rest}
      unoptimized={shouldBypassOptimizer}
      src={effectiveSrc}
      alt={alt}
      onError={(event) => {
        if (!hasFailed) {
          setHasFailed(true);
        }
        onError?.(event);
      }}
    />
  );
}
