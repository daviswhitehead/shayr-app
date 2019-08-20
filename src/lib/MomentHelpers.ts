import moment from 'moment';

export const initializeMoment = () => {
  moment.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ',
      s: '1s',
      m: '1m',
      mm: '%dm',
      h: '1h',
      hh: '%dh',
      d: '1d',
      dd(number) {
        const weeks = Math.round(number / 7);
        if (number < 7) {
          return number + 'd';
        }
        return weeks + 'w';
      },
      M: '1 month',
      MM: '%d months',
      y: '1y',
      yy: '%dy'
    }
  });
  moment.relativeTimeThreshold('d', 365);
};
