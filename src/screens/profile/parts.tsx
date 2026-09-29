import { createPortal } from 'react-dom';
import { SystemAlert, type SystemAlertProps } from '../../components/SystemAlert';

/** Renders a system alert over the phone screen, outside the scrolling area */
export const AlertPortal = (props: SystemAlertProps) => {
  const target = typeof document !== 'undefined' ? document.getElementById('sheet-root') : null;
  return target ? createPortal(<SystemAlert {...props} />, target) : null;
};

/** Sticky bottom action area, same as onboarding's */
export const Footer = ({ children }: { children: React.ReactNode }) => (
  <div className="sticky bottom-0 mt-auto flex flex-col gap-2 border-t border-line bg-canvas/95 px-4 pb-4 pt-3 backdrop-blur">{children}</div>
);
