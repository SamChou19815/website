import type { JsonAny } from "./any-flavors";

export default async function postWithFormData(
  url: string,
  data: Readonly<Record<string, unknown>>,
): Promise<JsonAny> {
  const form = new FormData();
  for (const [k, v] of Object.entries(data)) {
    form.set(k, String(v));
  }
  return await fetch(url, { method: "post", body: form }).then((r) => r.json());
}
