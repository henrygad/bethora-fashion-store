import { describe, expect, it } from "vitest";
import { WHATSAPP_NUMBER, WHATSAPP_URL } from "@/lib/contact";
import { productUrl, SITE_URL } from "@/lib/site";

describe("deployment-safe public links", () => {
  it("uses the current WhatsApp destination", () => {
    expect(WHATSAPP_NUMBER).toBe("2349123854353");
    expect(WHATSAPP_URL).toBe("https://wa.me/2349123854353");
  });

  it("creates absolute, encoded product URLs", () => {
    expect(productUrl("product 123")).toBe(`${SITE_URL}/products/product%20123`);
  });
});
