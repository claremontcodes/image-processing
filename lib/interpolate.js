function lerp(start, end, t) {
  const dist = end - start;
  return start + t * dist;
}

exports.lerp = lerp;
