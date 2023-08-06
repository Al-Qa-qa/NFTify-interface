import { ListItemType } from "@/src/types/data";
import mongoose, { Schema, Document } from "mongoose";

export interface IListedItem extends Document, ListItemType {}

const listedItemSchema: Schema<IListedItem> = new Schema<IListedItem>(
  {
    seller: {
      type: String,
      required: [true, "Listed item should have a seller"],
    },
    nftAddress: {
      type: String,
      required: [true, "Listed item should have a nftAddress"],
    },
    collectionName: {
      type: String,
      required: [true, "Listed item should have a collection name"],
    },
    tokenId: {
      type: String,
      required: [true, "Listed item should have a tokenId"],
    },
    price: {
      type: String,
      required: [true, "Listed item should have a price"],
    },
    tokenURI: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// We will use the schema we have if its existed
// Otherwise, we will create new one using {mongoose.model}
const ListedItems =
  mongoose.models.listedItems ||
  mongoose.model<IListedItem>("listedItems", listedItemSchema);

export default ListedItems;
