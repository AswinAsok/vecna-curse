/**
 * @deprecated This file is kept for backward compatibility.
 * Please import from the specific utility modules instead:
 * - checkFieldConditions, doesFieldValidatesConditions from '@/utils/fieldConditions'
 * - extractCountryCode from '@/utils/phoneUtils'
 * - getTicketIdBasedOnRadio from '@/utils/ticketMapping'
 */

// Re-export from new utility modules
export { checkFieldConditions, doesFieldValidatesConditions } from "../../../utils/fieldConditions";
export { extractCountryCode } from "../../../utils/phoneUtils";
export { getTicketIdBasedOnRadio } from "../../../utils/ticketMapping";
