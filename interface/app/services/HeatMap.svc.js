(function () {
  'use strict';

  function HeatMap() {

    var self = this;

    this._normalize = function (numbers) {
      numbers = _(numbers).pluck('number');
      var max = numbers.max();
      return numbers.map((n) => n === 0 ? 0 : n / max).value();
    };

    this._mapTimeline = function (timeline, begin, end) {
      var count = Math.min(200, Math.ceil((end - begin) / 1000));
      var start = new Date(begin).getTime();
      var tick = Math.ceil((end - begin) / count);
      var next = new Date(start + tick).getTime();
      var result = [];

      var _checkItem = (item) => item.timestamp >= start && item.timestamp < next;

      for (let i = 0; i < count; i++) {
        var slice = timeline.filter(_checkItem);
        result.push({
          number: slice.length,
          start,
          next
        });
        start = next;
        next = next + tick;
      }

      return result;
    };

    this._generateColor = function (value) {
      value = Math.max(Math.min(value, 1), 0);
      if (value === 0) {
        return 'transparent';
      } else {
        const green = Math.floor(255 * (1 - value * value)),
          blue = Math.floor(128 * (1 - value));

        // TODO eslint-wait babel/babel-eslint#31
        return `rgba(${255}, ${green}, ${blue}, 0.2)`; // eslint-disable-line comma-spacing
      }
    };

    this.createHeatMap = function (timeline, begin, end) {
      var counts = this._mapTimeline(timeline, begin, end);
      var normalizedCounts = this._normalize(counts);

      var width = `${100 / counts.length}%`;

      return normalizedCounts.map(function (count, idx) {
        return {
          start: counts[idx].start,
          end: counts[idx].next,
          style: {
            width, 'background-color': self._generateColor(count)
          }
        };
      });
    };

  }

  angular.module('asuno.services').service('HeatMap', HeatMap);
})();
