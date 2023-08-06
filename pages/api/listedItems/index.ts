import connectDB from "@/lib/connectDB";
import ListedItems, { IListedItem } from "@/lib/listedItemsSchema";
import { ListItemType } from "@/src/types/data";
import { ErrorRespond, SuccessRespond } from "@/src/types/server";
import type { NextApiRequest, NextApiResponse } from "next/types";

// -------------

// GET request handler
export const getItems = async (
  req: NextApiRequest,
  res: NextApiResponse<SuccessRespond | ErrorRespond>
) => {
  await connectDB();
  try {
    // options to use in fetching items
    let queryOptions: any = {};

    // Check if we have seller in our query
    // We use seller to get user listed items so if the query has a seller we will user in
    // query options
    if (req.query.seller) {
      const { seller } = req.query;
      queryOptions.seller = { $regex: seller, $options: "i" }; // to search with case insensitive
    }

    const items: IListedItem[] = await ListedItems.find(queryOptions).sort({
      createdAt: -1,
    });

    res.status(200).json({
      status: "success",
      items,
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

// POST request handler
export const createItem = async (
  req: NextApiRequest,
  res: NextApiResponse<SuccessRespond | ErrorRespond>
) => {
  await connectDB();
  // New item that will be added
  const _newItem: ListItemType = req.body as ListItemType;

  // You need to check the the body object is correct as this may cause Errors
  // Of course this checking is a dump checking xD, but its ok.
  if (
    !(
      _newItem.collectionName &&
      _newItem.imageUrl &&
      _newItem.nftAddress &&
      _newItem.price &&
      _newItem.seller &&
      _newItem.tokenId &&
      _newItem.tokenURI
    )
  ) {
    res.status(400).json({
      status: "error",
      message: "There are some parameters that are not existed",
      error: "There are some parameters that are not existed",
    });
    return;
  }

  try {
    const newItem: IListedItem = await ListedItems.create<ListItemType>(
      _newItem
    );

    res.status(201).json({
      status: "success",
      newItem,
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
    return getItems(req, res);
  }

  if (req.method === "POST") {
    return createItem(req, res);
  }

  res.status(404).end();
}
