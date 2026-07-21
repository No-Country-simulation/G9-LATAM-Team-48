/**
 * Mock de analytics para alinear front ↔ Data Analysis.
 *
 * Contrato propuesto (ej. GET /api/v1/analytics/overview):
 * {
 *   months: string[]           // claves: january..june (o YYYY-MM)
 *   actualKwh: number[]
 *   predictedKwh: number[]
 *   peakKwh: number[]
 *   offPeakKwh: number[]
 *   category: 'LOW_CONSUMPTION' | 'MEDIUM_CONSUMPTION' | 'HIGH_CONSUMPTION'
 *   confidence: number         // 0..1
 *   cost: number[]             // opcional
 * }
 */
export const analyticsMock = {
  months: ['january', 'february', 'march', 'april', 'may', 'june'],
  actualKwh: [320, 340, 310, 360, 350, 380],
  predictedKwh: [315, 335, 325, 355, 365, 390],
  peakKwh: [95, 110, 88, 125, 118, 140],
  offPeakKwh: [225, 230, 222, 235, 232, 240],
  category: 'MEDIUM_CONSUMPTION',
  confidence: 0.87,
  cost: [240, 255, 232, 270, 262, 285],
}
