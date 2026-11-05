import React, { useState } from 'react';
import { X, Copy, Check, QrCode, MessageCircle, Send, Twitter, Mail } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  appName
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://play.google.com/store/apps/details?id=com.polyverse.aimirror';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-neutral-900 mb-1">
          Compartilhar este app
        </h3>
        <p className="text-xs text-neutral-500 mb-5">
          Envie o link de download direto do <strong>{appName}</strong> para amigos.
        </p>

        {/* Share Quick Channels */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Confira o app AI Mirror: ${shareUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-center"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-[11px] font-semibold">WhatsApp</span>
          </a>

          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`AI Mirror no Google Play`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors text-center"
          >
            <Send className="w-6 h-6" />
            <span className="text-[11px] font-semibold">Telegram</span>
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Transforme fotos em arte com o AI Mirror no Google Play! ${shareUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition-colors text-center"
          >
            <Twitter className="w-6 h-6" />
            <span className="text-[11px] font-semibold">X</span>
          </a>

          <a
            href={`mailto:?subject=${encodeURIComponent(`App AI Mirror no Google Play`)}&body=${encodeURIComponent(`Veja este app incrível: ${shareUrl}`)}`}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-center"
          >
            <Mail className="w-6 h-6" />
            <span className="text-[11px] font-semibold">E-mail</span>
          </a>
        </div>

        {/* Link Copy Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-600">
            Link no Google Play
          </label>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-100 border border-neutral-200">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs text-neutral-700 w-full focus:outline-none font-mono"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#01875f] hover:bg-[#017252] text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-medium text-xs sm:text-sm transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
