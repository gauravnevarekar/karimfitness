export default function WorkoutTodayCard({ workout, blocked }) {
  if (blocked) {
    return (
      <div className="card border border-amber-200 bg-amber-50">
        <p className="font-semibold text-amber-800">Workout locked outside gym WiFi.</p>
        <p className="mt-1 text-sm text-amber-700">Connect to gym WiFi to unlock your plan.</p>
      </div>
    );
  }

  if (!workout?.length) {
    return <div className="card">No workout assigned for today.</div>;
  }

  return (
    <div className="space-y-3">
      {workout.map((item) => (
        <div key={item.id} className="card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{item.exercise_name}</h3>
              <p className="text-sm text-slate-600">
                {item.sets} sets × {item.reps} reps • Rest {item.rest_seconds}s
              </p>
            </div>
            <label className="text-sm font-medium">
              <input className="mr-2" type="checkbox" defaultChecked={item.done} />Done
            </label>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <img src={item.muscle_image_url} className="h-24 w-full rounded-xl object-cover" alt="Target muscle" />
            <img src={item.form_image_url} className="h-24 w-full rounded-xl object-cover" alt="Correct form" />
          </div>
          <a className="mt-3 inline-block text-sm font-semibold text-blue-600" href={item.youtube_url} target="_blank" rel="noreferrer">
            Watch demo video ↗
          </a>
        </div>
      ))}
    </div>
  );
}
