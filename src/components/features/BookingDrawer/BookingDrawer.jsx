import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '../../ui/Typography/Typography';
import { Button } from '../../ui/Button/Button';
import styles from './BookingDrawer.module.css';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$' };
const STEPS = ['Details', 'Review', 'Confirm'];

function StepIndicator({ current }) {
  return (
    <div className={styles.steps} aria-label="Checkout steps">
      {STEPS.map((label, i) => (
        <div key={label} className={styles.stepItem}>
          <div className={[styles.stepCircle, i < current ? styles.stepDone : '', i === current ? styles.stepActive : ''].filter(Boolean).join(' ')}>
            {i < current ? '✓' : i + 1}
          </div>
          <span className={[styles.stepLabel, i === current ? styles.stepLabelActive : ''].filter(Boolean).join(' ')}>{label}</span>
          {i < STEPS.length - 1 && <div className={[styles.stepLine, i < current ? styles.stepLineDone : ''].filter(Boolean).join(' ')} aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}

function DetailsStep({ musician, packages, selectedPkg, onPkgChange, date, onDateChange, brief, onBriefChange, currency }) {
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  return (
    <div className={styles.stepContent}>
      <Typography as="h3" variant="heading3" className={styles.stepTitle}>Select your package</Typography>

      <div className={styles.pkgGrid}>
        {packages.map((pkg, i) => (
          <button
            key={pkg.name}
            className={[styles.pkgCard, selectedPkg === i ? styles.pkgSelected : ''].filter(Boolean).join(' ')}
            onClick={() => onPkgChange(i)}
            aria-pressed={selectedPkg === i}
          >
            <span className={styles.pkgName}>{pkg.name}</span>
            <span className={styles.pkgPrice}>{sym}{pkg.price}</span>
            {pkg.delivery && pkg.delivery !== '—' && (
              <span className={styles.pkgMeta}>{pkg.delivery} delivery</span>
            )}
          </button>
        ))}
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="booking-date">
          Preferred date / schedule
        </label>
        <input
          id="booking-date"
          type="text"
          className={styles.fieldInput}
          placeholder="e.g. Week of 15 April, or specific date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="booking-brief">
          Your brief
        </label>
        <textarea
          id="booking-brief"
          className={styles.fieldTextarea}
          placeholder="Tell the musician what you need, your genre, references, deadline…"
          rows={4}
          value={brief}
          onChange={(e) => onBriefChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function ReviewStep({ musician, packages, selectedPkg, date, brief, currency }) {
  const pkg = packages[selectedPkg] || packages[0];
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  const platformFee = Math.round(pkg.price * 0.1);
  const total = pkg.price + platformFee;

  return (
    <div className={styles.stepContent}>
      <Typography as="h3" variant="heading3" className={styles.stepTitle}>Review your order</Typography>

      <div className={styles.orderCard}>
        <div className={styles.orderRow}>
          <img src={musician.avatarSrc} alt="" className={styles.orderAvatar} />
          <div>
            <Typography as="p" variant="label" className={styles.orderName}>{musician.name}</Typography>
            <Typography as="p" variant="caption" className={styles.orderTag}>{musician.tagline}</Typography>
          </div>
        </div>

        <div className={styles.orderLines}>
          <div className={styles.orderLine}>
            <span>Package</span>
            <span className={styles.orderLineVal}>{pkg.name}</span>
          </div>
          <div className={styles.orderLine}>
            <span>Price</span>
            <span className={styles.orderLineVal}>{sym}{pkg.price}</span>
          </div>
          {date && (
            <div className={styles.orderLine}>
              <span>Schedule</span>
              <span className={styles.orderLineVal}>{date}</span>
            </div>
          )}
          <div className={styles.orderLine}>
            <span>Platform fee (10%)</span>
            <span className={styles.orderLineVal}>{sym}{platformFee}</span>
          </div>
        </div>

        <div className={styles.orderTotal}>
          <span>Total</span>
          <span className={styles.orderTotalVal}>{sym}{total}</span>
        </div>
      </div>

      {brief && (
        <div className={styles.briefPreview}>
          <Typography as="p" variant="caption" className={styles.briefLabel}>Your brief</Typography>
          <Typography variant="bodySmall" className={styles.briefText}>{brief}</Typography>
        </div>
      )}
    </div>
  );
}

function ConfirmStep({ musician, bookingRef, onViewBookings, onBack }) {
  return (
    <div className={styles.successContent}>
      <div className={styles.successIcon}><CheckCircleIcon /></div>
      <Typography as="h2" variant="heading2" className={styles.successTitle}>Request Sent!</Typography>
      <Typography variant="body" className={styles.successDesc}>
        Your booking request has been sent to <strong>{musician.name}</strong>.
        No payment is taken until they accept and you confirm.
      </Typography>

      <div className={styles.refBox}>
        <Typography variant="caption" className={styles.refLabel}>Booking reference</Typography>
        <code className={styles.refCode}>{bookingRef || '—'}</code>
      </div>

      {/* What happens next */}
      <div className={styles.nextSteps}>
        <span className={styles.nextStepsTitle}>What happens next</span>
        <ol className={styles.nextStepsList}>
          <li><Typography variant="caption">{musician.name} reviews your request and accepts or declines</Typography></li>
          <li><Typography variant="caption">You'll be notified once they respond</Typography></li>
          <li><Typography variant="caption">Confirm details and coordinate directly before the session</Typography></li>
        </ol>
      </div>

      <div className={styles.successActions}>
        <Button variant="primary" size="lg" fullWidth onClick={onViewBookings}>View my bookings →</Button>
        <Button variant="ghost" size="lg" fullWidth onClick={onBack}>Browse more musicians</Button>
      </div>
    </div>
  );
}

export function BookingDrawer({
  isOpen = false,
  musician = {},
  onClose,
  apiBase = '',
  initialSelectedPkg = 0,
  className = '',
  ...props
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedPkg, setSelectedPkg] = useState(initialSelectedPkg);
  const [date, setDate] = useState('');
  const [brief, setBrief] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [bookingRef, setBookingRef] = useState(null);

  // Adapt API service shape to internal { id, name, price, delivery }.
  // Falls back to musician.packages for Storybook mock data compatibility.
  const rawServices = Array.isArray(musician.services) ? musician.services : [];
  const services = rawServices.length > 0
    ? rawServices.map(s => ({ id: s.id, name: s.title, price: s.startingPrice, delivery: s.turnaroundTime }))
    : (musician.packages || []);
  const currency = musician.currency || 'USD';

  if (!isOpen) return null;

  // Guard: a real API service must have an id; mock/Storybook packages are identified by name.
  const selectedService = services[selectedPkg] || services[0];
  const canProceed = Boolean(selectedService?.id || selectedService?.name);

  const handleNext = () => setStep((s) => Math.min(s + 1, 2));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleConfirm = async () => {
    if (!canProceed) {
      setSubmitError('No service selected. Please select a package before confirming.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const token = localStorage.getItem('token');
      const pkg = selectedService;
      const res = await fetch(`${apiBase}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          musicianId: musician.id,
          serviceId: pkg?.id,
          scheduledDate: date || null,
          brief: brief || null,
        }),
      });
      const data = await res.json();
      if (res.status === 401) { navigate('/auth'); throw new Error('Please log in to make a booking.'); }
      if (!res.ok) throw new Error(data.message || data.error || 'Booking failed');
      setBookingRef(data.booking?.id || data.id || 'CONFIRMED');
      setStep(2);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={styles.overlay}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={[styles.drawer, isOpen ? styles.drawerOpen : '', className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={`Book ${musician.name}`}
        {...props}
      >
        {/* Header */}
        <div className={styles.header}>
          <div>
            <Typography as="h2" variant="heading3" className={styles.drawerTitle}>
              Book a Session
            </Typography>
            {musician.name && (
              <Typography variant="caption" className={styles.drawerSub}>with {musician.name}</Typography>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close booking drawer">
            <CloseIcon />
          </button>
        </div>

        {/* Step indicator */}
        {step < 2 && <StepIndicator current={step} />}

        {/* Content */}
        <div className={styles.body}>
          {step === 0 && (
            <DetailsStep
              musician={musician}
              packages={services}
              selectedPkg={selectedPkg}
              onPkgChange={setSelectedPkg}
              date={date}
              onDateChange={setDate}
              brief={brief}
              onBriefChange={setBrief}
              currency={currency}
            />
          )}
          {step === 1 && (
            <ReviewStep
              musician={musician}
              packages={services}
              selectedPkg={selectedPkg}
              date={date}
              brief={brief}
              currency={currency}
            />
          )}
          {step === 2 && (
            <ConfirmStep
              musician={musician}
              bookingRef={bookingRef}
              onViewBookings={() => { onClose(); navigate('/my-bookings'); }}
              onBack={onClose}
            />
          )}
        </div>

        {/* Footer navigation */}
        {step < 2 && (
          <div className={styles.footer}>
            {step > 0 && (
              <Button variant="ghost" size="lg" onClick={handleBack}>Back</Button>
            )}
            <Button variant="primary" size="lg" fullWidth={step === 0} onClick={step === 0 ? handleNext : handleConfirm} disabled={submitting || !canProceed} className={styles.nextBtn}>
              {step === 0 ? 'Review Order →' : submitting ? 'Sending…' : 'Confirm & Send →'}
            </Button>
            {submitError && (
              <p className={styles.errorMsg}>{submitError}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default BookingDrawer;
