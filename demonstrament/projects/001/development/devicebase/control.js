import ApplicationView from 'view.js'
import ApplicationModel from 'model.js'
import ApplicationFetchRouter from 'fetch-router.js'
import ApplicationStaticRouter from 'static-router.js'
const ApplicationControl = [{
  models: {
    default: new Model(...ApplicationModel)
  },
  views: {
    default: new View(...ApplicationView)
  },
  routers: {
    static: {
      default: new StaticRouter(...ApplicationStaticRouter)
    },
    fetch: {
      default: new FetchRouter(...ApplicationFetchRouter)
    },
  },
  eventCallbacks: {
    defaultStaticRouterRouteChange: async function defaultStaticRouterRouteChange($event) {
      console.log()
    }
  }
}, {}]
export default ApplicationControl