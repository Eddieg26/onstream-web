import { useEffect } from "react";
import { create } from "zustand";
import { Nullable } from "../types";

type Modals = {
    current: Nullable<string>;
    queue: string[];
    isOpen: (modal: string) => boolean;
    open: (modal: string) => void;
    close: (modal: string) => void;
    closeAll: () => void;
};

export const useModalStore = create<Modals>((set, get) => ({
    current: null,
    queue: [],

    isOpen: (modal) => get().current === modal,

    open: (modal) => {
        set((state) => {
            if (!state.queue.includes(modal)) {
                state.queue.unshift(modal);
                state.current = modal;
            }

            return state;
        });
    },
    close: (modal) => {
        set((state) => {
            state.queue = state.queue.filter((m) => m !== modal);
            state.current = state.queue[0] || null;
            return state;
        });
    },
    closeAll: () => {
        set({ current: null, queue: [] });
    },
}));

export function useModals() {
    const modals = useModalStore();

    useEffect(() => {
        const listener = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            modals.closeAll();
        };

        window.addEventListener("beforeunload", listener);

        return () => {
            window.removeEventListener("beforeunload", listener);
        };
    });

    return modals;
}
