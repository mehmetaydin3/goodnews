import { useRef, useState, useEffect, useCallback } from 'react';
import styles from './AudioPreview.module.css';

const BAR_COUNT = 40;

/**
 * Seeded pseudo-random number generator (mulberry32).
 * Returns a function that produces floats in [0, 1).
 */
function seededRng(seed) {
  let s = seed >>> 0;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

function generateWaveform(title) {
  const rng = seededRng(hashString(title || 'default'));
  return Array.from({ length: BAR_COUNT }, () => {
    // Bias toward mid-range heights for a natural-looking waveform
    const base = rng();
    const shaped = 0.15 + base * 0.75;
    return shaped;
  });
}

function formatTime(seconds) {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioPreview({
  src,
  duration,
  title = 'Audio Preview',
  waveformData,
  className = '',
  ...props
}) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const bars = waveformData && waveformData.length === BAR_COUNT
    ? waveformData
    : generateWaveform(title);

  // Sync audio element src
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setPlaying(false);
    setCurrentTime(0);
    setTotalDuration(0);
    setError(false);
  }, [src]);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setTotalDuration(audio.duration);
    setLoading(false);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  }, []);

  const handleEnded = useCallback(() => {
    setPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    setLoading(false);
    setPlaying(false);
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || error) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      setLoading(true);
      try {
        await audio.play();
        setPlaying(true);
        setLoading(false);
      } catch {
        setLoading(false);
        setError(true);
      }
    }
  }, [playing, error]);

  const seekToBar = useCallback((index) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(audio.duration) || audio.duration === 0) return;
    const fraction = index / BAR_COUNT;
    audio.currentTime = fraction * audio.duration;
    setCurrentTime(audio.currentTime);
  }, []);

  // Determine progress fraction
  const progressFraction =
    totalDuration > 0 ? currentTime / totalDuration : 0;
  const playedBars = Math.round(progressFraction * BAR_COUNT);

  // Display time: prefer live currentTime, fallback to duration prop string
  const displayTime = totalDuration > 0
    ? formatTime(currentTime)
    : '0:00';
  const displayDuration = totalDuration > 0
    ? formatTime(totalDuration)
    : duration || '—';

  return (
    <div
      className={[styles.container, className].filter(Boolean).join(' ')}
      role="region"
      aria-label={`Audio preview: ${title}`}
      {...props}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        aria-hidden="true"
      />

      {/* Play / Pause button */}
      <button
        type="button"
        className={[styles.playBtn, playing ? styles.playing : ''].filter(Boolean).join(' ')}
        onClick={togglePlay}
        aria-label={playing ? 'Pause' : 'Play'}
        disabled={error}
      >
        {loading ? (
          <span className={styles.loadingSpinner} aria-hidden="true" />
        ) : playing ? (
          <PauseIcon />
        ) : (
          <PlayIcon />
        )}
      </button>

      {/* Waveform + time */}
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <span className={styles.titleText}>{title}</span>
        </div>
        <div className={styles.waveformRow}>
          {/* Waveform wrapper with absolute input for keyboard seeking */}
          <div className={styles.waveformContainer}>
            <input
              type="range"
              min="0"
              max={BAR_COUNT - 1}
              step="1"
              value={Math.min(BAR_COUNT - 1, playedBars)}
              onChange={(e) => seekToBar(Number(e.target.value))}
              className={styles.visuallyHiddenRange}
              aria-label="Seek waveform"
            />
            <div
              className={styles.waveform}
              aria-hidden="true"
              role="presentation"
            >
              {bars.map((height, i) => (
                <button
                  key={i}
                  type="button"
                  className={[
                    styles.bar,
                    i < playedBars ? styles.barPlayed : styles.barUnplayed,
                  ].join(' ')}
                  style={{ '--bar-height': `${Math.max(0.1, height) * 100}%` }}
                  onClick={() => seekToBar(i)}
                  tabIndex={-1}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          {/* Time counter */}
          <div className={styles.timeDisplay}>
            {error ? (
              <span className={styles.errorText}>Unavailable</span>
            ) : (
              <>
                <span className={styles.currentTime}>{displayTime}</span>
                <span className={styles.separator}>/</span>
                <span className={styles.totalTime}>{displayDuration}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 2.5L13 8L4 13.5V2.5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
      <rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
    </svg>
  );
}

export default AudioPreview;
