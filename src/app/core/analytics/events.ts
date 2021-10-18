import { Vector } from "@dialthetti/feather-engine-core";
import { Subject } from "@dialthetti/feather-engine-events";

export class CollectTrackingEvent implements Subject<{ name: string, pos: Vector }>
{
    public topic = "analyticsEvent:collect"
    constructor(public payload: { name: string, pos: Vector }) { }
}
export class NewGameTrackingEvent implements Subject<{ level: string }>
{
    public topic = "analyticsEvent:newGame"
    constructor(public payload: { level: string }) { }
}
export class ContinueTrackingEvent implements Subject<{ level: string }>
{
    public topic = "analyticsEvent:continue"
    constructor(public payload: { level: string }) { }
}
export class TransitionTrackingEvent implements Subject<{ level: string, transition: { from: number, to: number }, timeOnScreen: number }>
{
    public topic = "analyticsEvent:transition"
    constructor(public payload: { level: string, transition: { from: number, to: number }, timeOnScreen: number }) { }
}
export class KillTrackingEvent implements Subject<{ name: string, pos: Vector }>
{
    public topic = "analyticsEvent:kill"
    constructor(public payload: { name: string, pos: Vector }) { }
}

export class GetDamageTrackingEvent implements Subject<{ pos: Vector }>
{
    public topic = "analyticsEvent:getDamage"
    constructor(public payload: { pos: Vector }) { }
}

export class DieTrackingEvent implements Subject<{ level: string, pos: Vector }>
{
    public topic = "analyticsEvent:die"
    constructor(public payload: { level: string, pos: Vector }) { }
}