import { IListedItem } from "@/lib/listedItemsSchema";

type StringNotStatus = Exclude<string, "status">;

// NextApiRespond success respond type
export type SuccessRespond = {
  [k in StringNotStatus]: string | IListedItem | IListedItem[];
} & {
  status: "success";
};

// NextApiRespond error respond type
export type ErrorRespond = {
  status: "error";
  message: string;
  error: any;
};
