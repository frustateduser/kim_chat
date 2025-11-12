import crypto from "crypto";

/**
 * Generate a unique conversation ID for two users
 * @param {String} userId1 - The first user's ID
 * @param {String} userId2 - The second user's ID
 * @returns {String} - A unique conversation ID
 */
export function generateConversationId(userId1, userId2) {
  // Sort the user IDs alphabetically to ensure consistent order
  const sortedIds = [userId1, userId2].sort().join("");

  // Create a hash of the sorted IDs
  return crypto.createHash("sha512").update(sortedIds).digest("hex");
}
