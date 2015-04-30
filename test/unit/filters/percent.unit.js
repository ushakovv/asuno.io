/**
 * Created by vasa on 12.07.14.
 */

//jshint ignore:start
/* eslint-disable */

describe('percent filter', function () {
  beforeEach(module('asuno'));

  it('should return valid percentages, given floats from 0 to 1', inject(function (percentFilter) {
    expect(percentFilter(0)).toBe('0%');
    expect(percentFilter(1)).toBe('100%');
    expect(percentFilter(0.5)).toBe('50%');
    expect(percentFilter(0.55)).toBe('55%')
  }));

  it('should parse strings if they are parsable into floats from 0 to 1', inject(function (percentFilter) {
    expect(percentFilter('0')).toBe('0%');
    expect(percentFilter('1')).toBe('100%');
    expect(percentFilter('0.5')).toBe('50%');
    expect(percentFilter('0.55')).toBe('55%')
  }));

  it('should return 100% if given value is >= 1', inject(function (percentFilter) {
    expect(percentFilter(1)).toBe('100%');
    expect(percentFilter(2)).toBe('100%');
    expect(percentFilter('2')).toBe('100%')
  }));

  it('should return 0% if given value is <= 0', inject(function (percentFilter) {
    expect(percentFilter(0)).toBe('0%');
    expect(percentFilter(-0.4)).toBe('0%');
    expect(percentFilter(-1)).toBe('0%');
    expect(percentFilter(-2)).toBe('0%')
  }))
});