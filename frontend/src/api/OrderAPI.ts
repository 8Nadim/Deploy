export const placeOrder = async (order: any) => {
  console.log("ORDER SENT TO BACKEND:", order);
  return { success: true };
};
