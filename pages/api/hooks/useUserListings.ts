import axios from "axios";
import useSWR from "swr";

const fetcher = async (url: string, seller: string | null) => {
  // We made this to reduce the number of fetching requests
  // We make a useEffect to make the request again when there is an account so its ok
  if (!seller) return;
  try {
    const { data } = await axios.get(url, {
      headers: {
        "content-type": "application/json",
      },
      params: { seller },
    });
    return data;
  } catch (err: any) {
    console.log("Error: in using swr");
    console.log(err);
    throw new Error(err.response.data.message);
  }
};

const useUserListings = (account: string | null) => {
  const {
    data: userListings,
    error: errorUserListings,
    isLoading,
    mutate,
  } = useSWR(`/api/listedItems`, () => fetcher("/api/listedItems", account));

  return { userListings, errorUserListings, isLoading, mutate };
};

export default useUserListings;
