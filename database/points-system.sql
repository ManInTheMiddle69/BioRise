-- BioRise points system: database is the single source of truth.
-- Run this once in Supabase SQL Editor.

create or replace function public.recalculate_worker_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.workers w
  set points = coalesce((
    select sum(coalesce(t.points, 0))::integer
    from public.task_workers tw
    join public.tasks t on t.id = tw.task_id
    where tw.worker_id = w.id
      and (t.status = 'completed' or t.progress >= 100)
  ), 0);

  return null;
end;
$$;

-- Recalculate when task progress/status/points changes or a task is removed.
drop trigger if exists biorise_recalculate_points_tasks on public.tasks;
create trigger biorise_recalculate_points_tasks
after insert or update of progress, status, points or delete
on public.tasks
for each statement
execute function public.recalculate_worker_points();

-- Recalculate when workers are assigned/unassigned from tasks.
drop trigger if exists biorise_recalculate_points_assignments on public.task_workers;
create trigger biorise_recalculate_points_assignments
after insert or update or delete
on public.task_workers
for each statement
execute function public.recalculate_worker_points();

-- Repair all existing totals immediately.
update public.workers w
set points = coalesce((
  select sum(coalesce(t.points, 0))::integer
  from public.task_workers tw
  join public.tasks t on t.id = tw.task_id
  where tw.worker_id = w.id
    and (t.status = 'completed' or t.progress >= 100)
), 0);
