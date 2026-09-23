const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const store = getStore("orders");
    const body = JSON.parse(event.body);

    const counterRaw = await store.get("counter", { type: "text" });
    const counter = counterRaw ? parseInt(counterRaw) + 1 : 1;
    await store.set("counter", String(counter));

    const order = {
      queue: counter,
      ...body,
      waktu: new Date().toISOString()
    };

    await store.setJSON(`order-${counter}`, order);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, queue: counter })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
