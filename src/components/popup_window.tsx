import { MdClose } from "react-icons/md";
import PanelIconButton from "./panel_icon_button";

export default function PopupWindow({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  title?: string;
}) {
  return (
    <div
      className="fixed z-90 bg-black/20 inset-0 size-full flex items-center justify-center p-16"
      onClick={() => onClose?.()}
    >
      <div
        className="max-w-lg flex flex-col w-full rounded-lg overflow-hidden shadow-lg relative min-h-32 max-h-full bg-white"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {title && (
          <div className="tc-panel-header flex-none !items-start !pt-4">
            <span className="text-3xl font-display font-medium mt-12 tracking-tight">
              {title}
            </span>
            <PanelIconButton icon={<MdClose />} onClick={() => onClose?.()} />
          </div>
        )}

        <div className="min-h-0 flex-1 flex flex-col h-full">{children}</div>
      </div>
    </div>
  );
}
