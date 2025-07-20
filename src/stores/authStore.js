import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMagicLinkStore = create()(
    persist(
        (set, get) => ({
        magicLink: null,
        expiresAt: null,
    
        setMagicLink: (link) => {
            const expiresInMs = 15 * 60 * 1000;
            const expiresAt = Date.now() + expiresInMs;
    
            set({
                magicLink: link,
                expiresAt,
            });
    
            setTimeout(() => {
                const currentExpiresAt = get().expiresAt;
                if (currentExpiresAt && currentExpiresAt <= Date.now()) {
                    set({ magicLink: null, expiresAt: null });
                }
            }, expiresInMs);
        },
    
        clearMagicLink: () => {
            set({ magicLink: null, expiresAt: null });
        },
    
        isMagicLinkValid: () => {
            const { magicLink, expiresAt } = get();
            return magicLink && expiresAt && Date.now() < expiresAt;
        }
    })
    )
)