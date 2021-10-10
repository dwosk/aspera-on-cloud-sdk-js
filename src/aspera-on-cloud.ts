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
  UsersResponse,
  WorkspaceMembershipsApi,
  WorkspacesApi,
} from './api';
import { AxiosPromise } from 'axios';

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
   * @returns Account details
   */
  getSelf(): AxiosPromise<UsersResponse> {
    return this.request('/self');
  }

  /**
   * Request method for manually constructing API calls not explicitly supported by the SDK.
   * @arg path - URL path for the request.
   * @arg options - Specify options for the request such as method, payload, and search parameters.
   * @returns Response object
   */
  request(path: string, options?: any): AxiosPromise<any> {
    const baseUrl = options?.baseUrl || this.auth.getBasePath();
    const axios = this.auth.getAxios();
    return axios(`${baseUrl}${path}`, options);
  }
}
