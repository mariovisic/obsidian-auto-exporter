const hours = `\\d{1,2}`;
const minutes = `\\d{2}`;
const hourMinuteSeparator = `[:. ]`;
const amPm = "\\s?[apAP][mM](?!\\w)";

const time = `(${hours})(?:${hourMinuteSeparator}?(${minutes}))?(${amPm})?`;
const timeFromStartRegExp = new RegExp(`^${time}`);

// Taken from obsidian-day-planner
export default function parseTime(text?: string): string | undefined {
  if (text) {
    const result = timeFromStartRegExp.exec(text);

    if (result !== null) {
      const [, hours, minutes, ampm] = result;
      let parsedHours = parseInt(hours);

      if (!isNaN(parsedHours)) {
        const parsedMinutes = parseInt(minutes) || 0;

        if (ampm?.toLowerCase().trim() === "pm" && parsedHours < 12) {
          parsedHours += 12;
        }

        if (ampm?.toLowerCase().trim() === "am" && parsedHours === 12) {
          parsedHours = 0;
        }

        return `${String(parsedHours).padStart(2, '0')}:${String(parsedMinutes).padStart(2, '0')}`
      }
    }
  }
}

