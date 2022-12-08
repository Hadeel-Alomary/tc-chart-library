import {Injectable} from '@angular/core';
import {Loader, LoaderConfig, LoaderUrlType} from '../../loader/loader';

@Injectable()
export class DerayahClientService {

  constructor(private loader: Loader) { }

    public getDerayahAuthUrl(): string {
        return LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.DerayaAuthUrl)
    }

    public getDerayahOauthUrl(): string {
        return LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.DerayahOauthBaseUrl)
    }

    public getDerayahTokenUrl(): string {
        return LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.DerayaTokenUrl)
    }

    public getDerayahIntegrationLink(): string {
      return LoaderConfig.url(this.loader.getConfig(), LoaderUrlType.DerayahIntegrationLink);
    }

    public getClientId(): string {
      return 'TickerChartClient2021';
  }

   public getClientSecretId(): string {
      return 'TickerChart2021';
  }

}
