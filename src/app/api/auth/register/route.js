export async function POST(request) {
  try {
    const body = await request.json();

    const backendUrl = `http://localhost:8080/api/v1/auth/register`;

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let responseData;
    const contentType = backendResponse.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      responseData = await backendResponse.json();
    } else {
      const text = await backendResponse.text();
      responseData = { message: text || "Response from backend" };
    }

    const statusCode = backendResponse.ok ? 200 : backendResponse.status;

    return new Response(JSON.stringify(responseData), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Register API error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Backend connection failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
