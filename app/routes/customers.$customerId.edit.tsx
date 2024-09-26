import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData, Form } from "@remix-run/react";
import { getCustomerById, updateCustomer } from "../.server/database";
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

export async function action({ request, context, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const customerId = params.customerId;
  if (!customerId)
    throw new Response("Customer ID is required", { status: 400 });

  await updateCustomer(context, parseInt(customerId), formData);

  return redirect("/customers");
}

export default function EditCustomer() {
  const customer = useLoaderData<Customer>();

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        顧客情報編集
      </h2>
      <Form method="post" className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-600 mb-1"
            htmlFor="companyName"
          >
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="CompanyName"
            defaultValue={customer.CompanyName}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 bg-inherit text-gray-500"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-600 mb-1"
            htmlFor="contactName"
          >
            Contact Name
          </label>
          <input
            type="text"
            id="contactName"
            name="ContactName"
            defaultValue={customer.ContactName}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 bg-inherit text-gray-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          更新
        </button>
      </Form>
    </div>
  );
}
