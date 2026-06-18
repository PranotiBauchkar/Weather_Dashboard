export default function ErrorMessage({ message, errorCode, onRetry }) {
  if (!message) return null;

  const isApiKeyError = errorCode === 'INVALID_API_KEY' || errorCode === 'MISSING_API_KEY';

  return (
    <div className="saas-card flex items-start gap-3 border-l-4 border-l-red-400 bg-red-50">
      <svg className="mt-0.5 h-6 w-6 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-red-700">{isApiKeyError ? 'API Key Issue' : 'Error'}</h4>
        <p className="mt-1 text-sm text-slate-600">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="saas-btn-primary mt-3 text-sm">Try Again</button>
        )}
      </div>
    </div>
  );
}
