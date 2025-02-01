"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "./modal";
import { Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const AlertModal = (props: Props) => {
  const { isOpen, onClose, onConfirm, loading } = props;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title="Emin misiniz?"
      description="Bu işlem geri alınamaz."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-center w-full sm:justify-end">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          İptal
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Devam et"}
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
