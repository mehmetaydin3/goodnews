import React from 'react';
import { NetworkSection } from './NetworkSection';
import { musiciansData } from '../../../mocks/musicians';

export default {
  title: 'Design System/NetworkSection',
  component: NetworkSection,
};

export const Default = () => {
  // Use first 4 musicians from mock data as friends
  const mockFriends = musiciansData.slice(0, 4);
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#f9fafb' }}>
      <NetworkSection friends={mockFriends} />
    </div>
  );
};

export const FewFriends = () => {
  const mockFriends = musiciansData.slice(0, 2);
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#f9fafb' }}>
      <NetworkSection friends={mockFriends} />
    </div>
  );
};
