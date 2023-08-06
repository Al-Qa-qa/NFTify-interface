import axios from "axios";
import useSWR from "swr";

const fetcher = async (url: string) => {
  // We made this to reduce the number of fetching requests
  // We make a useEffect to make the request again when there is an account so its ok
  if (!url) return;
  try {
    const { data } = await axios.get(url, {
      headers: {
        "content-type": "application/json",
      },
    });
    return data;
  } catch (err) {
    console.log("Error: in using Getting tokenURI");
    console.log(err);
  }
};

const useTokenMetadata = (url: string) => {
  const {
    data: metadata,
    error: errorMetadata,
    mutate,
  } = useSWR(url, () => fetcher(url));

  return { metadata, errorMetadata, mutate };
};

export default useTokenMetadata;
