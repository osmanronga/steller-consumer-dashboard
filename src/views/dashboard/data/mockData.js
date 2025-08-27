export const mockStats = {
  totalSales: 1250,
  totalUsers: 850,
  totalOrders: 450,
  totalRevenue: 25000,
}

export const mockActivities = [
  {
    id: '1',
    title: 'New order received',
    time: '2 minutes ago',
    status: 'Completed',
    variant: 'success',
  },
  {
    id: '2',
    title: 'New user registered',
    time: '5 minutes ago',
    status: 'Pending',
    variant: 'warning',
  },
  {
    id: '3',
    title: 'Payment received',
    time: '10 minutes ago',
    status: 'Completed',
    variant: 'success',
  },
  {
    id: '4',
    title: 'Order cancelled',
    time: '15 minutes ago',
    status: 'Failed',
    variant: 'danger',
  },
]

export const mockSalesData = [
  {
    name: 'Sales',
    data: [
      {
        x: '2024-01-01',
        y: 1000,
      },
      {
        x: '2024-01-02',
        y: 1200,
      },
      {
        x: '2024-01-03',
        y: 1500,
      },
      {
        x: '2024-01-04',
        y: 1800,
      },
      {
        x: '2024-01-05',
        y: 2000,
      },
    ],
  },
]

export const mockUserData = [30, 40, 30] // [admins, partners, customers] 