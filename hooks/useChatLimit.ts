'use client';

import { useEffect, useState } from 'react';
import { safeGet, safeSet } from '@/lib/safeStorage';

export function useChatLimit() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [devBypassLimit, setDevBypassLimit] = useState<boolean>(true);

  useEffect(() => {
    const isEnvDisabled = process.env.NEXT_PUBLIC_DISABLE_CHAT_LIMIT === 'true';
    const stored = safeGet('dev_bypass_chat_limit');
    const next = stored !== null
      ? stored === 'true'
      : isEnvDisabled || process.env.NODE_ENV === 'development';
    queueMicrotask(() => setDevBypassLimit(next));
  }, []);

  useEffect(() => {
    if (!devBypassLimit && chatCount >= 3) {
      queueMicrotask(() => setShowLoginModal(true));
    }
  }, [chatCount, devBypassLimit]);

  const handleContinueLater = () => {
    setShowLoginModal(false);
    if (!devBypassLimit) {
      setIsBlocked(true);
    }
  };

  const handleDevBypass = () => {
    setDevBypassLimit(true);
    setIsBlocked(false);
    setShowLoginModal(false);
    safeSet('dev_bypass_chat_limit', 'true');
  };

  const handleToggleBypass = () => {
    const nextVal = !devBypassLimit;
    setDevBypassLimit(nextVal);
    if (nextVal) setIsBlocked(false);
    safeSet('dev_bypass_chat_limit', String(nextVal));
  };

  return {
    showLoginModal,
    setShowLoginModal,
    chatCount,
    setChatCount,
    isBlocked,
    setIsBlocked,
    devBypassLimit,
    handleContinueLater,
    handleDevBypass,
    handleToggleBypass,
  };
}
