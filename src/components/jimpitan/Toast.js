export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="animate-toast-up fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-[13px] font-bold text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)]">
      {message}
    </div>
  );
}
