import type { AppLoadContext } from "@remix-run/cloudflare";
import type { Customer } from "../types/customer";

export async function getCustomers(
  context: AppLoadContext
): Promise<Customer[] | null> {
  const env = context.cloudflare.env;
  const db = env.DB;

  const response = await db.prepare("SELECT * FROM customers").all();

  if (!response.success) {
    return null;
  }

  return response.results as Customer[];
}

export async function createCustomer(
  context: AppLoadContext,
  newCustomer: { CompanyName: string; ContactName: string }
) {
  const env = context.cloudflare.env;
  const db = env.DB;

  const response = await db
    .prepare(`INSERT INTO customers (CompanyName, ContactName) VALUES (?, ?)`)
    .bind(newCustomer.CompanyName, newCustomer.ContactName)
    .run();

  if (!response.success) {
    throw new Error("Failed to create customer");
  }

  return response.results;
}
