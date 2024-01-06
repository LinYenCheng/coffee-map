function calculateScore({ cheap, music, quiet, seat, tasty, wifi }) {
  // Create an array to hold only defined values
  const definedValues = [cheap, music, quiet, seat, tasty, wifi].filter(
    (value) => value !== undefined,
  );

  // Check if there are no defined values
  if (definedValues.length === 0) {
    return 'Cannot calculate score: No defined criteria';
  }

  // Calculate average based on the defined values
  const sum = definedValues.reduce((total, value) => total + value, 0);
  const score = (sum / definedValues.length).toFixed(1);
  if (sum === 0) return '';
  return score;
}

export default calculateScore;
