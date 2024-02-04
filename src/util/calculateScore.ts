interface ScoreCriteria {
  cheap?: number;
  music?: number;
  quiet?: number;
  seat?: number;
  tasty?: number;
  wifi?: number;
}

function calculateScore({ cheap, music, quiet, seat, tasty, wifi }: ScoreCriteria): number {
  // Create an array to hold only defined values
  const definedValues: any[] = [cheap, music, quiet, seat, tasty, wifi].filter(
    (value) => value !== undefined
  );

  // Check if there are no defined values
  if (definedValues.length === 0) {
    return 0;
  }

  // Calculate average based on the defined values
  const sum: number = definedValues.reduce((total, value) => total + value, 0);
  const score: number = parseFloat((sum / definedValues.length).toFixed(1));
  if (sum === 0) return 0;
  return score;
}

export default calculateScore;
