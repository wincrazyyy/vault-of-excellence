export function evaluateQuestRules(rules: any[], actualData: Record<string, any>): boolean {
  if (!rules || rules.length === 0) return true;

  for (const rule of rules) {
    const actualValue = actualData[rule.field];

    switch (rule.operator) {
      case "gt":
        if (!(actualValue > rule.value)) return false;
        break;
      case "gte":
        if (!(actualValue >= rule.value)) return false;
        break;
      case "eq":
        if (actualValue !== rule.value) return false;
        break;
      case "truthy":
        // Checks if the string/object exists and isn't empty
        if (!actualValue || (typeof actualValue === 'string' && actualValue.trim() === '')) return false;
        break;
      case "has_length":
        if (!(Array.isArray(actualValue) && actualValue.length >= rule.value)) return false;
        break;
      default:
        return false;
    }
  }

  return true;
}
