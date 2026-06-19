'use client';

import React from 'react';
import Link from 'next/link';

interface PageHeadingProps {
  title: string;
  breadcrumbs?: { label: string; href: string }[];
}

export default function PageHeading({ title, breadcrumbs }: PageHeadingProps) {
  return (
    <section
      id="page-heading"
      className="relative flex flex-col items-center justify-center h-64 md:h-[28rem] w-full text-center"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url("/img/Icons/Page-heading.svg")',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="space-y-4 px-4">
        <h2 className="text-4xl md:text-6xl font-semibold font-cormorant text-white tracking-wider uppercase">
          {title}
        </h2>
        {breadcrumbs && (
          <nav className="flex justify-center items-center gap-2 text-xs md:text-sm font-manrope font-medium text-white/50">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span>/</span>
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-primary font-semibold">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
