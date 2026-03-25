import React, { useEffect, useRef } from 'react';
import { NewsItem } from '../GoodNewsApp';
import styles from './ShareMenu.module.css';

const API_BASE = 'http://localhost:5001/api/goodnews';

interface ShareOption {
  id: string;
  label: string;
  icon: string;
  color: string;
  getUrl: (item: NewsItem) => string | null;
}

const SHARE_OPTIONS: ShareOption[] = [
  {
    id: 'twitter',
    label: 'Post on X',
    icon: '𝕏',
    color: '#000',
    getUrl: (item) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`☀ ${item.title}`)}&url=${encodeURIComponent(item.url)}&via=GoodNewsDaily`,
  },
  {
    id: 'facebook',
    label: 'Share on Facebook',
    icon: 'f',
    color: '#1877f2',
    getUrl: (item) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(item.url)}`,
  },
  {
    id: 'linkedin',
    label: 'Share on LinkedIn',
    icon: 'in',
    color: '#0a66c2',
    getUrl: (item) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(item.url)}`,
  },
  {
    id: 'whatsapp',
    label: 'Send via WhatsApp',
    icon: '●',
    color: '#25d366',
    getUrl: (item) =>
      `https://wa.me/?text=${encodeURIComponent(`☀ ${item.title}\n${item.url}`)}`,
  },
  {
    id: 'reddit',
    label: 'Post to Reddit',
    icon: 'r/',
    color: '#ff4500',
    getUrl: (item) =>
      `https://reddit.com/submit?url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}`,
  },
  {
    id: 'copy',
    label: 'Copy link',
    icon: '⎘',
    color: '#6b7280',
    getUrl: () => null, // handled separately
  },
];

interface Props {
  item: NewsItem;
  onClose: () => void;
}

export function ShareMenu({ item, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const trackShare = async (platform: string) => {
    try {
      await fetch(`${API_BASE}/${item.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });
    } catch {}
  };

  const handleShare = async (opt: ShareOption) => {
    if (opt.id === 'copy') {
      await navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      await trackShare('copy');
      return;
    }
    const url = opt.getUrl(item);
    if (url) {
      window.open(url, '_blank', 'noopener,width=600,height=400');
      await trackShare(opt.id);
    }
    onClose();
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: item.summary, url: item.url });
        await trackShare('native');
        onClose();
      } catch {}
    }
  };

  return (
    <div className={styles.menu} ref={ref}>
      <div className={styles.header}>
        <span>Share this story</span>
        <button className={styles.close} onClick={onClose}>✕</button>
      </div>

      {navigator.share && (
        <button className={styles.nativeShare} onClick={handleNativeShare}>
          ↗ Share via…
        </button>
      )}

      <ul className={styles.list}>
        {SHARE_OPTIONS.map(opt => (
          <li key={opt.id}>
            <button
              className={styles.option}
              onClick={() => handleShare(opt)}
            >
              <span className={styles.icon} style={{ background: opt.color }}>{opt.icon}</span>
              <span>{opt.id === 'copy' && copied ? '✓ Copied!' : opt.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.url}>
        <span className={styles.urlText}>{item.url}</span>
      </div>
    </div>
  );
}
