//mongodb+srv://hardik_khandal:Z4cLVgFcRy2HNOlb@cluster.iznlmik.mongodb.net/

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { encrypt, decrypt } from "../cryptoUtils";

export async function GET(request) {
  const uri =
    "mongodb+srv://hardik:buh8AtI0PX94K7g8@cluster.iznlmik.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    client.connect();
    const database = client.db("stock");
    const inventory = database.collection("inventory");
    const query = {};
    const products = await inventory.find(query).toArray();

    const decryptedProducts = products.map((product) => ({
      ...product,
      slug: decrypt(product.slug),
      quantity: decrypt(product.quantity),
      price: decrypt(product.price),
    }));

    return NextResponse.json({ success: true, products: decryptedProducts });
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  let body = await request.json();
  const uri =
    "mongodb+srv://hardik:buh8AtI0PX94K7g8@cluster.iznlmik.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    // Encrypt sensitive fields
    const encryptedBody = {
      ...body,
      slug: encrypt(body.slug),
      quantity: encrypt(body.quantity),
      price: encrypt(body.price),
    };
    console.log(encryptedBody);

    const product = await inventory.insertOne(encryptedBody);

    return NextResponse.json({ product, ok: true });
  } finally {
    await client.close;
  }
}

process.on("unhandledRejection", (err) => {
  console.error(err);
  client.close();
});
