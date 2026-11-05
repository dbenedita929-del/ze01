import React, { useState } from 'react';
import { X, Star, Smartphone, Check } from 'lucide-react';
import { Review } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  appName?: string;
  developer?: string;
}

const STAR_LABELS: Record<number, string> = {
  1: 'Muito ruim',
  2: 'Ruim',
  3: 'Regular',
  4: 'Muito bom',
  5: 'Excelente!'
};

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitReview,
  appName = 'Aplicativo',
  developer = 'desenvolvedor'
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [author, setAuthor] = useState('');
  const [device, setDevice] = useState('Samsung Galaxy S24 Ultra');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim()) {
      setError('Por favor, informe seu nome.');
      return;
    }
    if (!content.trim()) {
      setError('Por favor, escreva sua opinião sobre o aplicativo.');
      return;
    }

    const avatarColors = [
      'bg-emerald-600',
      'bg-indigo-600',
      'bg-rose-600',
      'bg-amber-600',
      'bg-cyan-600',
      'bg-purple-600'
    ];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    onSubmitReview({
      author: author.trim(),
      avatarColor: randomColor,
      rating,
      device,
      content: content.trim()
    });

    onClose();
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-neutral-900 mb-1">
          Avaliar {appName}
        </h3>
        <p className="text-xs text-neutral-500 mb-6">
          Sua avaliação ajuda outros usuários e apoia a equipe de {developer}.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Star Rating Picker */}
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= activeRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-neutral-700 mt-2">
              {STAR_LABELS[activeRating]}
            </p>
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Seu Nome ou Apelido
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ex: Carlos M."
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#01875f] focus:ring-2 focus:ring-[#01875f]/20"
            />
          </div>

          {/* Device Model */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Seu Aparelho
            </label>
            <select
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#01875f] bg-white cursor-pointer"
            >
              <option value="Samsung Galaxy S24 Ultra">Samsung Galaxy S24 Ultra</option>
              <option value="Google Pixel 9 Pro">Google Pixel 9 Pro</option>
              <option value="Motorola Edge 50">Motorola Edge 50</option>
              <option value="Xiaomi 14">Xiaomi 14</option>
              <option value="Samsung Galaxy Tab S9">Samsung Galaxy Tab S9</option>
              <option value="Outro Dispositivo Android">Outro Dispositivo Android</option>
            </select>
          </div>

          {/* Review Textarea */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Sua Opinião
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Descreva o que achou dos filtros de anime, velocidade de processamento, facilidade de uso..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#01875f] focus:ring-2 focus:ring-[#01875f]/20"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-medium">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#01875f] hover:bg-[#017252] text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors shadow-sm"
            >
              Postar Avaliação
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
