import {getSpaceVar} from '@root/Carousel/internal/utils';
import {vars} from '@homebase/core';

test('getSpaceVar', () => {
  expect(getSpaceVar('$500')).toBe(vars.space[500]);
  expect(getSpaceVar('$2500')).toBe(vars.space[2500]);
  expect(getSpaceVar('42px')).toBe('42px');
  expect(getSpaceVar('3%')).toBe('3%');
});
