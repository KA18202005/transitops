export const dashboardKpis = [
  {
    id: "active-vehicles",
    label: "Active Vehicles",
    value: "128",
    detail: "+4 since last week",
    icon: "Car",
    tone: "emerald",
  },
  {
    id: "available-vehicles",
    label: "Available Vehicles",
    value: "63",
    detail: "49% of active fleet",
    icon: "CheckCircle2",
    tone: "sky",
  },
  {
    id: "maintenance-vehicles",
    label: "Vehicles in Maintenance",
    value: "11",
    detail: "2 urgent inspections",
    icon: "Wrench",
    tone: "amber",
  },
  {
    id: "active-trips",
    label: "Active Trips",
    value: "24",
    detail: "6 dispatches today",
    icon: "Route",
    tone: "indigo",
  },
  {
    id: "pending-trips",
    label: "Pending Trips",
    value: "8",
    detail: "2 require driver assignment",
    icon: "Clock3",
    tone: "slate",
  },
  {
    id: "drivers-duty",
    label: "Drivers On Duty",
    value: "37",
    detail: "92% attendance",
    icon: "Users",
    tone: "violet",
  },
  {
    id: "fleet-utilization",
    label: "Fleet Utilization",
    value: "81%",
    detail: "Above weekly target",
    icon: "Gauge",
    tone: "teal",
  },
];

export const fleetStatusData = [
  { name: "Available", value: 63, color: "#0f766e" },
  { name: "On Trip", value: 48, color: "#2563eb" },
  { name: "In Shop", value: 11, color: "#f59e0b" },
  { name: "Retired", value: 6, color: "#64748b" },
];

export const tripActivityData = [
  { day: "Mon", dispatched: 12, completed: 10 },
  { day: "Tue", dispatched: 15, completed: 13 },
  { day: "Wed", dispatched: 10, completed: 11 },
  { day: "Thu", dispatched: 16, completed: 14 },
  { day: "Fri", dispatched: 18, completed: 15 },
  { day: "Sat", dispatched: 13, completed: 12 },
  { day: "Sun", dispatched: 9, completed: 8 },
];

export const costOverviewData = [
  { name: "Fuel", value: 5400 },
  { name: "Maintenance", value: 3200 },
  { name: "Toll", value: 1180 },
  { name: "Parking", value: 760 },
  { name: "Misc", value: 430 },
];

export const recentActivities = [
  {
    id: 1,
    title: "Trip dispatched to coastal depot",
    module: "Trips",
    time: "12 min ago",
    status: "Scheduled",
    icon: "Route",
  },
  {
    id: 2,
    title: "Vehicle moved to maintenance queue",
    module: "Maintenance",
    time: "35 min ago",
    status: "Needs review",
    icon: "Wrench",
  },
  {
    id: 3,
    title: "Fuel log recorded for Unit 48",
    module: "Fuel",
    time: "1 hr ago",
    status: "Logged",
    icon: "Fuel",
  },
  {
    id: 4,
    title: "Driver profile updated",
    module: "Drivers",
    time: "2 hrs ago",
    status: "Updated",
    icon: "Users",
  },
  {
    id: 5,
    title: "Trip completed for northern route",
    module: "Trips",
    time: "Today",
    status: "Completed",
    icon: "CheckCircle2",
  },
];

export const quickActions = [
  { label: "Add Vehicle", href: "/vehicles", icon: "Car" },
  { label: "Add Driver", href: "/drivers", icon: "Users" },
  { label: "Create Trip", href: "/trips", icon: "Route" },
  { label: "Log Maintenance", href: "/maintenance", icon: "Wrench" },
];
