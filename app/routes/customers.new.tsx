import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { createCustomer } from "../.server/database";

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  await createCustomer(context, formData);

  return redirect("/customers");
}

export default function CustomerNew() {
  return (
    <>
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
    </>
  );
}
