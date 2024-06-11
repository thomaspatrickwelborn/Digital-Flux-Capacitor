import {
  Control
} from 'mvc-framework'
import DefaultView from 'view.js'
import DefaultRouter from 'router.js'
class ApplicationControl
extends Control {
  constructor() {
    super({
      views: {
        default: new DefaultView(),
      },
      routers: {
        default: new DefaultRouter(),
      }
    }, {})
  }
};