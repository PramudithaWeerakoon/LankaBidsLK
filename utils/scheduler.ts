// /utils/scheduler.js
import { closeExpiredBids } from "@/actions/bidservice";

function startScheduler() {
  // Run every hour (3600000 milliseconds)
  setInterval(async () => {
    console.log("Running automated bid closing process...");
    await closeExpiredBids();
  }, 3600000);
}

export default startScheduler;
