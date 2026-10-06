import { Trip } from '../types';

/**
 * Generate standard RFC 5545 iCalendar (.ics) format file string
 */
export function generateICalendarFile(trip: Trip): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const formatICSDate = (dateStr: string, timeStr: string, isEnd = false): string => {
    // Attempt parsing date
    const d = new Date(dateStr);
    const year = isNaN(d.getFullYear()) ? 2026 : d.getFullYear();
    const month = isNaN(d.getMonth()) ? 10 : d.getMonth() + 1;
    const day = isNaN(d.getDate()) ? 15 : d.getDate();

    // Parse time like "09:00 AM - 11:30 AM" or "02:30 PM"
    let hour = 9;
    let minute = 0;

    const parts = timeStr.split('-');
    const targetPart = (isEnd && parts[1]) ? parts[1].trim() : parts[0].trim();
    const timeMatch = targetPart.match(/(\d+):(\d+)\s*(AM|PM)?/i);

    if (timeMatch) {
      hour = parseInt(timeMatch[1], 10);
      minute = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3]?.toUpperCase();
      if (ampm === 'PM' && hour < 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
    } else if (isEnd) {
      hour += 2;
    }

    return `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00Z`;
  };

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TripChain Protocol//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:TripChain - ${trip.title}`,
    'X-WR-TIMEZONE:UTC',
  ];

  trip.days.forEach(day => {
    day.activities.forEach(activity => {
      const dtStart = formatICSDate(day.date, activity.time, false);
      const dtEnd = formatICSDate(day.date, activity.time, true);
      const uid = `tripchain-${trip.id}-${activity.id}@tripchain.xyz`;

      lines.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `SUMMARY:${activity.title}`,
        `DESCRIPTION:${activity.description.replace(/\n/g, '\\n')} (Est. Cost: $${activity.estimatedCost})`,
        `LOCATION:${activity.location}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `STATUS:CONFIRMED`,
        `CATEGORIES:${activity.category.toUpperCase()}`,
        'END:VEVENT'
      );
    });
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Triggers instant browser download of the .ics file
 */
export function downloadICalendar(trip: Trip): void {
  const icsContent = generateICalendarFile(trip);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${trip.destination.toLowerCase().replace(/\s+/g, '_')}_itinerary.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
