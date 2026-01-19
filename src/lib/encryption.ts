// 简单的Base64编码/解码用于联系方式防爬
// 注意：这不是真正的加密，只是增加爬虫抓取难度

export function encodeContact(text: string): string {
  try {
    // 先反转字符串，再Base64编码
    const reversed = text.split('').reverse().join('');
    return btoa(encodeURIComponent(reversed));
  } catch {
    return text;
  }
}

export function decodeContact(encoded: string): string {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    // 反转回来
    return decoded.split('').reverse().join('');
  } catch {
    return encoded;
  }
}

// 部分隐藏显示
export function maskContact(text: string, type: 'email' | 'phone' | 'wechat'): string {
  if (!text) return '';
  
  switch (type) {
    case 'email': {
      const [username, domain] = text.split('@');
      if (!username || !domain) return text;
      const maskedUsername = username.length > 2 
        ? username[0] + '*'.repeat(Math.min(username.length - 2, 4)) + username.slice(-1)
        : username;
      return `${maskedUsername}@${domain}`;
    }
    case 'phone': {
      if (text.length < 7) return text;
      return text.slice(0, 3) + '****' + text.slice(-4);
    }
    case 'wechat': {
      if (text.length < 4) return text;
      return text.slice(0, 2) + '***' + text.slice(-2);
    }
    default:
      return text;
  }
}
