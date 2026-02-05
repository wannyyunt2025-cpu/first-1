export default async function handler(req, res) {
  // 仅允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 从服务端环境变量获取密钥
  const apiKey = process.env.ALI_BAILIAN_API_KEY;
  // 优先使用专用 Chat App ID，如果没有则回退到通用 ID
  const appId = process.env.ALI_BAILIAN_CHAT_APP_ID || process.env.ALI_BAILIAN_APP_ID;

  if (!apiKey || !appId) {
    console.error('Missing Ali Bailian credentials in server environment');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { message, systemPrompt, history = [] } = req.body;

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
        // 如果你需要覆盖 System Prompt，可以在这里尝试，
        // 但注意：百炼的应用配置（App）里已经有了预设 Prompt。
        // 如果我们在代码里想动态注入最新的个人信息，我们可能需要使用 session 变量
        // 或者直接将动态信息拼接到第一条用户消息里（作为 Context）。
        // 更好的方式是：如果使用的是纯模型调用（Model Service），我们可以完全控制 messages。
        // 但如果使用的是 App（智能体），则主要依赖 App 的配置。
        
        // 策略调整：
        // 由于我们需要动态注入最新的 UserData，而百炼 App 的 System Prompt 是静态配置的。
        // 我们采取 "Context Injection" 策略：
        // 在用户的第一条消息前，或者在 history 中，隐式地加入一段 system 级别的指令。
        // 但百炼 App API 的 history 结构通常是 [{user:..., bot:...}]。
        
        // 另一种方案：直接把 System Prompt 拼在本次 prompt 的最前面（仅对当前轮次生效，或者依赖模型的上下文能力）。
        // 或者，我们在创建 App 时不写死 Prompt，而是每次调用时通过 parameters 传入（如果 API 支持）。
        
        // 根据百炼文档，调用应用时，通常主要传 input.prompt。
        // 如果要动态改变人设，最好是将 systemPrompt 作为上下文的一部分。
        
        // 让我们尝试将 systemPrompt 拼接到 input.prompt 中，并明确告知模型这是设定。
        // 为了避免每次都重复，只有在 history 为空（新会话）时拼接最为合适。
        // 但为了稳健，我们每次都带上简化的 Context，或者由前端控制。
        
        // 简化方案：前端传来的 systemPrompt 是完整的。
        // 我们把它作为 instruction 拼接到 prompt 前面。
        // 格式：
        // [System Instruction]
        // ...
        // [User Message]
        // ...
      },
      debug: {}
    };

    // 如果提供了 systemPrompt，我们尝试将其作为特殊的上下文前缀
    // 注意：如果 history 不为空，模型可能有之前的记忆。
    // 为了强化人设，我们可以每次都带上，或者只在第一轮带。
    // 这里采取：如果 history 为空，则拼接 System Prompt。
    if (systemPrompt && (!history || history.length === 0)) {
       payload.input.prompt = `${systemPrompt}\n\nUser: ${message}`;
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
