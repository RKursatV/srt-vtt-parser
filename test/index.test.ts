import { parse } from '@/index';

describe('srt-vtt-parser', () => {
  it('should parse correctly subrip', () => {
    const parsedResult = parse('1\n'
      + '00:01:42,821 --> 00:01:44,289\n'
      + '(SIREN WAILING IN DISTANCE)\n'
      + '\n'
      + '2\n'
      + '00:01:45,365 --> 00:01:48,084\n'
      + '<i>DRIVER: There\'s 100,000 streets in this city.</i>\n'
      + '\n'
      + '3\n'
      + ' 00:01:49,077 --> 00:01:51,421\n'
      + 'You don\'t need to know the route.\n');
    expect(parsedResult.length).toBe(3);
    expect(parsedResult[0]).toEqual({
      id: 1,
      from: 102821,
      to: 104289,
      text: '(SIREN WAILING IN DISTANCE)'
    });
    expect(parsedResult[1]).toEqual({
      id: 2,
      from: 105365,
      to: 108084,
      text: '<i>DRIVER: There\'s 100,000 streets in this city.</i>'
    });

    expect(parsedResult[2]).toEqual({
      id: 3,
      from: 109077,
      to: 111421,
      text: 'You don\'t need to know the route.'
    });
  });
});
