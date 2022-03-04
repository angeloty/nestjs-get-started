import { EventSubscriptions } from '../data/event-subscriptions.data';

export function Subscribe(eventName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    EventSubscriptions.push({
      eventName,
      fn: descriptor.value,
    });
  };
}
