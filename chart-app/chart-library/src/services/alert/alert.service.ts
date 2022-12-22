import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AlertMessage, Streamer} from '../streaming/index';
import {AlertLoader} from '../loader/index';
import {AbstractAlert} from './abstract-alert';
import {BrowserUtils, Tc, TcTracker} from '../../utils/index';
// import {CredentialsStateService} from '../../index';
// import {AuthorizationService} from '../../auhtorization';
// import {FeatureType} from '../../auhtorization/feature';
import {TrendLineAlert} from './trend-line-alert';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {ChartAlert} from './chart-alert';
import {HostedAlert} from './hosted-alert';

@Injectable()
export class AlertService {

    private alerts: AbstractAlert[] = [];

    private alertUpdatedStream: Subject<AbstractAlert>;
    private alertsHistoryLoadedStream: BehaviorSubject<Boolean>;

    constructor(private alertLoader:AlertLoader, streamer:Streamer) {
        this.alertUpdatedStream = new Subject();
        this.alertsHistoryLoadedStream = new BehaviorSubject(false);

        // this.loader.isLoadingDoneStream().subscribe(loadingDone => {
        //     if(loadingDone && BrowserUtils.isDesktop()) {
        //         authorizationService.authorizeService(FeatureType.ALERT, () => {
         let userName : string = null;
                    this.alertLoader.loadAlerts().subscribe((alerts: AbstractAlert[]) => {
                        this.onLoadHistoricalAlerts(alerts);
                        streamer.getGeneralPurposeStreamer().subscribeAlerts(userName);
                        streamer.getGeneralPurposeStreamer().getAlertsStream().subscribe((message) => this.onAlertFromStreamer(message));
                    });
                // });
            // }
        // });
    }

    public createAlert(alert:AbstractAlert){
        Tc.assert(this.alerts.indexOf(alert) == -1, "create an alert that already exists");
        TcTracker.trackSaveAlert();
        this.alertLoader.createAlert(alert)
                .subscribe( (alertId: string) => {
                alert.id = alertId;
                this.alerts.push(alert);
                this.alertUpdatedStream.next(alert);
            });
    }

    public updateAlert(alert:AbstractAlert) {
        Tc.assert(this.alerts.indexOf(alert) !== -1, "delete an alert that does not exist");
        TcTracker.trackUpdateAlert();
        this.alertLoader.updateAlert(alert).subscribe(() => {
            this.alertUpdatedStream.next(alert);
        });
    }


    public getAlertUpdatedStream(): Subject<AbstractAlert> {
        return this.alertUpdatedStream;
    }

    public getAlertsHistoryLoadedStream(): BehaviorSubject<Boolean> {
        return this.alertsHistoryLoadedStream;
    }

    public deleteAlert(alert: AbstractAlert) {
        Tc.assert(this.alerts.indexOf(alert) !== -1, "delete an alert that does not exist");
        TcTracker.trackDeleteAlert();
        // MA we need to do the deletion before the request, as services may try to fetch alerts immediately after deletion
        // for rendering, and we like to see this alert then gone :-)
        this.alerts.splice(this.alerts.indexOf(alert), 1);
        alert.deleted = true;
        this.alertLoader.deleteAlert(alert).subscribe(() => {
            this.alertUpdatedStream.next(alert);
        });
    }

    public getActiveAlerts(): AbstractAlert[] {
        return this.alerts.filter(alert => alert.isActive());
    }

    public getInactiveAlerts(): AbstractAlert[] {
        return this.alerts.filter(alert => !alert.isActive());
    }

    public getAchievedAlerts(): AbstractAlert[] {
        return this.alerts.filter(alert => alert.isAchieved());
    }

    public getTrendLineAlertByDrawingId(drawingId: string): TrendLineAlert {
        return this.getActiveAlerts().find(alert => alert.isTrendLineAlert() && (alert as TrendLineAlert).drawingId == drawingId) as TrendLineAlert;
    }

    public getAchievedTrendLineAlertByDrawingId(drawingId: string): TrendLineAlert {
        return this.getAchievedAlerts().find(alert => alert.isTrendLineAlert() && (alert as TrendLineAlert).drawingId == drawingId) as TrendLineAlert;
    }

    public getTrendLineAlertsHostedByChart(hostId: string): TrendLineAlert[] {
        let activeTrendLineAlerts = this.getActiveAlerts().filter(alert => alert.isTrendLineAlert());
        return (activeTrendLineAlerts as TrendLineAlert[]).filter(alert => alert.hostId == hostId);
    }

    public getChartAlertsHostedByChart(hostId: string): ChartAlert[] {
        let activeChartAlerts = this.getActiveAlerts().filter(alert => alert.isChartAlert());
        return (activeChartAlerts as ChartAlert[]).filter(alert => alert.hostId == hostId);
    }

    public getAlertsHostedByChart(hostId: string): AbstractAlert[] {
        return [].concat(this.getTrendLineAlertsHostedByChart(hostId), this.getChartAlertsHostedByChart(hostId));
    }

    public getIndicatorChartAlerts(hostId: string, indicatorId: string): ChartAlert[] {
        return this.getChartAlertsHostedByChart(hostId).filter(alert => alert.parameter.indicatorId == indicatorId);
    }

    private onLoadHistoricalAlerts(alerts: AbstractAlert[]): void {
        alerts.forEach(alert => {
            this.alerts.push(alert);
        });
        this.alertsHistoryLoadedStream.next(true);
    }

    private onAlertFromStreamer(message:AlertMessage):void{
        let alert: AbstractAlert = this.alerts.find(alert => alert.id == message.id);
        if(alert) {
            alert.lastTriggerTime = message.time;
            alert.history.push({time: message.time, price: +message.price});
            alert.expired = true;
            this.alertUpdatedStream.next(alert);
        }
    }

    getAlertsHostedByPage(pageId: string):AbstractAlert[] {
        return this.alerts.filter(alert => {
            return (alert instanceof HostedAlert) && (alert as HostedAlert).hostId.startsWith(pageId + '|');
        });
    }
}
