import express from 'express'
import { getDashboardData } from './dashboard.controller.js'

export const dashboardRoutes = express.Router()

dashboardRoutes.get('/', getDashboardData)