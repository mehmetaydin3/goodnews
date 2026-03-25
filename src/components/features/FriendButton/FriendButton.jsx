import React from 'react';
import { Button } from '../../ui/Button/Button';
import styles from './FriendButton.module.css';

/**
 * FriendButton component to handle networking states
 * @param {Object} props
 * @param {'none' | 'pending' | 'friends'} props.status - The current friendship status
 * @param {Function} props.onClick - Handler for state changes
 */
export function FriendButton({ status = 'none', onClick, className = '' }) {
  const getButtonConfig = () => {
    switch (status) {
      case 'friends':
        return {
          variant: 'secondary',
          label: 'Friends',
          leftIcon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ),
        };
      case 'pending':
        return {
          variant: 'outline',
          label: 'Requested',
          leftIcon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          ),
        };
      case 'none':
      default:
        return {
          variant: 'primary',
          label: 'Add Friend',
          leftIcon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="17" y1="11" x2="23" y2="11"></line>
            </svg>
          ),
        };
    }
  };

  const config = getButtonConfig();

  return (
    <Button
      variant={config.variant}
      leftIcon={config.leftIcon}
      onClick={onClick}
      className={`${styles.friendButton} ${styles[status]} ${className}`}
    >
      {config.label}
    </Button>
  );
}

export default FriendButton;
