import React, { useState } from 'react';
import { Star, ThumbsUp, ArrowRight, Check, MessageSquarePlus, Smartphone, Filter } from 'lucide-react';
import { Review, AppInfo } from '../types';

interface ReviewsSectionProps {
  app?: AppInfo;
  reviews: Review[];
  onOpenReviewModal: () => void;
  onVoteHelpful: (reviewId: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  app,
  reviews,
  onOpenReviewModal,
  onVoteHelpful
}) => {
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);

  const ratingScore = app?.rating ?? 4.6;
  const ratingFormatted = ratingScore.toFixed(1).replace('.', ',');
  const totalReviewsCount = app?.ratingCount || `${app?.ratingCountNumber ? app.ratingCountNumber.toLocaleString('pt-BR') : '385.210'} avaliações totais`;

  // Realistic percentage distribution calculated from score
  const starPercentages = [
    { stars: 5, pct: Math.min(92, Math.max(50, Math.round((ratingScore - 3.5) * 50 + 20))) },
    { stars: 4, pct: Math.min(25, Math.max(8, Math.round(18 - (ratingScore - 4.2) * 10))) },
    { stars: 3, pct: 4 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 2 }
  ];

  const filteredReviews = selectedStarFilter
    ? reviews.filter((r) => r.rating === selectedStarFilter)
    : reviews;

  return (
    <section id="avaliacoes" className="py-8 border-b border-neutral-100">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & CTA to Write Review */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center gap-2">
              <span>Avaliações e notas</span>
              <ArrowRight className="w-5 h-5 text-neutral-400" />
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>As notas e avaliações são verificadas de dispositivos semelhantes.</span>
            </div>
          </div>

          <button
            onClick={onOpenReviewModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#01875f] text-[#01875f] hover:bg-[#01875f]/5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer self-start sm:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Avaliar este app</span>
          </button>
        </div>

        {/* Rating Breakdown Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs mb-8">
          
          {/* Big Score (Left 4 cols) */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start justify-center border-b md:border-b-0 md:border-r border-neutral-100 pb-6 md:pb-0 md:pr-6">
            <span className="text-5xl sm:text-6xl font-bold text-neutral-900 tracking-tight font-mono">
              {ratingFormatted}
            </span>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    ratingScore >= s
                      ? 'fill-neutral-900 text-neutral-900'
                      : ratingScore >= s - 0.5
                      ? 'fill-neutral-900/40 text-neutral-900'
                      : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              {totalReviewsCount.includes('avaliações') ? totalReviewsCount : `${totalReviewsCount} avaliações`}
            </p>
          </div>

          {/* Rating Bars (Right 8 cols) */}
          <div className="md:col-span-8 space-y-2">
            {starPercentages.map((item) => {
              const isSelected = selectedStarFilter === item.stars;
              return (
                <div
                  key={item.stars}
                  onClick={() =>
                    setSelectedStarFilter(isSelected ? null : item.stars)
                  }
                  className={`flex items-center gap-3 text-xs cursor-pointer py-0.5 px-2 rounded-lg transition-colors ${
                    isSelected ? 'bg-neutral-100 font-bold' : 'hover:bg-neutral-50'
                  }`}
                >
                  <span className="w-3 text-right font-medium text-neutral-700">
                    {item.stars}
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-[#01875f] rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-neutral-400 font-mono">
                    {item.pct}%
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
          <span className="text-xs font-medium text-neutral-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar:</span>
          </span>

          <button
            onClick={() => setSelectedStarFilter(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedStarFilter === null
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Todas as avaliações ({reviews.length})
          </button>

          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStarFilter(selectedStarFilter === s ? null : s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                selectedStarFilter === s
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <span>{s}</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>

        {/* User Reviews List */}
        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-neutral-100">
              <p className="text-sm text-neutral-500">
                Nenhuma avaliação encontrada com {selectedStarFilter} estrelas.
              </p>
              <button
                onClick={() => setSelectedStarFilter(null)}
                className="mt-2 text-xs font-semibold text-[#01875f] hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="space-y-3 pb-6 border-b border-neutral-100 last:border-0"
              >
                {/* Author row */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full ${review.avatarColor} text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs`}
                  >
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900">
                      {review.author}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span>{review.device}</span>
                    </div>
                  </div>
                </div>

                {/* Stars and Date */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <Star
                        key={st}
                        className={`w-3.5 h-3.5 ${
                          st <= review.rating
                            ? 'fill-neutral-900 text-neutral-900'
                            : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-500">{review.date}</span>
                </div>

                {/* Content */}
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {review.content}
                </p>

                {/* Helpful voting */}
                <div className="flex items-center gap-4 text-xs text-neutral-500 pt-1">
                  <span>Esta avaliação foi útil?</span>
                  <button
                    onClick={() => onVoteHelpful(review.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                      review.userVotedHelpful
                        ? 'border-[#01875f] bg-[#01875f]/10 text-[#01875f] font-semibold'
                        : 'border-neutral-200 hover:border-neutral-400 text-neutral-600'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Sim</span>
                    {review.helpfulCount > 0 && (
                      <span className="font-mono ml-0.5">({review.helpfulCount})</span>
                    )}
                  </button>
                  <button className="px-2.5 py-1 rounded-full border border-neutral-200 hover:border-neutral-400 text-neutral-600 transition-colors cursor-pointer">
                    Não
                  </button>
                </div>

                {/* Developer Response */}
                {review.developerResponse && (
                  <div className="ml-4 sm:ml-8 mt-3 p-3.5 rounded-xl bg-neutral-50 border-l-2 border-[#01875f] space-y-1 text-xs">
                    <div className="flex items-center justify-between text-neutral-700 font-semibold">
                      <span>{app?.developer || 'Desenvolvedor'} (Desenvolvedor)</span>
                      <span className="text-neutral-400 font-normal">
                        {review.developerResponse.date}
                      </span>
                    </div>
                    <p className="text-neutral-600 leading-relaxed">
                      {review.developerResponse.content}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};
