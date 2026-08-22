/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { FooterSocialLink, LandingPageConfig } from '../types';

export interface SocialPlatformOption {
  id: FooterSocialLink['platform'];
  nameAr: string;
  nameEn: string;
  placeholder: string;
  defaultTitleAr: string;
  defaultTitleEn: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformOption[] = [
  { id: 'facebook', nameAr: 'فيسبوك (Facebook)', nameEn: 'Facebook', placeholder: 'https://facebook.com/yourpage', defaultTitleAr: 'فيسبوك', defaultTitleEn: 'Facebook' },
  { id: 'instagram', nameAr: 'إنستغرام (Instagram)', nameEn: 'Instagram', placeholder: 'https://instagram.com/yourprofile', defaultTitleAr: 'إنستغرام', defaultTitleEn: 'Instagram' },
  { id: 'x', nameAr: 'منصة إكس / تويتر (X / Twitter)', nameEn: 'X (Twitter)', placeholder: 'https://x.com/youraccount', defaultTitleAr: 'إكس (تويتر)', defaultTitleEn: 'X' },
  { id: 'linkedin', nameAr: 'لينكد إن (LinkedIn)', nameEn: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile', defaultTitleAr: 'لينكد إن', defaultTitleEn: 'LinkedIn' },
  { id: 'youtube', nameAr: 'يوتيوب (YouTube)', nameEn: 'YouTube', placeholder: 'https://youtube.com/@yourchannel', defaultTitleAr: 'يوتيوب', defaultTitleEn: 'YouTube' },
  { id: 'tiktok', nameAr: 'تيك توك (TikTok)', nameEn: 'TikTok', placeholder: 'https://tiktok.com/@youraccount', defaultTitleAr: 'تيك توك', defaultTitleEn: 'TikTok' },
  { id: 'whatsapp', nameAr: 'واتساب (WhatsApp)', nameEn: 'WhatsApp', placeholder: 'https://wa.me/201XXXXXXXXX', defaultTitleAr: 'واتساب', defaultTitleEn: 'WhatsApp' },
  { id: 'telegram', nameAr: 'تيليجرام (Telegram)', nameEn: 'Telegram', placeholder: 'https://t.me/yourusername', defaultTitleAr: 'تيليجرام', defaultTitleEn: 'Telegram' },
  { id: 'snapchat', nameAr: 'سناب شات (Snapchat)', nameEn: 'Snapchat', placeholder: 'https://snapchat.com/add/yourusername', defaultTitleAr: 'سناب شات', defaultTitleEn: 'Snapchat' },
  { id: 'website', nameAr: 'موقع إلكتروني (Website)', nameEn: 'Website', placeholder: 'https://yourwebsite.com', defaultTitleAr: 'الموقع الإلكتروني', defaultTitleEn: 'Website' },
  { id: 'other', nameAr: 'رابط / موقع آخر (Other Link)', nameEn: 'Other Link', placeholder: 'https://...', defaultTitleAr: 'رابط إضافي', defaultTitleEn: 'Link' }
];

export function SocialIcon({ platform, className = "w-5 h-5" }: { platform?: string; className?: string }) {
  const p = (platform || '').toLowerCase();

  switch (p) {
    case 'facebook':
      return (
        <svg className={`${className} fill-current`} viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className={`${className} fill-current`} viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    case 'x':
    case 'twitter':
      return (
        <svg className={`${className} fill-current`} viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={`${className} fill-current`} viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg className={`${className} fill-current`} viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg className={`${className} fill-current`} viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.72 1.29-.02 2.45-.84 2.87-2.06.18-.47.24-.98.24-1.48.02-4.99 0-9.98.01-14.97z"/>
        </svg>
      );
    case 'whatsapp':
      return (
        <svg className={`${className} fill-current`} viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      );
    case 'telegram':
      return (
        <svg className={`${className} fill-current`} viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.941z"/>
        </svg>
      );
    case 'snapchat':
      return (
        <svg className={`${className} fill-current`} viewBox="0 0 24 24">
          <path d="M12.04 0c-4.8 0-7.84 3.32-7.84 6.8 0 1.95.73 3.52 1.35 4.46.12.18.17.38.1.59-.14.43-.72.82-1.39 1.05-.33.11-.53.4-.49.75.05.41.36.72.76.75 1.13.08 1.96.6 2.37 1.48.24.52.54.99.93 1.39-1.09.28-2.61.85-3.32 1.98-.37.59-.19 1.37.4 1.74.22.14.47.21.72.21.36 0 .71-.15.96-.43.51-.57 1.62-.99 3.01-1.17.65 1.07 1.74 1.74 2.94 1.74 1.2 0 2.29-.67 2.94-1.74 1.39.18 2.5.6 3.01 1.17.25.28.6.43.96.43.25 0 .5-.07.72-.21.59-.37.77-1.15.4-1.74-.71-1.13-2.23-1.7-3.32-1.98.39-.4.69-.87.93-1.39.41-.88 1.24-1.4 2.37-1.48.4-.03.71-.34.76-.75.04-.35-.16-.64-.49-.75-.67-.23-1.25-.62-1.39-1.05-.07-.21-.02-.41.1-.59.62-.94 1.35-2.51 1.35-4.46 0-3.48-3.04-6.8-7.84-6.8z"/>
        </svg>
      );
    case 'website':
      return <Globe className={className} />;
    default:
      return <LinkIcon className={className} />;
  }
}

export function getEffectiveSocialLinks(footerConfig?: LandingPageConfig['footer']): FooterSocialLink[] {
  if (footerConfig?.socialLinks && Array.isArray(footerConfig.socialLinks) && footerConfig.socialLinks.length > 0) {
    return footerConfig.socialLinks.filter(item => item.enabled !== false && item.url && item.url.trim() !== '');
  }

  // Backwards compatibility fallback from legacy single fields
  const fallbackLinks: FooterSocialLink[] = [];
  if (footerConfig?.facebookUrl) {
    fallbackLinks.push({ id: 'fb', platform: 'facebook', title: 'فيسبوك', url: footerConfig.facebookUrl, enabled: true });
  }
  if (footerConfig?.instagramUrl) {
    fallbackLinks.push({ id: 'ig', platform: 'instagram', title: 'إنستغرام', url: footerConfig.instagramUrl, enabled: true });
  }
  if (footerConfig?.linkedinUrl) {
    fallbackLinks.push({ id: 'li', platform: 'linkedin', title: 'لينكد إن', url: footerConfig.linkedinUrl, enabled: true });
  }
  if (footerConfig?.youtubeUrl) {
    fallbackLinks.push({ id: 'yt', platform: 'youtube', title: 'يوتيوب', url: footerConfig.youtubeUrl, enabled: true });
  }

  if (fallbackLinks.length === 0) {
    return [
      { id: 'soc_fb', platform: 'facebook', title: 'فيسبوك', url: 'https://facebook.com', enabled: true },
      { id: 'soc_x', platform: 'x', title: 'إكس (تويتر)', url: 'https://x.com', enabled: true },
      { id: 'soc_ig', platform: 'instagram', title: 'إنستغرام', url: 'https://instagram.com', enabled: true },
      { id: 'soc_li', platform: 'linkedin', title: 'لينكد إن', url: 'https://linkedin.com', enabled: true },
      { id: 'soc_yt', platform: 'youtube', title: 'يوتيوب', url: 'https://youtube.com', enabled: true },
    ];
  }

  return fallbackLinks;
}
