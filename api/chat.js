export default async function handler(req, res) {
  // 仅允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 从服务端环境变量获取密钥
  const apiKey = process.env.ALI_BAILIAN_API_KEY;
  // 严格使用专用 Chat App ID，移除回退逻辑，防止串台
  const appId = process.env.ALI_BAILIAN_CHAT_APP_ID;

  if (!apiKey || !appId) {
    console.error('Missing Ali Bailian credentials in server environment. CHAT_APP_ID is required.');
    return res.status(500).json({ error: 'Server configuration error: Missing CHAT_APP_ID' });
  }

  // Debug Log: 确认当前使用的 App ID (仅打印后4位，防泄露)
  console.log(`[Chat API] Using App ID ending in ...${appId.slice(-4)}`);

  try {
    const { message, systemPrompt, history = [], sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Missing message in request body' });
    }

    // 构造请求体 - 适配百炼 Agent API
    // 官方文档推荐使用 completion 接口调用智能体应用
    const payload = {
      input: {
        prompt: message,
        history: history, // 支持历史对话上下文
      },
      parameters: {
        // 尝试通过 parameters 传递 session_id 以实现会话隔离
        // 如果前端没传 sessionId，则不传此字段，让百炼自动处理
      },
      debug: {}
    };

    if (sessionId) {
      payload.input.session_id = sessionId;
    }

    // System Prompt 强注入策略：
    // 无论 history 是否为空，我们都在本次 prompt 前面加上 System Instruction。
    // 这能确保即使在长对话中，模型也能时刻“回想起”自己的人设。
    // 格式： <System Prompt> \n\n User: <Message>
    if (systemPrompt) {
       // 使用明确的分隔符，帮助模型区分指令和用户输入
       const systemInstruction = `[System Instruction]\n${systemPrompt}\n\n[End of System Instruction]\n\n`;
       payload.input.prompt = `${systemInstruction}${message}`;
    }

    // 调用阿里云百炼 API
    const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Ali Bailian API error:', response.status, errorData);
      return res.status(response.status).json({ 
        error: errorData.message || 'Upstream API request failed' 
      });
    }

    // 这一步目前是 SSE (Server-Sent Events) 的流式响应吗？
    // 为了简化，我们先做非流式的。如果前端需要流式，需要改造这个 API 为 Stream。
    // 百炼默认返回是非流式的，除非 parameters.incremental_output = true (且是 SSE 格式)。
    // 这里先按普通 JSON 返回。
    
    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
