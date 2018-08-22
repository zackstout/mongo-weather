
# Node-Mongo Weather App: Watching the Watchers
Ping the Open Weather API every 3 hours, grabbing its new prediction and storing data about the current weather. After a week or so, we'll have some data to analyze (how well do they predict?).

## Steps:
- Every three hours, ten minutes before or after the change, grab the current weather and the next predictions.
- Update database:
  - If datetime exists, and it's not now, add a new prediction.
  - If exists and it is now, add real data.
  - If it doesn't exist, add it and its first prediction.

- Database structure seems clear enough: Each datetime has a list of predictions, and it has real data.

## Built With:
- Mongoose
- Express
- node-schedule
- Moment.js
- Open Weather API

## Notes to self:
- I have no idea why, but we ran into trouble when wrapping everything in a `server` directory.
- Wait what about max and min temp? Why are they always the same as predicted temp? They don't do ranges?
