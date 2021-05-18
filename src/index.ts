import { AsperaOnCloud } from './aspera-on-cloud';
import { AsperaOnCloudAuth } from './auth';

if (typeof window === 'object') {
  (window as any).AsperaOnCloud = AsperaOnCloud;
  (window as any).AsperaOnCloudAuth = AsperaOnCloudAuth;
}

export * from './aspera-on-cloud';
export * from './auth';
