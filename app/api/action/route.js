import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { encrypt } from "../cryptoUtils";

export async function POST(request) {
  let { action, slug, initialQuanitity } = await request.json();
  const uri =
    "mongodb+srv://hardik:buh8AtI0PX94K7g8@cluster.iznlmik.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    const encryptedSlug = encrypt(slug);
    const filter = { slug: encryptedSlug };
    let newQuanity =
      action == "plus"
        ? parseInt(initialQuanitity + 1)
        : parseInt(initialQuanitity - 1);
    const updateDoc = {
      $set: {
        quantity: newQuanity,
      },
    };
    const result = await inventory.updateOne(filter, updateDoc, {});
    return NextResponse.json({ success: true, message: "yes done" });
  } finally {
    await client.close();
  }
}
