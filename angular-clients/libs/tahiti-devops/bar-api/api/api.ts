export * from './orderController.service';
import { OrderControllerRestClient } from './orderController.service';
export * from './redirectController.service';
import { RedirectControllerRestClient } from './redirectController.service';
export const APIS = [OrderControllerRestClient, RedirectControllerRestClient];
