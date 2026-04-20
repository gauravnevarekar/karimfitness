import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useWifiGate } from '../hooks/useWifiGate';
import WorkoutTodayCard from '../components/WorkoutTodayCard';

function currentWeekday() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
}

export default function MemberHomePage({ profile }) {
  const { isGymNetwork, loading } = useWifiGate();
  const [workout, setWorkout] = useState([]);
  const [diet, setDiet] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!profile) return;
      const day = currentWeekday();
      const { data: workoutData } = await supabase
        .from('workout_items')
        .select('*')
        .eq('member_id', profile.id)
        .eq('weekday', day)
        .order('position', { ascending: true });
      const { data: dietData } = await supabase
        .from('diet_items')
        .select('*')
        .eq('member_id', profile.id)
        .order('meal_order', { ascending: true });

      setWorkout(workoutData || []);
      setDiet(dietData || []);
    };

    load();
  }, [profile]);

  const blocked = !loading && !isGymNetwork;

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="text-2xl font-bold">Hi {profile?.name}</h1>
      <section>
        <h2 className="mb-2 text-lg font-semibold">Today's Workout</h2>
        <WorkoutTodayCard workout={workout} blocked={blocked} />
      </section>
      <section>
        <h2 className="mb-2 text-lg font-semibold">Daily Diet (global access)</h2>
        <div className="space-y-2">
          {diet.map((meal) => (
            <label key={meal.id} className="card flex items-center justify-between">
              <span>
                <strong>{meal.meal_name}</strong> — {meal.items}
              </span>
              <input type="checkbox" defaultChecked={meal.done_today} />
            </label>
          ))}
        </div>
      </section>
    </main>
  );
}
