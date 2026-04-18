/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} full_name
 * @property {'user'|'admin'} role
 * @property {string|null} charity_id
 * @property {number} charity_pct - 10–100
 * @property {string} created_at
 */

/**
 * @typedef {Object} Subscription
 * @property {string} id
 * @property {string} user_id
 * @property {'monthly'|'yearly'} plan
 * @property {'active'|'inactive'|'expired'|'cancelled'} status
 * @property {number} amount
 * @property {string} expires_at
 */

export const ROLES = { USER: 'user', ADMIN: 'admin' }
export const SUBSCRIPTION_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive', EXPIRED: 'expired', CANCELLED: 'cancelled' }
export const PLANS = { MONTHLY: 'monthly', YEARLY: 'yearly' }
