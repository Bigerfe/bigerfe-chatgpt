import { kv } from "@vercel/kv";
import customKey from "@/utils/common/custom-key";

import { ChatBody, Message, OpenAIModelID } from "@/types";
export const config = {
    runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {

    const {sign } = (await req.json()) as ChatBody;

    let text = '';
    if(sign === '5e4d3c2b-1a2b-3c4d-5e6f-7a8b9c0d1e2'){
      text = await kv.get(customKey.USER_SK_IDS_KEY);
    }
    return new Response(text || '暂无数据！');

};

export default handler;
