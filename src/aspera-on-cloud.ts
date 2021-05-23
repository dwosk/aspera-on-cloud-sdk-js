import { AsperaOnCloudAuth } from './auth';
import {
  AppsAppMembershipsApi,
  ClientAccessKeysApi,
  ClientAuthorizationsApi,
  ClientsApi,
  DropboxesApi,
  DropboxMembershipsApi,
  NodesApi,
  OrganizationsApi,
  PackagesApi,
  UsageReportsApi,
  UsersApi,
  WorkspaceMembershipsApi,
  WorkspacesApi,
} from './api';

export interface AsperaOnCloudOptions {
  /** Access token used for authenticating to the Aspera on Cloud API */
  accessToken?: string;
  /** Aspera on Cloud API URL to use for requests. This should only be used for testing. */
  apiServer?: string;
  /** The client id of your app specified in the Aspera on Cloud Admin app */
  clientId?: string;
  /** The client secret of your app specified in the Aspera on Cloud Admin app */
  clientSecret?: string;
  /** The organization that your app belongs to */
  org?: string
  /** The redirect uri of your app specified in the Aspera on Cloud Admin app */
  redirectUri?: string;
  auth?: AsperaOnCloudAuth;
}

export interface AsperaOnCloudApi {
  apps: AppsAppMembershipsApi;
  clientAccessKeys: ClientAccessKeysApi;
  clientAuthorizations: ClientAuthorizationsApi;
  clients: ClientsApi;
  dropboxes: DropboxesApi;
  dropboxMemberships: DropboxMembershipsApi;
  nodes: NodesApi;
  organizations: OrganizationsApi;
  packages: PackagesApi;
  usageReports: UsageReportsApi;
  users: UsersApi;
  workspaces: WorkspacesApi;
  workspaceMemberships: WorkspaceMembershipsApi;
}

/**
 * @class AsperaOnCloud
 * @classdesc The class that provides the interfaces used to interact with the Aspera On Cloud API.
 * @arg {Object} options
 * @arg {String} [options.accessToken] Access token used for authenticating to the Aspera on Cloud API.
 * @arg {String} [options.clientId] The client id of your app in the Aspera on Cloud Admin app.
 * @arg {String} [options.clientSecret] The client secret of your app in the Aspera on Cloud Admin app.
 * @arg {String} [options.org] The organization that your app belongs to.
 * @arg {String} [options.redirectUri] The redirect uri of your app specified in the Aspera on Cloud Admin app.
 */
export class AsperaOnCloud {
  auth;
  api: AsperaOnCloudApi;

  constructor(options: AsperaOnCloudOptions) {
    options = options || {};

    this.auth = options.auth || new AsperaOnCloudAuth(options);

    const basePath = this.auth.getBasePath();
    const globalAxios = this.auth.getAxios();

    const apps = new AppsAppMembershipsApi(undefined, basePath, globalAxios);
    const clientAuthorizations = new ClientAuthorizationsApi(undefined, basePath, globalAxios);
    const clientAccessKeys = new ClientAccessKeysApi(undefined, basePath, globalAxios);
    const clients = new ClientsApi(undefined, basePath, globalAxios);
    const dropboxes = new DropboxesApi(undefined, basePath, globalAxios);
    const dropboxMemberships = new DropboxMembershipsApi(undefined, basePath, globalAxios);
    const nodes = new NodesApi(undefined, basePath, globalAxios);
    const organizations = new OrganizationsApi(undefined, basePath, globalAxios);
    const packages = new PackagesApi(undefined, basePath, globalAxios);
    const usageReports = new UsageReportsApi(undefined, basePath, globalAxios);
    const users = new UsersApi(undefined, basePath, globalAxios);
    const workspaces = new WorkspacesApi(undefined, basePath, globalAxios);
    const workspaceMemberships = new WorkspaceMembershipsApi(undefined, basePath, globalAxios);

    this.api = {
      apps,
      clientAccessKeys,
      clientAuthorizations,
      clients,
      dropboxes,
      dropboxMemberships,
      nodes,
      organizations,
      packages,
      usageReports,
      users,
      workspaces,
      workspaceMemberships
    };
  }

  /**
   * Get account details for current user.
   * @returns {Promise<Object>} - Account details
   */
  getSelf(): Promise<any> {
    return this.request('/self');
  }

  /**
   * Request method for manually constructing API calls not explicitly supported by the SDK.
   * @arg {String} path - URL path for the request.
   * @arg {Object} [options] - Specify options for the request such as method, payload, and search parameters.
   * @returns {Promise<Object>} - Response object
   */
  request(path: string, options?: any): Promise<any> {
    const axios = this.auth.getAxios();
    return axios(`${this.auth.getBasePath()}${path}`, options);
  }
}
