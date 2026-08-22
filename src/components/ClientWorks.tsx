/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Doctor, LandingPageConfig, PreviewCardItem } from '../types';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface ClientWorksProps {
  doctors?: Doctor[];
  onVisitDoctor: (username: string) => void;
  landingConfig?: LandingPageConfig;
  currentLang?: 'ar' | 'en';
  isPage?: boolean;
  onNavigate?: (view: string) => void;
}

const DEFAULT_PREVIEW_CARD: PreviewCardItem = {
  id: 'default-card-1',
  imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200',
  profileUrl: 'dr-sarah',
  title: 'د. سارة الشريف - طب وجراحة الأسنان'
};

export default function ClientWorks({ 
  onVisitDoctor, 
  landingConfig, 
  currentLang = 'ar'
}: ClientWorksProps) {
  const isEn = currentLang === 'en';
  const columns = landingConfig?.clientWorks?.columns || 1;

  const rawCards = landingConfig?.clientWorks?.cards && landingConfig.clientWorks.cards.length > 0
    ? landingConfig.clientWorks.cards
    : [DEFAULT_PREVIEW_CARD];

  const cards = rawCards.filter(c => c.imageUrl || c.profileUrl || c.title);
  const displayCards: PreviewCardItem[] = cards.length > 0 ? cards : [DEFAULT_PREVIEW_CARD];

  const [activeIdx, setActiveIdx] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Keep index within bounds if cards length changes
  const validIdx = activeIdx >= displayCards.length ? 0 : activeIdx;

  const scrollToCard = (index: number, smooth: boolean = true) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardElements = container.querySelectorAll<HTMLElement>('[data-preview-card]');
    if (cardElements[index]) {
      const card = cardElements[index];
      isScrollingRef.current = true;
      card.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'nearest',
        inline: 'start'
      });
      setActiveIdx(index);
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 400);
    }
  };

  const getClosestCardIndex = (): number => {
    if (!scrollContainerRef.current) return 0;
    const container = scrollContainerRef.current;
    const cardElements = container.querySelectorAll<HTMLElement>('[data-preview-card]');
    if (!cardElements.length) return 0;

    const containerRect = container.getBoundingClientRect();
    const referenceEdge = isEn ? containerRect.left : containerRect.right;

    let closestIndex = 0;
    let minDistance = Infinity;

    cardElements.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardEdge = isEn ? cardRect.left : cardRect.right;
      const dist = Math.abs(cardEdge - referenceEdge);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });
    return closestIndex;
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current || isScrollingRef.current || isMouseDownRef.current) return;
    const closestIndex = getClosestCardIndex();
    if (closestIndex !== activeIdx) {
      setActiveIdx(closestIndex);
    }
  };

  // Mouse Drag Handlers for Active Full Profile Card
  const handleActiveCardMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current || displayCards.length <= 1) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    setIsDraggingState(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const walk = e.pageX - startXRef.current;
    if (Math.abs(walk) > 6) {
      hasDraggedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    setIsDraggingState(false);
    
    if (hasDraggedRef.current) {
      const targetIndex = getClosestCardIndex();
      scrollToCard(targetIndex, true);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 50);
    }
  };

  useEffect(() => {
    // Initial start alignment
    if (scrollContainerRef.current && displayCards.length > 1) {
      scrollToCard(0, false);
    }
  }, [displayCards.length]);

  const handleVisit = (urlOrUsername: string) => {
    if (hasDraggedRef.current) return;
    if (!urlOrUsername) return;
    const cleanUrl = urlOrUsername.trim();
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      try {
        const urlObj = new URL(cleanUrl);
        if (urlObj.pathname.includes('/dr/')) {
          const u = urlObj.pathname.split('/dr/')[1]?.replace(/\/$/, '');
          if (u && onVisitDoctor) {
            onVisitDoctor(u);
            return;
          }
        }
      } catch (e) {}
      window.open(cleanUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Clean username from leading slashes, @, or dr/
      const username = cleanUrl.replace(/^[@/]+/, '').replace(/^dr\//, '');
      if (onVisitDoctor) {
        onVisitDoctor(username);
      }
    }
  };

  return (
    <section 
      id="client-works" 
      className="w-full py-14 sm:py-18 md:py-22 bg-[#F4F8FC] border-b border-neutral-200/70 scroll-mt-24 font-almarai overflow-hidden"
      dir={isEn ? 'ltr' : 'rtl'}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Heading */}
        <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-10 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#10244A] tracking-tight leading-snug">
            {isEn 
              ? (landingConfig?.clientWorks?.title && 
                 landingConfig.clientWorks.title !== 'أمثلة من البروفايلات' && 
                 landingConfig.clientWorks.title !== 'نموذج' && 
                 landingConfig.clientWorks.title !== 'نماذج من بروفايلات الأطباء' && 
                 landingConfig.clientWorks.title !== 'معاينة' && 
                 landingConfig.clientWorks.title !== 'سابقة الأعمال' 
                 ? landingConfig.clientWorks.title 
                 : 'Doctor Profile Examples')
              : (landingConfig?.clientWorks?.title && 
                 landingConfig.clientWorks.title !== 'سابقة الأعمال' && 
                 landingConfig.clientWorks.title !== 'معاينة' && 
                 landingConfig.clientWorks.title !== 'نماذج تجريبية' && 
                 landingConfig.clientWorks.title !== 'نماذج من بروفايلات الأطباء'
                 ? landingConfig.clientWorks.title 
                 : 'أمثلة من البروفايلات')}
          </h2>
        </div>

        {/* Mode 1: Single Card Start-Aligned Peeking Carousel (columns === 1) */}
        {columns === 1 ? (
          <div className="w-full">
            {/* Horizontal Scroll Track: start aligned with subtle one-side peek */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className={`flex items-stretch gap-4 sm:gap-6 overflow-x-auto ${isDraggingState ? 'snap-none' : 'snap-x snap-mandatory'} pb-4 pt-2 no-scrollbar select-none`}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {displayCards.map((card, idx) => {
                const isActive = idx === validIdx;
                return (
                  <div
                    key={card.id || `card-${idx}`}
                    data-preview-card
                    onClick={() => {
                      if (!isActive) scrollToCard(idx);
                    }}
                    className={`shrink-0 w-[calc(100%-42px)] sm:w-[calc(100%-60px)] md:w-[calc(100%-72px)] snap-start transition-all duration-300 transform ${
                      isActive 
                        ? 'opacity-100 scale-100 cursor-grab active:cursor-grabbing' 
                        : 'opacity-50 scale-[0.98] hover:opacity-75 cursor-pointer pointer-events-auto'
                    }`}
                  >
                    <div 
                      onMouseDown={isActive ? handleActiveCardMouseDown : undefined}
                      className="bg-white border-2 border-slate-200/90 hover:border-[#003B7A]/50 rounded-3xl sm:rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full"
                    >
                      {/* Image Area */}
                      <div className="w-full bg-slate-100 overflow-hidden relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/11]">
                        <img 
                          src={card.imageUrl || DEFAULT_PREVIEW_CARD.imageUrl} 
                          alt={card.title || (isEn ? 'Doctor Profile Demo' : 'نموذج بروفايل الطبيب')}
                          className="w-full h-full object-cover object-top pointer-events-none"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          draggable={false}
                        />
                      </div>

                      {/* Action Bar Below Image */}
                      <div className="p-5 sm:p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {card.title ? (
                          <div className="flex items-center gap-2 max-w-full truncate">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#003B7A] shrink-0" />
                            <span className="text-sm sm:text-base font-extrabold text-[#10244A] truncate">
                              {card.title}
                            </span>
                          </div>
                        ) : <div />}

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVisit(card.profileUrl);
                            }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#003B7A] hover:bg-[#002d5e] active:bg-[#002247] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 cursor-pointer shrink-0 group/btn"
                          >
                            <span>{isEn ? 'Visit Profile' : 'زيارة البروفايل'}</span>
                            {card.profileUrl?.startsWith('http') ? (
                              <ExternalLink className="w-4 h-4" />
                            ) : (
                              <ChevronLeft className={`w-4 h-4 transition-transform group-hover/btn:-translate-x-1 ${isEn ? 'rotate-180 group-hover/btn:translate-x-1' : ''}`} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Dots Indicator (Only if more than 1 card) */}
            {displayCards.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-slate-200/80 shadow-xs">
                  {displayCards.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => scrollToCard(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        dotIdx === validIdx 
                          ? 'w-7 h-2.5 bg-[#003B7A]' 
                          : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mode 2: Two Columns Grid (columns === 2) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
            {displayCards.map((card, idx) => (
              <motion.div
                key={card.id || `card-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="bg-white border-2 border-slate-200/90 hover:border-[#003B7A]/50 rounded-3xl sm:rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Area */}
                <div className="w-full bg-slate-100 overflow-hidden relative aspect-[16/10]">
                  <img 
                    src={card.imageUrl || DEFAULT_PREVIEW_CARD.imageUrl} 
                    alt={card.title || (isEn ? 'Doctor Profile Demo' : 'نموذج بروفايل الطبيب')}
                    className="w-full h-full object-cover object-top group-hover:scale-101 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Action Bar Below Image */}
                <div className="p-5 sm:p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {card.title ? (
                    <span className="text-xs sm:text-sm font-bold text-neutral-800 truncate max-w-[240px]">
                      {card.title}
                    </span>
                  ) : <div />}

                  <button
                    type="button"
                    onClick={() => handleVisit(card.profileUrl)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#003B7A] hover:bg-[#002d5e] active:bg-[#002247] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 cursor-pointer shrink-0 group/btn"
                  >
                    <span>{isEn ? 'Visit Profile' : 'زيارة البروفايل'}</span>
                    {card.profileUrl?.startsWith('http') ? (
                      <ExternalLink className="w-4 h-4" />
                    ) : (
                      <ChevronLeft className={`w-4 h-4 transition-transform group-hover/btn:-translate-x-1 ${isEn ? 'rotate-180 group-hover/btn:translate-x-1' : ''}`} />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

