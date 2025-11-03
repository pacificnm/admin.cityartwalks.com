import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { format, differenceInYears } from 'date-fns';
import relativeTime from 'dayjs/plugin/relativeTime';
// ----------------------------------------------------------------------

dayjs.extend(duration);
dayjs.extend(relativeTime);

export function fBirthdate(birthDate, deathDate) {
  if (!birthDate) return '';

  const birthYear = format(new Date(birthDate), 'yyyy');
  const deathYear = deathDate ? format(new Date(deathDate), 'yyyy') : '';

  const age = deathDate
    ? differenceInYears(new Date(deathDate), new Date(birthDate))
    : differenceInYears(new Date(), new Date(birthDate));

  return deathDate ? `${birthYear} - ${deathYear} (Age: ${age})` : `${birthYear} (Age: ${age})`;
}

/**
 * Docs: https://day.js.org/docs/en/display/format
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Format-Time-Util} - Complete documentation
 */
export const formatStr = {
  dateTime: 'DD MMM YYYY h?:mm a', // 17 Apr 2022 12:00 am
  date: 'DD MMM YYYY', // 17 Apr 2022
  time: 'h?:mm a', // 12:00 am
  split: {
    dateTime: 'DD/MM/YYYY h?:mm a', // 17/04/2022 12:00 am
    date: 'DD/MM/YYYY', // 17/04/2022
  },
  paramCase: {
    dateTime: 'DD-MM-YYYY h?:mm a', // 17-04-2022 12:00 am
    date: 'DD-MM-YYYY', // 17-04-2022
  },
};

export function today(day) {
  return dayjs(new Date()).startOf('day').format(day);
}

// ----------------------------------------------------------------------

/** output: 17 Apr 2022 12:00 am
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Format-Time-Util} - Complete documentation
 */
export function fDateTime(date, day) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).format(day ?? formatStr.dateTime) : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: 17 Apr 2022
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Format-Time-Util} - Complete documentation
 */
export function fDate(date, formating) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).format(formating ?? formatStr.date) : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: 12:00 am
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Format-Time-Util} - Complete documentation
 */
export function fTime(date, formating) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).format(formating ?? formatStr.time) : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: 1713250100
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Format-Time-Util} - Complete documentation
 */
export function fTimestamp(date) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).valueOf() : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: a few seconds, 2 years
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Format-Time-Util} - Complete documentation
 */
export function fToNow(date) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).toNow(true) : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: boolean
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Format-Time-Util} - Complete documentation
 */
export function fIsBetween(inputDate, startDate, endDate) {
  if (!inputDate || !startDate || !endDate) {
    return false;
  }

  const formattedInputDate = fTimestamp(inputDate);
  const formattedStartDate = fTimestamp(startDate);
  const formattedEndDate = fTimestamp(endDate);

  if (formattedInputDate && formattedStartDate && formattedEndDate) {
    return formattedInputDate >= formattedStartDate && formattedInputDate <= formattedEndDate;
  }

  return false;
}

// ----------------------------------------------------------------------

/** output: boolean
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Format-Time-Util} - Complete documentation
 */
export function fIsAfter(startDate, endDate) {
  return dayjs(startDate).isAfter(endDate);
}

// ----------------------------------------------------------------------

/** output: boolean
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Format-Time-Util} - Complete documentation
 */
export function fIsSame(startDate, endDate, units) {
  if (!startDate || !endDate) {
    return false;
  }

  const isValid = dayjs(startDate).isValid() && dayjs(endDate).isValid();

  if (!isValid) {
    return 'Invalid time value';
  }

  return dayjs(startDate).isSame(endDate, units ?? 'year');
}

// ----------------------------------------------------------------------

/** output: * Same day: 26 Apr 2024
 * Same month: 25 - 26 Apr 2024
 * Same month: 25 - 26 Apr 2024
 * Same year: 25 Apr - 26 May 2024
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Format-Time-Util} - Complete documentation
 */
export function fDateRangeShortLabel(startDate, endDate, initial) {
  const isValid = dayjs(startDate).isValid() && dayjs(endDate).isValid();

  const isAfter = fIsAfter(startDate, endDate);

  if (!isValid || isAfter) {
    return 'Invalid time value';
  }

  let label = `${fDate(startDate)} - ${fDate(endDate)}`;

  if (initial) {
    return label;
  }

  const isSameYear = fIsSame(startDate, endDate, 'year');
  const isSameMonth = fIsSame(startDate, endDate, 'month');
  const isSameDay = fIsSame(startDate, endDate, 'day');

  if (isSameYear && !isSameMonth) {
    label = `${fDate(startDate, 'DD MMM')} - ${fDate(endDate)}`;
  } else if (isSameYear && isSameMonth && !isSameDay) {
    label = `${fDate(startDate, 'DD')} - ${fDate(endDate)}`;
  } else if (isSameYear && isSameMonth && isSameDay) {
    label = `${fDate(endDate)}`;
  }

  return label;
}

/** output: '2024-05-28T05?:55:31+00:00'
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Format-Time-Util} - Complete documentation
 */
export function fAdd({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  const result = dayjs()
    .add(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}

/** output: '2024-05-28T05?:55:31+00:00'
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Format-Time-Util} - Complete documentation
 */
export function fSub({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  const result = dayjs()
    .subtract(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}
