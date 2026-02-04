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
  // 生产环境或 Vercel 环境下，通过 Serverless Function 转发请求
  // 本地开发如果未配置 Vercel CLI，则尝试直连（仅限调试，依赖 VITE_ 变量）
  const isDev = import.meta.env.DEV;
  const devApiKey = import.meta.env.VITE_ALI_BAILIAN_API_KEY;
  const devAppId = import.meta.env.VITE_ALI_BAILIAN_APP_ID;

  // 策略：如果不是开发环境，或者未配置本地 Key，则强制走 /api/resume
  if (!isDev || (!devApiKey && !devAppId)) {
    const response = await fetch('/api/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `请求失败: ${response.status} ${response.statusText}`);
    }

    const data: BailianResponse = await response.json();
    return data.output.text;
  }

  // === 以下仅为本地开发环境的 fallback 逻辑 (保留用于调试) ===
  if (!devApiKey || !devAppId) {
    throw new Error('请配置环境变量：生产环境需配置 Serverless Function，本地开发需在 .env.local 配置 VITE_ALI_BAILIAN_API_KEY');
  }

  const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/apps/${devAppId}/completion`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${devApiKey}`,
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
    throw new Error(errorData.message || `请求失败: ${response.status} ${response.statusText}`);
  }

  const data: BailianResponse = await response.json();
  return data.output.text;
}
