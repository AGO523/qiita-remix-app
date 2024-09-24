import { Outlet } from "@remix-run/react";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">ダッシュボード</h1>

      <Outlet />
    </div>
  );
}
