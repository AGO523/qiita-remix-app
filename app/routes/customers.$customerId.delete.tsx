import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData, Form } from "@remix-run/react";
import { getCustomerById, deleteCustomer } from "../.server/database";
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/cloudflare";
import type { Customer } from "../types/customer";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const customerId = params.customerId;
  if (!customerId)
    throw new Response("Customer ID is required", { status: 400 });

  const customer: Customer | null = await getCustomerById(
    context,
    parseInt(customerId)
  );
  if (!customer) throw new Response("Customer not found", { status: 404 });

  return json(customer);
}

export async function action({ params, context }: ActionFunctionArgs) {
  const customerId = params.customerId;
  if (!customerId)
    throw new Response("Customer ID is required", { status: 400 });

  await deleteCustomer(context, parseInt(customerId));

  return redirect("/customers");
}

export default function DeleteCustomer() {
  const customer = useLoaderData<Customer>();

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        顧客情報の削除
      </h2>
      <p className="mb-4 text-gray-600">以下の顧客情報を本当に削除しますか？</p>
      <div className="mb-4 text-gray-600">
        <strong>Company Name:</strong> {customer.CompanyName}
      </div>
      <div className="mb-4 text-gray-600">
        <strong>Contact Name:</strong> {customer.ContactName}
      </div>
      <Form method="post">
        <button
          type="submit"
          className="bg-red-500 text-white font-medium px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          削除する
        </button>
      </Form>
    </div>
  );
}
