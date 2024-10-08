'use client';

import { logEventSimple } from '@/utils/gtag';
import { usePathname } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

export default function useSocialShare() {
  const path = usePathname();

  const [fullPathShare, setFullPathShare] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setFullPathShare(`${window.location.origin}${path}`);
  }, [path]);

  const open = (url: string) => {
    window.open(url, '_blank');
  };

  const shareOnX = (text: string, url: string = fullPathShare, via = 'alibuda_builder') => {
    const shareUrl = new URL('https://twitter.com/intent/tweet');
    shareUrl.searchParams.set('text', text);
    shareUrl.searchParams.set('via', via);
    shareUrl.searchParams.set('url', url);
    open(shareUrl.toString());
    logEventSimple({ eventName: 'click_facaster_share', category: 'share' });
  };

  const shareOnTelegram = (text: string, url: string = fullPathShare) => {
    const shareUrl = new URL('https://t.me/share/url');
    shareUrl.searchParams.set('url', url);
    shareUrl.searchParams.set('text', text);
    open(shareUrl.toString());
  };

  const shareOnFarcaster = (text: string, url: string = fullPathShare) => {
    const shareParams = {
      text: text,
      'embeds[]': url,
    };

    const shareUrl = queryString.stringifyUrl(
      { url: 'https://warpcast.com/~/compose', query: shareParams },
      { sort: false },
    );

    window.open(shareUrl, '_blank');
    logEventSimple({ eventName: 'click_farcaster_share', category: 'share' });
  };

  return {
    shareOnX,
    shareOnTelegram,
    shareOnFarcaster,
  };
}
