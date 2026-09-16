"use client";

import React, { useState } from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ className = "", showWordmark = true }: LogoProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {!imgError ? (
        <div className="relative w-5 h-5 flex items-center justify-center">
          <Image
            src="/logo/vantor-logo.svg"
            alt="VANTOR"
            width={20}
            height={20}
            onError={() => setImgError(true)}
            priority
          />
        </div>
      ) : null}

      {showWordmark && (
        <span className="font-mono-tech font-bold text-xs tracking-[0.25em] text-[#F1F1EE] uppercase select-none">
          VANTOR
        </span>
      )}
    </div>
  );
}
