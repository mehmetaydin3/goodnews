import { useState, useEffect } from 'react';
import styles from './RotatingText.module.css';

export function RotatingText({ 
  words = [], 
  interval = 3000,
  className = '' 
}) {
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (words.length <= 1) return;

    const timer = setInterval(() => {
      setIsFading(true);
      
      // Wait for fade out animation
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsFading(false);
      }, 500); // This should match the CSS transition duration
      
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  if (!words.length) return null;

  return (
    <span 
      className={[
        styles.rotatingText, 
        isFading ? styles.fadeOut : styles.fadeIn,
        className
      ].filter(Boolean).join(' ')}
    >
      {words[index]}
    </span>
  );
}

export default RotatingText;
