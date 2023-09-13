import { MyConversation } from "@/types";
import { API_URL } from "../../utils";

async function getConversation(id: string) {
  const response = await fetch(`${API_URL}/conversations/${id}`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok)
    throw {
      message: "Failed to fetch conversation.",
      reason: result,
    };

  if (response.status !== 200) throw result;

  return result as MyConversation;
}

export default getConversation;
