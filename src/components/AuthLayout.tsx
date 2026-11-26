import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-140px)] max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2">
      {/* Left Glass Form Card on White */}
      <div className="mx-auto w-full max-w-md">
        <div className="glass-panel rounded-[28px] p-6 sm:p-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#171717] font-heading text-sm font-semibold text-white">
              P
            </span>
            <span className="font-heading text-base font-semibold text-[#171717]">ParkEase</span>
          </Link>

          <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-[#171717]">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#737373]">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </div>
      </div>

      {/* Right Photographic Panel (hidden below 1024px) */}
      <div className="hidden lg:block">
        <div className="photo-frame overflow-hidden rounded-[30px]">
          <img
            src="/images/street-plaza.jpg"
            alt="Modern glass plaza and covered parking entrance"
            className="h-[600px] w-full rounded-[28px] object-cover"
          />
        </div>
      </div>
    </div>
  );
}
