import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function OwnerDashboardPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('owner_daily_dashboard')
        .select('*')
        .order('member_name', { ascending: true });
      setRows(data || []);
    };
    load();
  }, []);

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4">
      <h1 className="text-2xl font-bold">Owner Dashboard</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">Member</th>
              <th className="p-2">Workout</th>
              <th className="p-2">Diet</th>
              <th className="p-2">Latest Weight</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.member_id} className="border-b last:border-none">
                <td className="p-2">{r.member_name}</td>
                <td className="p-2">{r.workout_status}</td>
                <td className="p-2">{r.diet_status}</td>
                <td className="p-2">{r.latest_weight_kg ?? '—'} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
