// 简单的认证工具
const AUTH_STORAGE_KEY = 'portfolio_auth_token';
const ADMIN_USERNAME = '1302907151';
const ADMIN_PASSWORD = '258022';

// 生成简单的token
function generateToken(username: string): string {
  return btoa(`${username}:${Date.now()}`);
}

// 验证凭据
export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// 登录
export function login(username: string, password: string): boolean {
  if (validateCredentials(username, password)) {
    const token = generateToken(username);
    localStorage.setItem(AUTH_STORAGE_KEY, token);
    return true;
  }
  return false;
}

// 登出
export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// 检查是否已登录
export function isAuthenticated(): boolean {
  const token = localStorage.getItem(AUTH_STORAGE_KEY);
  return !!token;
}

// 获取token
export function getToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE_KEY);
}
