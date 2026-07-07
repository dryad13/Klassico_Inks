import { useState } from 'react';
import clsx from 'clsx';

function encodeFormData(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

const NetlifyForm = ({
  name,
  children,
  onSubmit,
  className,
  successMessage = 'Thank you! Your message has been sent successfully.',
}) => {
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data['bot-field']) {
      setStatus('success');
      return;
    }

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData({ 'form-name': name, ...data }),
      });

      if (!response.ok) throw new Error('Form submission failed');

      setStatus('success');
      form.reset();
      onSubmit?.(data);
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or contact us directly.');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center">
        {successMessage}
      </div>
    );
  }

  return (
    <form
      name={name}
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className={className}
    >
      <input type="hidden" name="form-name" value={name} />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>
      {children}
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-4">{errorMessage}</p>
      )}
      {status === 'loading' && (
        <p className="text-slate-400 text-sm mt-4">Sending...</p>
      )}
    </form>
  );
};

export const SubmitButton = ({ children, className, disabled }) => (
  <button
    type="submit"
    disabled={disabled}
    className={clsx(
      'w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2',
      className
    )}
  >
    {children}
  </button>
);

export default NetlifyForm;
