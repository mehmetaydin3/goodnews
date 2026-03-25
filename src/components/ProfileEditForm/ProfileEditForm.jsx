import { useState, useEffect, useCallback } from 'react';
import styles from './ProfileEditForm.module.css';

const API_BASE = 'http://localhost:5001';

// ─── Tag input (instruments / genres) ────────────────────────────────────────

function TagInput({ label, values = [], onChange, placeholder }) {
  const [inputValue, setInputValue] = useState('');

  function addTag(raw) {
    const tag = raw.trim();
    if (tag && !values.includes(tag)) {
      onChange([...values, tag]);
    }
    setInputValue('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  function removeTag(tag) {
    onChange(values.filter((v) => v !== tag));
  }

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      <div className={styles.tagInput}>
        {values.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
            <button
              type="button"
              className={styles.tagRemove}
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className={styles.tagInputField}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(inputValue)}
          placeholder={values.length === 0 ? placeholder : 'Add more…'}
        />
      </div>
      <p className={styles.hint}>Press Enter or comma to add</p>
    </div>
  );
}

// ─── Service form row ─────────────────────────────────────────────────────────

const DELIVERY_MODES = ['remote', 'in-person', 'both'];
const PRICE_TYPES = ['fixed', 'hourly', 'per-project'];
const SERVICE_TYPES = ['remote', 'in-person', 'both'];

const blankService = {
  serviceType: 'remote',
  title: '',
  description: '',
  startingPrice: '',
  priceType: 'fixed',
  turnaroundTime: '',
  revisionsIncluded: 0,
  deliveryMode: 'remote',
  deliverables: [],
  tags: [],
};

function ServiceRow({ service, index, onChange, onRemove, onSave, saving }) {
  function set(field, value) {
    onChange(index, { ...service, [field]: value });
  }

  return (
    <div className={styles.serviceCard}>
      <div className={styles.serviceCardHeader}>
        <span className={styles.serviceIndex}>Service {index + 1}</span>
        <button type="button" className={styles.removeBtn} onClick={() => onRemove(index)}>
          Remove
        </button>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Title *</label>
          <input
            className={styles.input}
            value={service.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Studio Session Recording"
            required
          />
        </div>
        <div className={[styles.fieldGroup, styles.fieldGroupSm].join(' ')}>
          <label className={styles.label}>Price ($) *</label>
          <input
            className={styles.input}
            type="number"
            min="0"
            value={service.startingPrice}
            onChange={(e) => set('startingPrice', e.target.value)}
            placeholder="150"
            required
          />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Price type</label>
          <select className={styles.select} value={service.priceType} onChange={(e) => set('priceType', e.target.value)}>
            {PRICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Delivery mode</label>
          <select className={styles.select} value={service.deliveryMode} onChange={(e) => set('deliveryMode', e.target.value)}>
            {DELIVERY_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Service type</label>
          <select className={styles.select} value={service.serviceType} onChange={(e) => set('serviceType', e.target.value)}>
            {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          rows={2}
          value={service.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="What's included in this service?"
        />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Turnaround time</label>
          <input
            className={styles.input}
            value={service.turnaroundTime}
            onChange={(e) => set('turnaroundTime', e.target.value)}
            placeholder="e.g. 3 business days"
          />
        </div>
        <div className={[styles.fieldGroup, styles.fieldGroupSm].join(' ')}>
          <label className={styles.label}>Revisions</label>
          <input
            className={styles.input}
            type="number"
            min="0"
            value={service.revisionsIncluded}
            onChange={(e) => set('revisionsIncluded', parseInt(e.target.value, 10) || 0)}
          />
        </div>
      </div>

      {service.id && (
        <div className={styles.serviceActions}>
          <button
            type="button"
            className={styles.saveServiceBtn}
            onClick={() => onSave(index)}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save service'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProfileEditForm({
  token = '',
  apiBase = API_BASE,
  onSaved,
  className = '',
  ...props
}) {
  const [profile, setProfile] = useState({
    name: '',
    headline: '',
    bio: '',
    location: '',
    remoteAvailable: false,
    instruments: [],
    genres: [],
    avatarSrc: '',
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingServiceIdx, setSavingServiceIdx] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);

  // Load existing profile on mount
  useEffect(() => {
    if (!token) { setLoading(false); return; }

    fetch(`${apiBase}/api/profile`, { headers: authHeaders() })
      .then((r) => {
        if (r.status === 404) return null;
        if (!r.ok) throw new Error('Failed to load profile');
        return r.json();
      })
      .then((data) => {
        if (data) {
          setProfile({
            name: data.name || '',
            headline: data.headline || '',
            bio: data.bio || '',
            location: data.location || '',
            remoteAvailable: Boolean(data.remoteAvailable),
            instruments: Array.isArray(data.instruments) ? data.instruments : [],
            genres: Array.isArray(data.genres) ? data.genres : [],
            avatarSrc: data.avatarSrc || '',
          });
          setServices(data.services || []);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, apiBase, authHeaders]);

  function setField(field, value) {
    setProfile((p) => ({ ...p, [field]: value }));
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${apiBase}/api/profile`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data.errors?.[0]?.message || data.message || 'Failed to save profile';
        throw new Error(msg);
      }

      setSuccess('Profile saved!');
      onSaved?.(data);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function addService() {
    setServices((s) => [...s, { ...blankService }]);
  }

  function updateService(index, updated) {
    setServices((s) => s.map((svc, i) => (i === index ? updated : svc)));
  }

  async function saveService(index) {
    const svc = services[index];
    setSavingServiceIdx(index);
    setError('');

    const payload = {
      ...svc,
      startingPrice: parseFloat(svc.startingPrice) || 0,
      revisionsIncluded: parseInt(svc.revisionsIncluded, 10) || 0,
    };

    try {
      const method = svc.id ? 'PUT' : 'POST';
      const url = svc.id
        ? `${apiBase}/api/services/${svc.id}`
        : `${apiBase}/api/services`;

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data.errors?.[0]?.message || data.message || 'Failed to save service';
        throw new Error(msg);
      }

      setServices((s) => s.map((existing, i) => (i === index ? data : existing)));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingServiceIdx(null);
    }
  }

  async function removeService(index) {
    const svc = services[index];

    if (svc.id) {
      try {
        const res = await fetch(`${apiBase}/api/services/${svc.id}`, {
          method: 'DELETE',
          headers: authHeaders(),
        });
        if (!res.ok && res.status !== 204) throw new Error('Failed to delete service');
      } catch (err) {
        setError(err.message);
        return;
      }
    }

    setServices((s) => s.filter((_, i) => i !== index));
  }

  if (loading) {
    return (
      <div className={[styles.root, className].filter(Boolean).join(' ')} {...props}>
        <div className={styles.loadingState}>Loading profile…</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={[styles.root, className].filter(Boolean).join(' ')} {...props}>
        <div className={styles.emptyState}>Sign in to manage your profile.</div>
      </div>
    );
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} {...props}>
      <form onSubmit={handleProfileSave} noValidate>
        {/* ── Profile section ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile</h2>

          <div className={styles.avatarRow}>
            {profile.avatarSrc && (
              <img src={profile.avatarSrc} alt="Profile" className={styles.avatarPreview} />
            )}
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Profile image URL</label>
              <input
                className={styles.input}
                type="url"
                value={profile.avatarSrc}
                onChange={(e) => setField('avatarSrc', e.target.value)}
                placeholder="https://…"
              />
              <p className={styles.hint}>Paste a direct image URL</p>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="pef-name">Display name *</label>
              <input
                id="pef-name"
                className={styles.input}
                value={profile.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="Your name or stage name"
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="pef-location">Location</label>
              <input
                id="pef-location"
                className={styles.input}
                value={profile.location}
                onChange={(e) => setField('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="pef-headline">Headline</label>
            <input
              id="pef-headline"
              className={styles.input}
              value={profile.headline}
              onChange={(e) => setField('headline', e.target.value)}
              placeholder="e.g. Jazz guitarist · session musician · 10 years exp."
              maxLength={120}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="pef-bio">Bio</label>
            <textarea
              id="pef-bio"
              className={styles.textarea}
              rows={5}
              value={profile.bio}
              onChange={(e) => setField('bio', e.target.value)}
              placeholder="Tell clients about your background, style, and what makes you unique…"
              maxLength={2000}
            />
            <p className={styles.hint}>{profile.bio.length}/2000</p>
          </div>

          <TagInput
            label="Instruments"
            values={profile.instruments}
            onChange={(v) => setField('instruments', v)}
            placeholder="Guitar, Piano, Drums…"
          />

          <TagInput
            label="Genres"
            values={profile.genres}
            onChange={(v) => setField('genres', v)}
            placeholder="Jazz, Rock, Classical…"
          />

          <div className={styles.toggleRow}>
            <label className={styles.toggleLabel} htmlFor="pef-remote">
              Available for remote work
            </label>
            <button
              type="button"
              id="pef-remote"
              role="switch"
              aria-checked={profile.remoteAvailable}
              className={[styles.toggle, profile.remoteAvailable ? styles.toggleOn : ''].filter(Boolean).join(' ')}
              onClick={() => setField('remoteAvailable', !profile.remoteAvailable)}
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </section>

        {/* ── Services section ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Services</h2>
            <button type="button" className={styles.addServiceBtn} onClick={addService}>
              + Add service
            </button>
          </div>

          {services.length === 0 && (
            <p className={styles.emptyServices}>
              No services yet. Add a service to appear in search results.
            </p>
          )}

          {services.map((svc, i) => (
            <ServiceRow
              key={svc.id || `new-${i}`}
              service={svc}
              index={i}
              onChange={updateService}
              onRemove={removeService}
              onSave={saveService}
              saving={savingServiceIdx === i}
            />
          ))}

          {/* Save new (unsaved) services */}
          {services.some((s) => !s.id) && (
            <div className={styles.newServiceActions}>
              {services.map((svc, i) =>
                !svc.id ? (
                  <button
                    key={i}
                    type="button"
                    className={styles.saveServiceBtn}
                    onClick={() => saveService(i)}
                    disabled={savingServiceIdx === i}
                  >
                    {savingServiceIdx === i ? 'Saving…' : `Save service ${i + 1}`}
                  </button>
                ) : null
              )}
            </div>
          )}
        </section>

        {/* ── Feedback ── */}
        {error && <p className={styles.errorMsg} role="alert">{error}</p>}
        {success && <p className={styles.successMsg} role="status">{success}</p>}

        {/* ── Submit ── */}
        <div className={styles.formFooter}>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? 'Saving profile…' : 'Save profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileEditForm;
