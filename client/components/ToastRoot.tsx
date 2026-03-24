"use client";
import { Toast } from "@/components/ui/Toast";
import { useToastStore } from "@/store/useToastStore";
import { useEffect } from "react";

export default function ToastRoot() {
  const { visible, message, type, hideToast } = useToastStore();
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => hideToast(), 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, hideToast]);
  if (!visible) return null;
  return <Toast message={message} type={type} onClose={hideToast} />;
}
