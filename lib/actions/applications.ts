const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "HTTP://localhost:5000";

export async function applyTojob(data: Record<string, unknown>) {
  const response = await fetch(`${BASE_URL}/jobs/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
    if (!response.ok) {
        throw new Error("Failed to apply to job");
    }
    return response.json();
}
