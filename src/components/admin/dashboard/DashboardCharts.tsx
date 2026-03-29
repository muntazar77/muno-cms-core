'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { DashboardChartCard } from './primitives'

const weeklyUsers = [
  { day: 'Mon', users: 2 },
  { day: 'Tue', users: 5 },
  { day: 'Wed', users: 4 },
  { day: 'Thu', users: 9 },
  { day: 'Fri', users: 7 },
  { day: 'Sat', users: 3 },
  { day: 'Sun', users: 6 },
]

const weeklyMedia = [
  { day: 'Mon', uploads: 3 },
  { day: 'Tue', uploads: 8 },
  { day: 'Wed', uploads: 5 },
  { day: 'Thu', uploads: 12 },
  { day: 'Fri', uploads: 6 },
  { day: 'Sat', uploads: 2 },
  { day: 'Sun', uploads: 4 },
]

const monthlyApplications = [
  { month: 'Sep', apps: 12 },
  { month: 'Oct', apps: 28 },
  { month: 'Nov', apps: 19 },
  { month: 'Dec', apps: 34 },
  { month: 'Jan', apps: 41 },
  { month: 'Feb', apps: 27 },
  { month: 'Mar', apps: 53 },
]

const tooltipStyle = {
  backgroundColor: 'var(--cms-bg)',
  border: '1px solid var(--cms-border)',
  borderRadius: '8px',
  boxShadow: 'var(--cms-card-shadow)',
  fontSize: '12px',
}

const axisTick = { fontSize: 11, fill: 'var(--cms-text-muted)' }

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* User Registrations */}
      <DashboardChartCard title="User Registrations" description="New users this week">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyUsers} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--cms-primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--cms-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--cms-border-subtle)" />
              <XAxis dataKey="day" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--cms-border)' }} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="var(--cms-primary)"
                strokeWidth={2}
                fill="url(#userGradient)"
                dot={false}
                activeDot={{ r: 4, fill: 'var(--cms-primary)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
      </DashboardChartCard>

      {/* Media Uploads */}
      <DashboardChartCard title="Media Uploads" description="Files uploaded this week">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyMedia} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--cms-border-subtle)" vertical={false} />
              <XAxis dataKey="day" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--cms-bg-muted)' }} />
              <Bar dataKey="uploads" fill="var(--cms-info)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
      </DashboardChartCard>

      {/* Application Submissions */}
      <DashboardChartCard
        title="Application Submissions"
        description="Monthly submissions (6 months)"
      >
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={monthlyApplications}
              margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--cms-border-subtle)" />
              <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--cms-border)' }} />
              <Line
                type="monotone"
                dataKey="apps"
                stroke="var(--cms-warning)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'var(--cms-warning)' }}
              />
            </LineChart>
          </ResponsiveContainer>
      </DashboardChartCard>
    </div>
  )
}
