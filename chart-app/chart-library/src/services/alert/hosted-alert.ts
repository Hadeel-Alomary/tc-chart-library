import {AlertTriggerType} from './alert-trigger';
import {AbstractAlert, AlertHistory} from './abstract-alert';
import {AlertType} from './alert-type';
import {Company} from '../loader';
import {NotificationMethods} from '../notification';
import {IntervalType} from '../loader/price-loader/interval-type';

export abstract class HostedAlert extends AbstractAlert {
    constructor(
        id: string,
        interval: IntervalType,
        paused: boolean,
        reactivateMinutes: boolean,
        triggerType: AlertTriggerType,
        fireOnChange: boolean,
        expiryDate: string,
        message: string,
        language: string,
        expired: boolean,
        createdAt: string,
        updatedAt: string,
        company: Company,
        lastTriggerTime: string,
        history: AlertHistory[],
        notificationMethods: NotificationMethods,
        type: AlertType,
        deleted: boolean,
        public hostId: string,
    ) {
        super(id, interval, paused, reactivateMinutes, triggerType, fireOnChange, expiryDate, message, language, expired,
            createdAt, updatedAt, company, lastTriggerTime, history, notificationMethods, type, deleted);
    }
}
