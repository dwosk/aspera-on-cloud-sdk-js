export function getServerUrl(server?: string) {
  return `https://${server || 'api.ibmaspera.com'}/api/v1/admin`;
}
