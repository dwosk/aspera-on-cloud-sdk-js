export function getServerUrl(server?: string) {
  return `https://${server || 'api.ibmaspera.com'}/api/v1/admin`;
}

export function isBrowser() {
  return typeof window === 'object';
}
