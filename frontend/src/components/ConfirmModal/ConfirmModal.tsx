import type { ConfirmModalProps } from "../../types/interfaces/IConfirmModal";
import AppButton from "../Button/AppButton";
import AppModal from "../Modal/AppModal";



export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
}: ConfirmModalProps) => {
  return (
    <AppModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 max-w-sm">
        <h2 className="text-xl font-bold text-gray-800">
            {title}
        </h2>
        
        <p className="text-gray-600">
            {description}
        </p>
        
        <div className="flex justify-end gap-3 mt-4">
          <AppButton 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </AppButton>
          
          <AppButton 
            type="button" 
            variant="primary" 
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </AppButton>
        </div>
      </div>
    </AppModal>
  );
};