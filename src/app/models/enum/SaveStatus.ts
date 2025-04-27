enum SaveStatus {
    Idle = "Idle", // Initial state or after successful save
    Connecting = "Connecting", // Initial connection or reconnection
    Saving = "Saving", // Actively saving changes
    Saved = "Saved", // Changes successfully saved
    Error = "Error", // An error occurred during saving
}

export default SaveStatus;
