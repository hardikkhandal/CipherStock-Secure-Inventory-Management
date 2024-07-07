import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { decrypt } from "../cryptoUtils";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("query");

  const uri =
    "mongodb+srv://hardik:buh8AtI0PX94K7g8@cluster.iznlmik.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    const products = await inventory
      .aggregate([
        {
          $match: {
            $or: [
              { slug: { $regex: query, $options: "i" } },
              { quantity: { $regex: query, $options: "i" } },
              { price: { $regex: query, $options: "i" } },
            ],
          },
        },
      ])
      .toArray();

    const decryptedProducts = products.map((product) => ({
      ...product,
      slug: decrypt(product.slug),
      quantity: decrypt(product.quantity),
      price: decrypt(product.price),
      // Decrypt other fields if necessary
    }));
    return NextResponse.json({ success: true, products: decryptedProducts });
  } finally {
    await client.close();
  }
}
