import { kv } from "@vercel/kv";


import { ChatBody, Message, OpenAIModelID } from "@/types";
export const config = {
    runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {

    const { model, messages, key, prompt, t, sign, other } = (await req.json()) as ChatBody;
    await kv.set("user_1_session", "session_token_value");
    const session = await kv.get("user_1_session");
    return new Response('ddddd'+session);

};

export default handler;
