export default async function handler(req, res) {
  // 仅允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 从服务端环境变量获取密钥
  const apiKey = process.env.ALI_BAILIAN_API_KEY;
  // 优先使用专用 Resume App ID，如果没有则回退到通用 ID
  const appId = process.env.ALI_BAILIAN_RESUME_APP_ID || process.env.ALI_BAILIAN_APP_ID;

  if (!apiKey || !appId) {
    console.error('Missing Ali Bailian credentials in server environment');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body' });
    }

    // 调用阿里云百炼 API
    const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          prompt: prompt
        },
        parameters: {
          result_format: 'text'
        },
        debug: {}
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Ali Bailian API error:', response.status, errorData);
      return res.status(response.status).json({ 
        error: errorData.message || 'Upstream API request failed' 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
