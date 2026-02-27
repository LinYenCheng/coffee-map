interface ScoreCriteria {
  cheap?: number;
  music?: number;
  quiet?: number;
  seat?: number;
  tasty?: number;
  wifi?: number;
}

function calculateScore({ cheap, music, quiet, seat, tasty, wifi }: ScoreCriteria): number {
  const criteria = { cheap, music, quiet, seat, tasty, wifi };
  // Filter undefined values and handle empty criteria gracefully
  const definedCriteria = Object.entries(criteria)
    .filter(([_key, value]) => value !== undefined)
    .map(([_key, value]) => ({ key: _key, value }));

  if (definedCriteria.length === 0) {
    return 0; // Return 0 for empty criteria to indicate neutrality
  }

  // Calculate score using weighted average with explicit type casts
  const totalScore = definedCriteria.reduce((acc, { value }) => acc + (value as number), 0);
  const averageScore = parseFloat((totalScore / definedCriteria.length).toFixed(1));

  return averageScore;
}

export default calculateScore;
