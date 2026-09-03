import { cars as allCars } from '../data/cars';

/**
 * Budget-based ML Car Recommender
 *
 * Scoring formula (weighted):
 *   - Price proximity  60%  → how close pricePerDay is to budget
 *   - Rating           25%  → normalised 0–5 star rating
 *   - Popularity       15%  → normalised review count
 *
 * Returns top N cars sorted by score descending.
 */
export function recommendByBudget(budget, topN = 3) {
  const b = Number(budget);
  if (!b || b <= 0) return [];

  let fleet;
  try {
    const stored = localStorage.getItem('drivex_fleet');
    fleet = stored ? JSON.parse(stored) : allCars;
  } catch {
    fleet = allCars;
  }

  const available = fleet.filter((c) => c.available !== false);
  const maxReviews = Math.max(...available.map((c) => c.reviewsCount || 1));

  const scored = available.map((car) => {
    const price = car.pricePerDay || 0;

    // Price proximity: 1.0 = exact match, 0 = ±50% away or more
    const diff = Math.abs(price - b);
    const proximityRaw = Math.max(0, 1 - diff / (b * 0.5));

    const ratingScore     = (car.rating || 0) / 5;
    const popularityScore = (car.reviewsCount || 0) / maxReviews;

    const score =
      proximityRaw    * 0.60 +
      ratingScore     * 0.25 +
      popularityScore * 0.15;

    return { ...car, _score: score };
  });

  return scored
    .filter((c) => c._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, topN);
}
