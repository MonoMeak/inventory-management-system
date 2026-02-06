import { defineStore } from "pinia";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export const useToastStore = defineStore("toast", {
  state: () => ({
    toasts: [] as Toast[],
  }),

  actions: {
    addToast(message: string, type: Toast["type"] = "info", duration = 3000) {
      const id = Date.now().toString() + Math.random().toString(36);
      const toast: Toast = { id, message, type, duration };

      this.toasts.push(toast);

      if (duration > 0) {
        setTimeout(() => {
          this.removeToast(id);
        }, duration);
      }
    },

    removeToast(id: string) {
      const index = this.toasts.findIndex((t) => t.id === id);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    },

    success(message: string, duration = 3000) {
      this.addToast(message, "success", duration);
    },

    error(message: string, duration = 5000) {
      this.addToast(message, "error", duration);
    },

    info(message: string, duration = 3000) {
      this.addToast(message, "info", duration);
    },

    warning(message: string, duration = 4000) {
      this.addToast(message, "warning", duration);
    },
  },
});
