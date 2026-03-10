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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
  fontSize: '12px',
}

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* User Registrations */}
      <Card>
        <CardHeader>
          <CardTitle>User Registrations</CardTitle>
          <CardDescription>New users this week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyUsers} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#e5e7eb' }} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#userGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#2563eb' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Media Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Media Uploads</CardTitle>
          <CardDescription>Files uploaded this week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyMedia} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f9fafb' }} />
              <Bar dataKey="uploads" fill="#7c3aed" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Application Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Application Submissions</CardTitle>
          <CardDescription>Monthly submissions (6 months)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={monthlyApplications}
              margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#e5e7eb' }} />
              <Line
                type="monotone"
                dataKey="apps"
                stroke="#d97706"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#d97706' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
