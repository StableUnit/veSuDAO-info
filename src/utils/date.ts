const S_PER_DAY = 60 * 60 * 24;
const S_PER_HOUR = 60 * 60;
const S_PER_MIN = 60;

const TIME_OVER_TEXT = '0d 0h 0m';

export const getDateLeft = (currentTimestamp: number, timestamp: number, showSeconds = false) => {
  let timeLeftText = TIME_OVER_TEXT;

  if (timestamp > currentTimestamp) {
    const diff = timestamp - currentTimestamp;
    const days = Math.floor(diff / S_PER_DAY);
    const hours = Math.floor(
      (diff - days * S_PER_DAY) / S_PER_HOUR
    );
    const min = Math.floor(
      (diff - days * S_PER_DAY - hours * S_PER_HOUR) / S_PER_MIN
    );
    const sec = Math.floor(diff - days * S_PER_DAY - hours * S_PER_HOUR - min * S_PER_MIN);
    timeLeftText = showSeconds ? `${days}d ${hours}h ${min}m ${sec}s` : `${days}d ${hours}h ${min}m`;
  }

  return timeLeftText;
}
