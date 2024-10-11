import auth from "@/auth";
import { Session } from "inspector/promises";

const SettingsPage = async () => {
    // You can perform async operations here, such as fetching data
    // const data = await fetchData();

    return (
        <div>
            <h1>Settings Page</h1>
            <p>Current user: {auth}</p>
        </div>
    );
};

export default SettingsPage;