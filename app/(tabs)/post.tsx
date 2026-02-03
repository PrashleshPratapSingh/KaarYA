import { Redirect } from "expo-router";

// This is a placeholder - the FAB button navigates directly to /post-gig
// This screen should never actually be shown
export default function PostScreen() {
    return <Redirect href="/post-gig" />;
}
