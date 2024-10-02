import { getDatabase, connectDatabaseEmulator } from "firebase/database";

const db = getDatabase();
if (location.hostname === "localhost") {
  // Point to the RTDB emulator running on localhost.
  connectDatabaseEmulator(db, "127.0.0.1", 9000);
}
