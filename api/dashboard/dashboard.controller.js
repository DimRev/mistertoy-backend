import { loggerService } from '../../service/logger.service.js'
import { dashboardService } from '../dashboard/dashboard.service.js'

export async function getDashboardData(req, res) {
  try {
    loggerService.debug('Getting dashboardData')
    const dashboardData = await dashboardService.query()
    res.send(dashboardData)
  } catch (err) {
    loggerService.error('Cannot get dashboard data', err)
    res.status(404).send('cannot get dashboard data')
  }
}
