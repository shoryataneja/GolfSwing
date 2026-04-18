/**
 * @typedef {Object} Score
 * @property {string} id
 * @property {string} user_id
 * @property {number} score - Stableford score, 1–45
 * @property {string} score_date - ISO date string
 * @property {string} created_at
 */

export const SCORE_MIN = 1
export const SCORE_MAX = 45
export const MAX_SCORES_PER_USER = 5
