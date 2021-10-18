import { FeatherEngine } from "@dialthetti/feather-engine-core";
import { CollectTrackingEvent, ContinueTrackingEvent, DieTrackingEvent, GetDamageTrackingEvent, KillTrackingEvent, NewGameTrackingEvent, TransitionTrackingEvent } from "./events";

var analytics;
export function getAnalytics(): AnalyticsConnector {
    if (analytics == null
    ) {
        analytics = new GameAnalyticsConnector();
    }
    return analytics;
}

export default interface AnalyticsConnector {
    init(): void;
    setEnable(enable: boolean): void;


}




export class GameAnalyticsConnector implements AnalyticsConnector {

    analytics;
    gameanalytics;

    init(): void {
        var gameanalytics = require('gameanalytics');
        this.gameanalytics = gameanalytics;
        this.analytics = gameanalytics.GameAnalytics;
        this.analytics.setEnabledInfoLog(true);

        this.analytics.setEnabledEventSubmission(true);
        this.analytics.configureBuild("0.10-dev");
        // TODO env. variables
        this.analytics.initialize("d67a176d2ef719ec13280d943362cd40", "9d0961b0d97f5d0580cdae2893b65b4c1212e8b0");

        FeatherEngine.eventBus.subscribe("analyticsEvent:newGame", {
            receive: (event: NewGameTrackingEvent) => {
                this.analytics.addDesignEvent("mainMenu:newGame");
                this.analytics.addProgressionEvent(gameanalytics.EGAProgressionStatus.Start, event.payload.level, null, null)
            }
        });
        FeatherEngine.eventBus.subscribe("analyticsEvent:continue", {
            receive: (event: ContinueTrackingEvent) => {
                this.analytics.addDesignEvent("mainMenu:continue");
                this.analytics.addProgressionEvent(gameanalytics.EGAProgressionStatus.Start, event.payload.level, null, null)
            }
        });
        FeatherEngine.eventBus.subscribe("analyticsEvent:transition", {
            receive: (event: TransitionTrackingEvent) =>
                this.analytics.addDesignEvent("transition:"
                    + event.payload.level
                    + ":" + event.payload.transition.from
                    + ":" + event.payload.transition.to,
                    event.payload.timeOnScreen)
        });
        FeatherEngine.eventBus.subscribe("analyticsEvent:collect", {
            receive: (e: CollectTrackingEvent) =>
                this.analytics.addDesignEvent("collect:" + e.payload.name)
        });
        FeatherEngine.eventBus.subscribe("analyticsEvent:kill", {
            receive: (event: KillTrackingEvent) =>
                this.analytics.addDesignEvent("killing:" + event.payload.name, null, { pos: event.payload.pos })
        });

        FeatherEngine.eventBus.subscribe("analyticsEvent:getDamage", {
            receive: (event: GetDamageTrackingEvent) =>
                this.analytics.addDesignEvent("getDamage:", null, { pos: event.payload.pos })
        });

        FeatherEngine.eventBus.subscribe("analyticsEvent:die", {
            receive: (event: DieTrackingEvent) =>
                this.analytics.addProgressionEvent(gameanalytics.EGAProgressionStatus.Fail, event.payload.level, null, null, { pos: event.payload.pos })
        });

    }
    setEnable(enabled: boolean): void {

    }

}

