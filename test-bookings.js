const KV_REST_API_URL = "https://exciting-seagull-140906.upstash.io";
const KV_REST_API_TOKEN = "gQAAAAAAAiZqAAIgcDJkNGRiZWZjYmNmZDE0NmUyOGU4MzYwYjJkMTM2NmUyNw";

async function kvGet(key) {
  const res = await fetch(`${KV_REST_API_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
  });
  const data = await res.json();
  if (data.result) {
    try {
      return JSON.parse(data.result);
    } catch (e) {
      return data.result;
    }
  }
  return null;
}

async function kvSet(key, value) {
  const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
  await fetch(`${KV_REST_API_URL}/set/${key}`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
    },
    body: valueStr
  });
}

async function runTests() {
  const existing = (await kvGet('bookings')) || [];
  
  const testBookings = [
    {
      id: "test-confirm-1",
      name: "Test Confirm",
      email: "business@asimetrilab.com",
      treatment: "Acne Clear Laser",
      date: "2026-08-10",
      time: "10:00",
      phone: "123456789",
      status: "pending"
    },
    {
      id: "test-decline-2",
      name: "Test Decline",
      email: "business@asimetrilab.com",
      treatment: "Anti-Aging Facial",
      date: "2026-08-11",
      time: "11:00",
      phone: "123456789",
      status: "pending"
    },
    {
      id: "test-cancel-3",
      name: "Test Cancel",
      email: "business@asimetrilab.com",
      treatment: "Luminous Glass Skin",
      date: "2026-08-12",
      time: "12:00",
      phone: "123456789",
      status: "pending"
    }
  ];

  existing.push(...testBookings);
  await kvSet('bookings', existing);
  console.log("Inserted 3 test bookings into KV. You can now process them from the UI.");
}

runTests();
