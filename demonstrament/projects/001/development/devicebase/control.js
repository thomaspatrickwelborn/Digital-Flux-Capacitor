import ApplicationView from 'view.js'
import ApplicationModel from 'model.js'
import ApplicationRouter from 'router.js'
const ApplicationControl = [{
  models: {
    default: new Model(...ApplicationModel)
  },
  views: {
    default: new View(...ApplicationView)
  },
  routers: {
    default: new Router(...ApplicationRouter)
  }
}, {}]
export default ApplicationControl