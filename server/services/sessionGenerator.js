/**
 * Session generation for Guild scheduling.
 *
 * Given a start date and one or more weekly recurring slots (dayOfWeek +
 * time range), walks the calendar day by day from the start date and emits
 * one session for every matching slot, in chronological order, until
 * `totalSessions` have been produced.
 *
 * This is deliberately calendar-driven (not "add 7 days per week") so it
 * naturally supports multiple slots per week landing on different
 * weekdays (e.g. Mon/Tue/Thu) without special-casing.
 */

/**
 * @param {Object} params
 * @param {Date|string} params.startDate
 * @param {Array<{dayOfWeek:number, startTime:string, endTime:string}>} params.weeklySlots
 * @param {number} params.totalSessions
 * @returns {Array<{sessionNumber:number, date:Date, startTime:string, endTime:string}>}
 */
function generateSessionDates({ startDate, weeklySlots, totalSessions }) {
  if (!weeklySlots || weeklySlots.length === 0) {
    throw new Error("At least one weekly time slot is required");
  }
  if (!totalSessions || totalSessions < 1) {
    throw new Error("totalSessions must be at least 1");
  }

  // Sort slots by day-of-week so that within the same calendar day/week,
  // sessions come out in a stable, predictable order.
  const sortedSlots = [...weeklySlots].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const sessions = [];
  let cursor = new Date(start);
  // Safety cap so a bad config (e.g. no slot ever matches) can't loop forever.
  const MAX_DAYS_TO_SCAN = 366 * 5;
  let daysScanned = 0;

  while (sessions.length < totalSessions && daysScanned < MAX_DAYS_TO_SCAN) {
    const dayOfWeek = cursor.getDay();
    const matchingSlots = sortedSlots.filter((s) => s.dayOfWeek === dayOfWeek);

    for (const slot of matchingSlots) {
      if (sessions.length >= totalSessions) break;
      sessions.push({
        sessionNumber: sessions.length + 1,
        date: new Date(cursor),
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    }

    cursor.setDate(cursor.getDate() + 1);
    daysScanned += 1;
  }

  if (sessions.length < totalSessions) {
    throw new Error(
      "Could not generate the requested number of sessions from the given weekly slots " +
        "(no matching weekday found within a 5-year scan window — check dayOfWeek values).",
    );
  }

  return sessions;
}

/**
 * Validates a startTime/endTime pair actually spans sessionDuration hours.
 * Used to catch admin input mistakes (e.g. picking 4-hour duration but a
 * 09:00-13:00... wait that IS 4 hours; a 09:00-12:00 slot would be 3).
 */
function slotDurationHours(startTime, endTime) {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
}

function validateSlotsMatchDuration(weeklySlots, sessionDuration) {
  const mismatched = weeklySlots.filter(
    (s) => slotDurationHours(s.startTime, s.endTime) !== sessionDuration,
  );
  if (mismatched.length > 0) {
    throw new Error(
      `These slots don't match the selected session duration (${sessionDuration}h): ` +
        mismatched.map((s) => `${s.startTime}-${s.endTime}`).join(", "),
    );
  }
}

module.exports = { generateSessionDates, validateSlotsMatchDuration, slotDurationHours };
