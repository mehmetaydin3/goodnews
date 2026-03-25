import React from 'react';
import { HeroSection } from '../../features/HeroSection/HeroSection';
import { ContextBlock } from '../../features/ContextBlock/ContextBlock';
import { FeatureSpotlight } from '../../features/FeatureSpotlight/FeatureSpotlight';
import { MetricsGrid } from '../../features/MetricsGrid/MetricsGrid';
import { MusicianListingPage } from '../MusicianListingPage/MusicianListingPage';
import styles from './LandingPage.module.css';

export function LandingPage({
  heroProps,
  contextProps,
  opportunityProps,
  architectureProps,
  featureCardsProps,
  primaryFeatureProps,
  secondaryFeatureProps,
  uiShowcaseProps,
  metricsProps,
  reflectionProps,
  listingProps,
  className = '',
  ...props
}) {
  return (
    <div className={[styles.page, className].filter(Boolean).join(' ')} {...props}>
      {/* 1. Hero */}
      <HeroSection {...heroProps} />
      
      <div className={styles.sectionDivider} />

      {/* 2. Context */}
      <ContextBlock {...contextProps} />
      
      <div className={styles.sectionDivider} />

      {/* 3. Opportunity */}
      {opportunityProps && (
        <ContextBlock 
          className={styles.opportunity} 
          pullQuote={opportunityProps.quote} 
          text={opportunityProps.text} 
        />
      )}
      
      <div className={styles.sectionDivider} />

      {/* 4. Architecture */}
      <FeatureSpotlight 
        title={architectureProps?.title || "System Architecture"}
        description={architectureProps?.description || "A modular approach to musician selection and booking."}
        imageSrc={architectureProps?.imageSrc}
        {...architectureProps}
      />
      
      <div className={styles.sectionDivider} />

      {/* 5. Feature Spotlight (Primary) */}
      <FeatureSpotlight {...primaryFeatureProps} reverse />
      
      <div className={styles.sectionDivider} />

      {/* 6. UI Showcase / Secondary Feature */}
      <FeatureSpotlight 
        title={uiShowcaseProps?.title || "Immersive Interface"}
        description={uiShowcaseProps?.description || "High-fidelity screens designed for clarity and ease of use."}
        imageSrc={uiShowcaseProps?.imageSrc}
        {...uiShowcaseProps}
      />
      
      <div className={styles.sectionDivider} />

      {/* 7. Metrics */}
      <MetricsGrid {...metricsProps} />
      
      <div className={styles.sectionDivider} />

      {/* 8. Reflection / Closing */}
      {reflectionProps && (
        <ContextBlock 
          className={styles.reflection} 
          text={reflectionProps.text} 
        />
      )}

      {/* Integrated Listing Section (Optional enhancement) */}
      {listingProps && listingProps.musicians && (
        <>
          <div className={styles.sectionDivider} />
          <MusicianListingPage {...listingProps} />
        </>
      )}
    </div>
  );
}

export default LandingPage;
