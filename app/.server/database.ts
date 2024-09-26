import type { AppLoadContext } from "@remix-run/cloudflare";
import type { Customer } from "../types/customer";
import { z } from "zod";

const CustomerSchema = z.object({
  CompanyName: z.string().min(1).max(100),
  ContactName: z.string().min(1).max(100),
});

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

export async function getCustomerById(
  context: AppLoadContext,
  customerId: number
): Promise<Customer | null> {
  const env = context.cloudflare.env;
  const db = env.DB;
  const response = await db
    .prepare("SELECT * FROM customers WHERE CustomerId = ?")
    .bind(customerId)
    .first();

  if (response === null) {
    return null;
  }

  return response as Customer;
}

export async function createCustomer(
  context: AppLoadContext,
  formData: FormData
) {
  const env = context.cloudflare.env;
  const db = env.DB;
  const formObject = {
    CompanyName: formData.get("CompanyName"),
    ContactName: formData.get("ContactName"),
  };

  const results = CustomerSchema.safeParse(formObject);
  if (!results.success) {
    throw new Error("Invalid form data");
  }

  const response = await db
    .prepare(`INSERT INTO customers (CompanyName, ContactName) VALUES (?, ?)`)
    .bind(results.data.CompanyName, results.data.ContactName)
    .run();

  if (!response.success) {
    throw new Error("Failed to create customer");
  }

  return response.results;
}

export async function updateCustomer(
  context: AppLoadContext,
  customerId: number,
  formData: FormData
) {
  const env = context.cloudflare.env;
  const db = env.DB;

  const results = CustomerSchema.safeParse({
    CompanyName: formData.get("CompanyName"),
    ContactName: formData.get("ContactName"),
  });
  if (!results.success) {
    throw new Error("Invalid form data");
  }

  const response = await db
    .prepare(
      `UPDATE customers SET CompanyName = ?, ContactName = ? WHERE CustomerId = ?`
    )
    .bind(results.data.CompanyName, results.data.ContactName, customerId)
    .run();

  if (!response.success) {
    throw new Error("Failed to update customer");
  }

  return response.results;
}

export async function deleteCustomer(
  context: AppLoadContext,
  customerId: number
) {
  const env = context.cloudflare.env;
  const db = env.DB;

  const response = await db
    .prepare(`DELETE FROM customers WHERE CustomerId = ?`)
    .bind(customerId)
    .run();

  if (!response.success) {
    throw new Error("Failed to delete customer");
  }

  return response.results;
}
