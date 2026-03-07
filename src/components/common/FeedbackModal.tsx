import React, { useState } from 'react';
import type { FeedbackData } from '../../services/feedbackService';

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (data: FeedbackData) => Promise<void>;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, onSubmit }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [formData, setFormData] = useState<FeedbackData>({
    message: '',
    type: 'general',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      alert('Please enter your feedback');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: isMobile ? '1rem' : '2rem',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, margin: 0 }}>
            💬 Send Feedback
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            ✕
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Thank You!
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Your feedback has been submitted successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Help us improve Thrive! Share your thoughts, report bugs, or suggest new features.
            </p>

            {/* Type Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>
                Feedback Type
              </label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                gap: '0.75rem' 
              }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'bug' })}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${formData.type === 'bug' ? 'var(--color-danger)' : 'var(--color-border)'}`,
                    backgroundColor: formData.type === 'bug' ? '#fee2e2' : 'white',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: formData.type === 'bug' ? 'var(--color-danger)' : 'var(--color-text-secondary)',
                    transition: 'all 0.2s',
                  }}
                >
                  🐛 Bug Report
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'feature' })}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${formData.type === 'feature' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: formData.type === 'feature' ? '#d1fae5' : 'white',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: formData.type === 'feature' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    transition: 'all 0.2s',
                  }}
                >
                  ✨ Feature Request
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'general' })}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${formData.type === 'general' ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                    backgroundColor: formData.type === 'general' ? '#dbeafe' : 'white',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: formData.type === 'general' ? 'var(--color-secondary)' : 'var(--color-text-secondary)',
                    transition: 'all 0.2s',
                  }}
                >
                  💬 General
                </button>
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
                Your Feedback *
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what's on your mind..."
                rows={6}
                disabled={loading}
                style={{
                  resize: 'vertical',
                  minHeight: '120px',
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '0.75rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {loading ? 'Sending...' : '📤 Submit Feedback'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};