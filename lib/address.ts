import type { Address } from "@/types";

type AddressLocation = Pick<Address, "address" | "city" | "lga" | "state">;

export function formatDeliveryAddress(address: Partial<AddressLocation>): string {
  return [
    address.address,
    address.city,
    address.lga ? `${address.lga} LGA` : "",
    address.state,
  ].filter((part): part is string => Boolean(part?.trim())).join(", ");
}

export function isNigerianPhone(value: string): boolean {
  const compact = value.replace(/[\s()-]/g, "");
  return /^(?:0\d{10}|\+?234\d{10})$/.test(compact);
}
