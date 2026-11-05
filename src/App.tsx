/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { AppHero } from './components/AppHero';
import { ScreenshotCarousel } from './components/ScreenshotCarousel';
import { InteractivePlayground } from './components/InteractivePlayground';
import { AboutSection } from './components/AboutSection';
import { DataSafetySection } from './components/DataSafetySection';
import { ReviewsSection } from './components/ReviewsSection';
import { SimilarAppsSection } from './components/SimilarAppsSection';
import { Footer } from './components/Footer';
import { InstallModal } from './components/InstallModal';
import { ShareModal } from './components/ShareModal';
import { ReviewModal } from './components/ReviewModal';
import { LightboxModal } from './components/LightboxModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ASSAI_ATACADISTA_APP, AI_MIRROR_APP, SCREENSHOTS, INITIAL_REVIEWS } from './data/appData';
import { AppInfo, Review } from './types';
import { getStoredApk, deleteStoredApk } from './utils/apkStorage';
import { extractMobileSyncFromUrl } from './utils/cloudSync';
import { sanitizeAppInfo } from './utils/appTopicGenerator';
import { CheckCircle2, Bookmark, BookmarkCheck } from 'lucide-react';

const STORAGE_KEY = 'playstore_app_custom_data_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState('Apps');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [installedDeviceName, setInstalledDeviceName] = useState<string | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check if current URL is the admin link (?admin=true, #admin, etc.)
  const [isAdminLink, setIsAdminLink] = useState(() => {
    if (typeof window === 'undefined') return false;
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    return search.includes('admin') || hash.includes('admin') || path.includes('admin');
  });

  useEffect(() => {
    const handleUrlCheck = () => {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const hasAdmin = search.includes('admin') || hash.includes('admin') || path.includes('admin');
      setIsAdminLink((prev) => {
        if (hasAdmin && !prev) {
          showToast('Link do Admin ativo: Botão Admin visível no topo!');
        }
        return hasAdmin;
      });

      // Check if URL has incoming sync data for mobile
      const incoming = extractMobileSyncFromUrl();
      if (incoming) {
        const sanitized = sanitizeAppInfo(incoming);
        setApp(sanitized);
        if (sanitized.reviews && sanitized.reviews.length > 0) {
          setReviews(sanitized.reviews);
        }
        showToast(`Sincronizado no celular: ${sanitized.name}!`);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret shortcut: Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        setIsAdminLink(true);
        setIsAdminPanelOpen(true);
        showToast('Modo Admin ativado pelo atalho!');
      }
    };

    window.addEventListener('popstate', handleUrlCheck);
    window.addEventListener('hashchange', handleUrlCheck);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handleUrlCheck);
      window.removeEventListener('hashchange', handleUrlCheck);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // App data state: Priority 1: URL Sync (QR code/link), Priority 2: LocalStorage, Priority 3: Default AI_MIRROR_APP
  const [app, setApp] = useState<AppInfo>(() => {
    const fromUrl = extractMobileSyncFromUrl();
    if (fromUrl) {
      return sanitizeAppInfo(fromUrl);
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return sanitizeAppInfo(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    return sanitizeAppInfo(AI_MIRROR_APP);
  });

  const isAdminPanelOpenRef = useRef(isAdminPanelOpen);
  useEffect(() => {
    isAdminPanelOpenRef.current = isAdminPanelOpen;
  }, [isAdminPanelOpen]);

  // Sync state with server on mount and check periodically so changes appear on hosting
  useEffect(() => {
    let isMounted = true;

    const fetchServerConfig = async () => {
      // Do not overwrite local changes while admin is actively editing
      if (isAdminPanelOpenRef.current) return;

      try {
        const res = await fetch('/api/app-config');
        if (!res.ok) return;
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) return;

        const data = await res.json();
        if (isMounted && data.success && data.app && !isAdminPanelOpenRef.current) {
          const sanitized = sanitizeAppInfo(data.app);
          setApp(sanitized);
          if (sanitized.reviews && sanitized.reviews.length > 0) {
            setReviews(sanitized.reviews);
          }
          // Cache in local storage as instant fallback
          try {
            const toPersist = { ...data.app };
            if (toPersist.uploadedApkData && toPersist.uploadedApkData.length > 500) {
              toPersist.uploadedApkData = 'server';
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.warn('Servidor local/remoto não respondeu a /api/app-config, usando cache local:', err);
      }
    };

    fetchServerConfig();

    // Periodic check every 4 seconds so that changes saved on another tab or admin reflect everywhere
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchServerConfig();
      }
    }, 4000);

    const handleFocus = () => fetchServerConfig();
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Check IndexedDB on mount to ensure uploaded APK filename and data are active
  useEffect(() => {
    getStoredApk().then((stored) => {
      if (stored && stored.fileName) {
        setApp((prev) => ({
          ...prev,
          apkFileName: prev.apkFileName || stored.fileName,
          apkFileSize: prev.apkFileSize || stored.fileSize,
          apkSourceType: 'upload',
          uploadedApkData: 'indexeddb'
        }));
      }
    }).catch(() => {
      // ignore
    });
  }, []);

  // Keep page title in sync with current app name
  useEffect(() => {
    document.title = `${app.name} - Apps no Google Play`;
  }, [app.name]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleSaveApp = async (updatedApp: AppInfo) => {
    const sanitized = sanitizeAppInfo(updatedApp);
    // Optimistic local state update
    setApp(sanitized);
    if (sanitized.reviews && sanitized.reviews.length > 0) {
      setReviews(sanitized.reviews);
    }
    try {
      const toPersist = { ...sanitized };
      if (toPersist.uploadedApkData && toPersist.uploadedApkData.length > 500) {
        toPersist.uploadedApkData = 'server';
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
    } catch {
      // ignore storage quota
    }

    // Persist to Server API so hosting and all visitors see changes immediately
    try {
      const res = await fetch('/api/app-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sanitized)
      });
      const data = await res.json();
      if (data.success && data.app) {
        const serverSanitized = sanitizeAppInfo(data.app);
        setApp(serverSanitized);
        showToast(`Salvo na hospedagem e sincronizado: ${serverSanitized.name}!`);
        return;
      }
    } catch (err) {
      console.error('Erro ao enviar dados para /api/app-config:', err);
    }

    showToast(`Aplicativo atualizado: ${sanitized.name}!`);
  };

  const handleResetToAssai = async () => {
    try {
      await fetch('/api/app-config/reset', { method: 'POST' });
    } catch (err) {
      console.error('Erro ao resetar no servidor:', err);
    }
    setApp(ASSAI_ATACADISTA_APP);
    deleteStoredApk().catch(() => {});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast('Restaurado para o padrão Assaí Atacadista na hospedagem!');
  };

  const handleToggleWishlist = () => {
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    showToast(
      nextState
        ? `Adicionado ${app.name} à sua lista de desejos`
        : `Removido ${app.name} da sua lista de desejos`
    );
  };

  const handleInstallSuccess = (deviceName: string) => {
    setInstalledDeviceName(deviceName);
    showToast(`${app.name} será instalado em breve no seu ${deviceName}`);
  };

  const handleVoteHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const hasVoted = r.userVotedHelpful;
          return {
            ...r,
            helpfulCount: hasVoted ? r.helpfulCount - 1 : r.helpfulCount + 1,
            userVotedHelpful: !hasVoted
          };
        }
        return r;
      })
    );
  };

  const handleSubmitReview = (
    newRevData: Omit<Review, 'id' | 'date' | 'helpfulCount'>
  ) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      date: 'Hoje',
      helpfulCount: 0,
      ...newRevData
    };

    setReviews([newRev, ...reviews]);
    showToast('Sua avaliação foi publicada no Google Play!');
  };

  const handleSearch = (term: string) => {
    if (term.trim()) {
      showToast(`Pesquisando por "${term}" no Google Play...`);
    }
  };

  const handleTagClick = (tag: string) => {
    showToast(`Filtrando apps da categoria: ${tag}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col text-neutral-800">
      
      {/* Google Play Top Navigation with Admin Button */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'Apps') {
            showToast(`Navegando para a seção de ${tab}`);
          }
        }}
        onSearch={handleSearch}
        showAdminButton={isAdminLink}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* App Hero Header (Icon, Title, Stats, CTAs, Rating Card, Support Accordion) */}
        <AppHero
          app={app}
          onInstallClick={() => setIsInstallModalOpen(true)}
          onShareClick={() => setIsShareModalOpen(true)}
          isWishlisted={isWishlisted}
          onToggleWishlist={handleToggleWishlist}
          installedDeviceName={installedDeviceName}
          onSelectDevicesClick={() => setIsInstallModalOpen(true)}
          onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
          onSaveApp={handleSaveApp}
        />

        {/* Screenshots Media Carousel with Device Tabs & Lightbox */}
        <ScreenshotCarousel
          screenshots={SCREENSHOTS}
          onOpenLightbox={(idx) => setLightboxIndex(idx)}
          appName={app.name}
        />

        {/* Interactive Live Transformation / Features Playground */}
        <InteractivePlayground app={app} />

        {/* About This App (Description, What's New, Tags, Specifications) */}
        <AboutSection
          app={app}
          onTagClick={handleTagClick}
        />

        {/* Data Safety (Verified Google Play Badges & Details Modal) */}
        <DataSafetySection app={app} />

        {/* Ratings and Reviews (Histogram, Star filters, Feedback, Helpfulness voting) */}
        <ReviewsSection
          app={app}
          reviews={reviews}
          onOpenReviewModal={() => setIsReviewModalOpen(true)}
          onVoteHelpful={handleVoteHelpful}
        />

        {/* Similar Recommended Apps */}
        <SimilarAppsSection app={app} onShowToast={showToast} />

      </main>

      {/* Google Play Authentic Footer */}
      <Footer />

      {/* Admin Panel Modal for Changing Logo and Name */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        currentApp={app}
        onSaveApp={handleSaveApp}
        onResetToAssai={handleResetToAssai}
      />

      {/* Interactive Modals */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstallSuccess={handleInstallSuccess}
        app={app}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        appName={app.name}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmitReview={handleSubmitReview}
        appName={app.name}
        developer={app.developer}
      />

      <LightboxModal
        isOpen={lightboxIndex !== null}
        currentIndex={lightboxIndex ?? 0}
        screenshots={SCREENSHOTS}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        appName={app.name}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-2xl border border-neutral-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
