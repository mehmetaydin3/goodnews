import React, { useState } from 'react';
import { FriendButton } from './FriendButton';

export default {
  title: 'Design System/FriendButton',
  component: FriendButton,
};

export const States = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <div>
        <h4>Add Friend (None)</h4>
        <FriendButton status="none" />
      </div>
      <div>
        <h4>Requested (Pending)</h4>
        <FriendButton status="pending" />
      </div>
      <div>
        <h4>Friends (Friends)</h4>
        <FriendButton status="friends" />
      </div>
    </div>
  );
};

export const Interactive = () => {
  const [status, setStatus] = useState('none');
  
  const handleClick = () => {
    if (status === 'none') setStatus('pending');
    else if (status === 'pending') setStatus('friends');
    else setStatus('none');
  };

  return (
    <div style={{ padding: '20px' }}>
      <FriendButton status={status} onClick={handleClick} />
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        Current Status: <strong>{status}</strong> (Click to cycle)
      </p>
    </div>
  );
};
