import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData, Form } from "@remix-run/react";
import { getCustomers, createCustomer } from "../.server/database";
import type { Customer } from "../types/customer";

export async function loader({ context }: LoaderFunctionArgs) {
  const customers: Customer[] | null = await getCustomers(context);

  if (!customers || customers.length === 0) {
    throw new Response("No customers found", { status: 404 });
  }

  return json(customers);
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const companyName = formData.get("CompanyName");
  const contactName = formData.get("ContactName");

  // このバリデーションはあとで変更
  if (typeof companyName !== "string" || typeof contactName !== "string") {
    return json({ error: "Invalid form submission" }, { status: 400 });
  }

  await createCustomer(context, {
    CompanyName: companyName,
    ContactName: contactName,
  });

  return redirect("/customers");
}

export default function Index() {
  const customers = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">ダッシュボード</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">顧客一覧</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">
                CustomerId
              </th>
              <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">
                CompanyName
              </th>
              <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">
                ContactName
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer: Customer) => (
              <tr key={customer.CustomerId} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-gray-500">
                  {customer.CustomerId}
                </td>
                <td className="py-2 px-4 border-b text-gray-500">
                  {customer.CompanyName}
                </td>
                <td className="py-2 px-4 border-b text-gray-500">
                  {customer.ContactName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          顧客新規作成
        </h2>
        <Form method="post" className="space-y-4">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="CompanyName"
              required
              className="w-full px-4 py-2 border bg-inherit text-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label
              htmlFor="contactName"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Contact Name
            </label>
            <input
              type="text"
              id="contactName"
              name="ContactName"
              required
              className="w-full px-4 py-2 border bg-inherit text-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            作成する
          </button>
        </Form>
      </div>
    </div>
  );
}
