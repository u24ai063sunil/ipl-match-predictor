export async function predictMatch(payload) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});


  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return await res.json();
}
