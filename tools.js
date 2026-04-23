export async function get_customer_profile(customer_id) {
  return {
    customer_id,
    name: "John Doe",
    email: "john@example.com",
    status: "active",
  };
}

export async function list_open_orders(customer_id) {
  return [
    {
      order_id: "ORD123",
      status: "processing",
      amount: 120,
    },
    {
      order_id: "ORD124",
      status: "pending",
      amount: 80,
    },
    {
      order_id: "ORD125",
      status: "shipped",
      amount: 900,
    },
  ];
}
