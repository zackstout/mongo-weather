
# Node-Mongo Weather App: Watching the Watchers

I have no idea why, but we ran into trouble when wrapping everything in a `server` directory.

Steps:
- Every three hours, ten minutes before or after the change, grab the current weather and the next predictions.
- Update database:
  - If datetime exists, and it's not now, add a new prediction.
  - If exists and it is now, add real data.
  - If it doesn't exist, add it and its first prediction.

- Database structure seems clear enough: Each datetime has a list of predictions, and it has real data.
