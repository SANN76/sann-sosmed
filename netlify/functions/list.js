const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
  try {
    const store = getStore("orders");
    const { blobs } = await store.list();
    const orders = [];

    for (const b of blobs) {
      if (b.key.startsWith("order-")) {
        const data = await store.get(b.key, { type: "json" });
        if (data) orders.push(data);
      }
    }
    orders.sort((a, b) => b.queue - a.queue);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orders)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
