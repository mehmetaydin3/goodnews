import { LandingPage } from './LandingPage';
import { musiciansData } from '../../../mocks/musicians';

export default {
  title: 'Pages/LandingPage',
  component: LandingPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export const PortfolioStyle = {
  args: {
    heroProps: {
      headline: "The Premium Network for Modern Musicians.",
      subheadline: "Connect, collaborate, and create with the world's most talented independent artists, producers, and engineers.",
      metadata: ["Role: Network", "Timeline: 2024", "Platform: Web/Mobile", "Screens: 24+"],
      imageSrc: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
    },
    contextProps: {
      text: "Finding the right sound shouldn't require compromising your vision. We built a design system and platform that treats musicians like the professionals they are, providing clear, immersive discovery and a modular approach to service selection.",
    },
    opportunityProps: {
      quote: "I don't know what guidance applies to me anymore. I just want to find a cellist who gets my vibe.",
      text: "The music industry often lacks transparency. For creators hiring talent, the process is fragmented across social DMs and generic platforms. There’s a massive opportunity to create an 'audio-first' marketplace that prioritizes sonic quality and verified professionalism.",
    },
    architectureProps: {
      title: "Modular Component Architecture",
      description: "We designed a robust system of atomic components—from Audio Previews to Booking Drawers—ensuring that every interaction feels premium and consistent across the entire user journey.",
      imageSrc: "https://images.unsplash.com/photo-1516280440502-a2f0088cb395?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    },
    primaryFeatureProps: {
      title: "Audio-First Discovery",
      description: "The work speaks for itself. Immersive audio previews with integrated waveform data allow you to hear exactly what a musician brings to the table before you ever look at their resume.",
      imageSrc: "https://images.unsplash.com/photo-1550029003-080373df829f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    },
    uiShowcaseProps: {
      title: "Immersive UI Showcase",
      description: "Our interface design focuses on density reduction and high-end aesthetics. We use glassmorphism and subtle motion to guide the user through a seamless discovery and booking flow.",
      imageSrc: "https://images.unsplash.com/photo-1621619856624-42fd193a0661?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    },
    metricsProps: {
      metrics: [
        { value: "4.9/5", label: "Average Rating" },
        { value: "24hrs", label: "Typical Response" },
        { value: "10k+", label: "Tracks Delivered" },
      ]
    },
    reflectionProps: {
      text: "Bridging the gap between creative vision and professional execution requires more than just a marketplace; it requires a language of quality. By elevating the presentation of the musician's craft, we've increased successful bookings by 42% and reduced time-to-hire by half.",
    },
    listingProps: {
      musicians: musiciansData.slice(0, 4)
    }
  },
};
