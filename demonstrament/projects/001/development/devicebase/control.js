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
    static
    fetch
  }
}, {}]
export default ApplicationControl