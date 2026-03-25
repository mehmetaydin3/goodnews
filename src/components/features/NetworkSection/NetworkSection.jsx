import React from 'react';
import { Avatar } from '../../ui/Avatar/Avatar';
import styles from './NetworkSection.module.css';

/**
 * NetworkSection component to display musician connections
 * @param {Object} props
 * @param {Array} props.friends - Array of friend objects { id, name, avatarSrc, tagline }
 */
export function NetworkSection({ friends = [] }) {
  if (friends.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>Professional Network</h3>
        <span className={styles.count}>{friends.length} connections</span>
      </div>
      
      <div className={styles.grid}>
        {friends.map((friend) => (
          <div key={friend.id} className={styles.friendCard}>
            <Avatar 
              src={friend.avatarSrc} 
              name={friend.name} 
              size="lg" 
              className={styles.avatar}
            />
            <div className={styles.info}>
              <h4 className={styles.name}>{friend.name}</h4>
              <p className={styles.tagline}>{friend.tagline}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className={styles.viewAll}>
        View full network
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </section>
  );
}

export default NetworkSection;
