# BioRise V1

BioRise is a responsive workforce-management prototype for a private farm/land operation.

## Included now
- Admin dashboard
- Worker account creation and enable/disable
- Admin-only login information view
- Tasks assigned to one or multiple workers
- Task progress, priority, timing, locations, recurring flag and checklists
- Objectives whose progress is calculated from linked tasks
- Weekly planning view
- Attendance records
- Locations
- Global worker points / leaderboard
- Worker mobile-focused dashboard, tasks, planning, leaderboard and profile
- Light/dark mode
- PWA/offline foundation
- Automatic local session expiry
- Supabase-ready project structure and SQL blueprint

## Important: this ZIP is a working local prototype, not production security
The demo stores data and demo passcodes in the browser's localStorage so you can test the entire interface without setting up a backend.

Demo:
- Admin: `ADMIN001` / `admin123`
- Worker: `WRK001` / `worker123`

Do NOT deploy this demo authentication as a real employee system. Before real use, connect Supabase, hash/secure credentials server-side, enable Row Level Security, and remove demo credentials.

## Run it
Because BioRise uses JavaScript modules and a service worker, use a small local web server instead of double-clicking HTML files.

Easy VS Code option:
1. Open the BioRise folder.
2. Install the "Live Server" extension if you don't already have it.
3. Right-click `index.html` -> Open with Live Server.

Or from a terminal with Python installed:
`python -m http.server 5500`

Then open:
`http://localhost:5500`

## Next development stage
Approve/refine the UI and workflow first. Then connect the existing pages to Supabase and implement production authentication + permissions.


## V1.1 changes
Admin selection/edit/remove controls for workers, tasks, objectives and locations; dashboard charts; worker weekly chart; worker planning now uses the admin calendar design.

## V1.2 fix
Fixed admin CRUD initialization for Workers, Tasks, Objectives and Locations, added safe stored-data migration, and bumped the offline cache so updated JavaScript is loaded.
