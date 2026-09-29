import { CloudSlash, ContactlessPayment, LockOpen } from '@phosphor-icons/react';

/** Why express mode is worth adding: shared by the Wallet sheet and the onboarding step */
export const WALLET_POINTS = [
  { icon: ContactlessPayment, key: 'wallet.point1' },
  { icon: LockOpen, key: 'wallet.point2' },
  { icon: CloudSlash, key: 'wallet.point3' },
] as const;
