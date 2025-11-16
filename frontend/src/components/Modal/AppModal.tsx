import type { ReactNode } from "react";

type AppModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function AppModal({ isOpen, onClose, children }: AppModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
