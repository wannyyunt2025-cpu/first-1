export interface BailianResponse {
  output: {
    text: string;
    finish_reason: string;
    session_id: string;
  };
  usage: {
    models: Array<{
      request_id: string;
      model_id: string;
      input_tokens: number;
      output_tokens: number;
    }>;
  };
  request_id: string;
}

export async function generateResume(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_ALI_BAILIAN_API_KEY;
  const appId = import.meta.env.VITE_ALI_BAILIAN_APP_ID;

  if (!apiKey || !appId) {
    throw new Error('请先在 .env.local 中配置 VITE_ALI_BAILIAN_API_KEY 和 VITE_ALI_BAILIAN_APP_ID');
  }

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
        result_format: 'text' // 确保返回纯文本
      },
      debug: {}
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `请求失败: ${response.status} ${response.statusText}`);
  }

  const data: BailianResponse = await response.json();
  return data.output.text;
}
