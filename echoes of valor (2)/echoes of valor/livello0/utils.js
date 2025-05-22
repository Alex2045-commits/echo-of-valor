Math.clamp = function (value, min, max) {
  return Math.max(min, Math.min(max, value));
};

Math.lerp = function (start, end, t) {
  return start + (end - start) * t;
};