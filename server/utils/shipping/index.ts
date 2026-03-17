/**
 * Shipping Router
 *
 * Single point of truth for provider selection.
 * ─────────────────────────────────────────────────────────────
 *  Nigeria (NG) → Sendbox   (interim, swap for own platform later)
 *  Everything else → Shippo (international)
 * ─────────────────────────────────────────────────────────────
 *
 * To swap Sendbox for your own logistics platform:
 *   1. Implement IShippingProvider in a new file
 *   2. Replace `sendboxProvider` with your implementation below
 *   3. Done — zero other changes needed
 */

import { sendboxProvider } from './sendbox'
import { shippoProvider } from './shippo'
import type { IShippingProvider } from './types'

export function getShippingProvider(destinationCountry: string): IShippingProvider {
  if (destinationCountry?.toUpperCase() === 'NG') {
    return sendboxProvider
  }
  return shippoProvider
}

// Re-export types for convenience
export type {
  IShippingProvider,
  IGetRatesPayload,
  IShipmentRate,
  ICreateShipmentPayload,
  IShipmentResult,
  ITrackingResult,
  IAddress,
  IParcel,
  TrackingStatus,
} from './types'
