import connectDB from "@/lib/connectDB";
import ListedItems, { IListedItem } from "@/lib/listedItemsSchema";
import { ErrorRespond, SuccessRespond } from "@/src/types/server";
import type { NextApiRequest, NextApiResponse } from "next/types";

// Get an item by nftAddress and tokenId
export const getItem = async (
  req: NextApiRequest,
  res: NextApiResponse<SuccessRespond | ErrorRespond>
) => {
  await connectDB();

  // When we get an item we use nftAddress and tokenId to get the item

  const { slug } = req.query;

  // If there are errors in parameters
  // NOTE: params value are taken from the url so it will be incorrect sometime
  // slug should consists of two values in array [nftAddress, tokenId], so we will respond to
  // error if the slug is in correct
  if (!slug || slug[0] === "undefined" || slug[1] == "undefined") {
    res.status(400).json({
      status: "error",
      message:
        "There is a missing in parameters, please provide an NFT address and token ID in url parameters",
      error:
        "There is a missing in parameters, please provide an NFT address and token ID in url parameters",
    });
    return;
  }

  const [nftAddress, tokenId] = slug as [string, string];

  try {
    // Get the item from our database
    // - nftAddress should be in case insensitive as addresses may be in uppercase or lowercase
    // - Its more accurate to make nftAddress and tokenId as a unique complex key in the database, but we didint do this
    const item: IListedItem | null = await ListedItems.findOne<IListedItem>({
      nftAddress: { $regex: nftAddress, $options: "i" },
      tokenId,
    });

    // Return error if the item is not existed
    if (!item) {
      res.status(400).json({
        status: "error",
        message: "There is no item listed with this NFT address and tokenId",
        error: "There is no item listed with this NFT address and tokenId",
      });
      return;
    }

    // Return the item with this nftAddress and tokenId
    res.status(200).json({
      status: "success",
      item,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error,
    });
  }
};

// Update an item by ID
export const updateItem = async (
  req: NextApiRequest,
  res: NextApiResponse<SuccessRespond | ErrorRespond>
) => {
  await connectDB();

  // we will not update if there is no price in the body object
  // You should provide a good error for this, but we left it like that for now
  if (!req.body.price) return;
  const newPrice: string = req.body.price;
  const { slug } = req.query;

  // If there are errors in parameters
  // NOTE: params value are taken from the url so it will be incorrect sometime
  // slug should consists of one values in array [id], so we will respond to
  // error if the slug is in correct
  if (!slug || slug[0] === "undefined") {
    res.status(400).json({
      status: "error",
      message: "Error in parameters",
      error: "Error in parameters",
    });
    return;
  }

  const [id] = slug as [string];

  try {
    // Updating the item
    // - We update the price of the item
    const updatedItem: IListedItem | null =
      await ListedItems.findByIdAndUpdate<IListedItem>(id, { price: newPrice });

    // respond as error if there is no item with this id
    if (!updatedItem) {
      res.status(400).json({
        status: "error",
        message: "Couldn't find the item",
        error: "Couldn't find the item",
      });
      return;
    }
    res.status(201).json({
      status: "success",
      //@ts-ignore
      updatedItem, // you checked for null value in the previous step so type checking is useless
    });
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error,
    });
    console.error(error);
  }
};

// Delete an item by ID
export const deleteItem = async (
  req: NextApiRequest,
  res: NextApiResponse<SuccessRespond | ErrorRespond>
) => {
  await connectDB();

  const { slug } = req.query;

  // If there are errors in parameters
  // NOTE: params value are taken from the url so it will be incorrect sometime
  // slug should consists of one values in array [id], so we will respond to
  // error if the slug is in correct
  if (!slug || slug[0] === "undefined") {
    res.status(400).json({
      status: "error",
      message: "Error in parameters",
      error: "Error in parameters",
    });
    return;
  }

  const [id] = slug as [string];

  try {
    const deletedItem: IListedItem | null = await ListedItems.findByIdAndDelete(
      id
    );

    // respond as error if there is no item with this id
    if (!deleteItem) {
      res.status(400).json({
        status: "error",
        message: "Couldn't find the item",
        error: "Couldn't find the item",
      });
      return;
    }
    res.status(201).json({
      status: "success",
      //@ts-ignore
      deletedItem, // you checked for null value in the previous step so type checking is useless
    });
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      message: error.message,
      error,
    });
    console.error(error);
  }
};

// Main handler function
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return getItem(req, res);
  }

  if (req.method === "PATCH") {
    return updateItem(req, res);
  }

  if (req.method === "DELETE") {
    return deleteItem(req, res);
  }

  res.status(404).end();
}
