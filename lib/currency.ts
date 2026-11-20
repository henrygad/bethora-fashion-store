export interface NairaInputValue {
  raw: string;
  formatted: string;
}

function groupThousands(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function parseNairaInput(value: string): NairaInputValue {
  const withoutCommas = value.replace(/,/g, "").replace(/[^\d.]/g, "");
  const dotIndex = withoutCommas.indexOf(".");
  const hasDecimalPoint = dotIndex >= 0;
  const integerSource = hasDecimalPoint ? withoutCommas.slice(0, dotIndex) : withoutCommas;
  const decimalSource = hasDecimalPoint
    ? withoutCommas.slice(dotIndex + 1).replace(/\./g, "").slice(0, 2)
    : "";

  if (!integerSource && !hasDecimalPoint) return { raw: "", formatted: "" };

  const integer = (integerSource.replace(/^0+(?=\d)/, "") || "0");
  const decimal = hasDecimalPoint ? `.${decimalSource}` : "";
  return {
    raw: `${integer}${decimal}`,
    formatted: `${groupThousands(integer)}${decimal}`,
  };
}

export function formatNairaForEditing(value: string): string {
  if (!value) return "";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "";
  if (Number.isInteger(amount)) return groupThousands(String(amount));
  return parseNairaInput(value).formatted;
}

export function formatNairaForDisplay(value: string): string {
  if (!value) return "";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "";
  return amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
