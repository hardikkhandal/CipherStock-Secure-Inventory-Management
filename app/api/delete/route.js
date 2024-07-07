import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { encrypt } from "../cryptoUtils";

export async function DELETE(request) {
  let { slug } = await request.json();
  const uri =
    "mongodb+srv://hardik:buh8AtI0PX94K7g8@cluster.iznlmik.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    const encryptedSlug = encrypt(slug);
    const filter = { slug: encryptedSlug };
    const result = await inventory.deleteOne(filter, {});
    if (result.deletedCount === 1) {
      return NextResponse.json({
        success: true,
        message: "Item deleted successfully.",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "No item found with the specified slug.",
      });
    }
  } finally {
    await client.close();
  }
}
