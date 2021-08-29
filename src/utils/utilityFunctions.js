export function getRandomColor() {
  //   var letters = '0123456789ABCDEF';
  //   var color = '#';
  //   for (var i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  var letters = 'BCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

export const getFormattedHTML = (html) => {
  let s = html.slice(3, html.length - 5);
  // eslint-disable-next-line no-useless-escape
  let b = s.replaceAll(/\#\w+/g, (s) => '<i>' + s + '</i>');
  b = b.replaceAll(
    /(?=.*\d)^\$(([1-9]\d{0,2}(,\d{3})*)|0)?(\.\d{1,2})?$/g,
    (s) => '<i>' + s + '</i>',
  );
  // eslint-disable-next-line no-useless-escape
  b = b.replaceAll(/\@\w+\s\w+/g, (s) => '<i><b>' + s + '</b></i>');
  return '<p>' + b + '</p>';
};
