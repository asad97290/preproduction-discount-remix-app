import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

 

  return new Response(
    JSON.stringify({
      message: "Webhook received",
      topic,
      shop,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );};
