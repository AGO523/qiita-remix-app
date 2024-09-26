import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { getCustomers } from "../.server/database";
import type { Customer } from "../types/customer";

export async function loader({ context }: LoaderFunctionArgs) {
  const customers: Customer[] | null = await getCustomers(context);

  if (!customers || customers.length === 0) {
    throw new Response("No customers found", { status: 404 });
  }

  return json(customers);
}

export default function CustomerIndex() {
  const customers = useLoaderData<typeof loader>();

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">顧客一覧</h2>
        <Link to="/customers/new" className="text-blue-500 hover:underline">
          顧客新規作成
        </Link>

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
              <th className="py-2 px-4 text-left font-medium text-gray-600 border-b"></th>
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
                <td className="py-2 px-4 border-b text-gray-500">
                  <Link
                    to={`/customers/${customer.CustomerId}/edit`}
                    className="text-blue-500 hover:underline"
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Outlet />
    </>
  );
}
