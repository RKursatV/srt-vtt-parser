interface Timeline {
  from: number;
  to: number;
}

export const parse = (rawSrt: String): any[] => {
  // log('start parsing');

  const srtRawLine = rawSrt.split(/\n/);
  let isNewEntry = true;
  let isTimeLine = true;
  let currentId = -1;
  let currentTimeLine: Timeline | null = null;
  let currentText = '';
  // @ts-ignore
  const result = [];
  srtRawLine.forEach((value) => {
    // log('current element:' + value);

    if (isNewEntry === true) {
      currentId = parseInt(value, 10);
      if (isNaN(currentId)) {
        // log('Line is NaN, skip line');
        return;
      }
      // log(`id:  ${currentId}`);

      isNewEntry = false;
    } else {
      if (isTimeLine === true) {
        // log(`timeline: ${value}`);
        currentTimeLine = extractTimeLine(value);
        // log(`parsed timeline: ${currentTimeLine}`);
        isTimeLine = false;
        return;
      }

      if (isBlank(value) === false) {
        // log(`subtitle line: ${value}`);
        currentText += value;
        // log(`concat subtitle line: ${currentText}`);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      result.push(createSubtitleEntry(currentId, currentTimeLine.from, currentTimeLine.to, currentText));

      isNewEntry = true;
      isTimeLine = true;
      currentText = '';
    }
  });
  // log(`parsing done. entry size: ${result.length}`);
  // @ts-ignore
  return result;
};

const isBlank = (str: string) => !str || /^\s*$/.test(str);
const createSubtitleEntry = (id: number, from: number, to: number, text: string) => ({
  id,
  from,
  to,
  text
});

//maybe exclude from this function for easy replace of parser strategy
const extractTimeLine = (value: string): Timeline => {
  const [leftSide, rightSide] = value.split('-->');

  return {
    from: timestampToMillisecond(leftSide),
    to: timestampToMillisecond(rightSide)
  };
};

function timestampToMillisecond(value: string) {
  const [hours, minutes, seconds] = value.split(':');
  let milliseconds = parseInt(seconds.replace(',', ''), 10);
  milliseconds += parseInt(minutes, 10) * 60 * 1000;
  milliseconds += parseInt(hours, 10) * 60 * 60 * 1000;
  return milliseconds;
}
