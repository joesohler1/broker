// Mock data for the homeowner dashboard

export const mockProperties = [
  {
    id: 1,
    address: "123 Oak Street, Anytown, USA",
    type: "Single Family Home",
    size: "2,400 sq ft",
    yearBuilt: "1995",
    status: "Active",
    activeRequests: 2,
    completedRequests: 12,
    bedrooms: "4",
    bathrooms: "2.5",
    description: "Beautiful two-story home with modern updates and a large backyard perfect for entertaining.",
    notes: "Recently updated kitchen and bathrooms. New roof installed in 2023.",
    warrantyStatus: "Under warranty",
    nextMaintenance: "2025-10-15",
    totalSpent: "$2,450",
    lastService: "Sep 15, 2025",
    dateAdded: "Jan 10, 2023"
  },
  {
    id: 2,
    address: "456 Pine Avenue, Somewhere, USA",
    type: "Condo",
    size: "1,200 sq ft",
    yearBuilt: "2010",
    status: "Active",
    activeRequests: 0,
    completedRequests: 5,
    bedrooms: "2",
    bathrooms: "2",
    description: "Modern condo with great city views and updated amenities throughout.",
    notes: "HOA covers exterior maintenance. Building has 24/7 security.",
    warrantyStatus: "Extended warranty",
    nextMaintenance: "2025-11-01",
    totalSpent: "$890",
    lastService: "Aug 22, 2025",
    dateAdded: "Mar 15, 2023"
  }
];

export const mockServiceRequests = [
  {
    id: 1001,
    title: "Kitchen Faucet Leak",
    description: "The kitchen faucet has been dripping constantly for the past week. Water is pooling under the sink.",
    status: "In-Progress",
    priority: "Medium",
    category: "Plumbing",
    property: "123 Oak Street",
    dateCreated: "2025-09-18",
    scheduledDate: "2025-09-22 10:00 AM"
  },
  {
    id: 1002,
    title: "HVAC System Maintenance",
    description: "Annual HVAC system inspection and filter replacement.",
    status: "Pending",
    priority: "Low",
    category: "HVAC",
    property: "123 Oak Street",
    dateCreated: "2025-09-19",
    scheduledDate: "2025-09-25 2:00 PM"
  },
  {
    id: 1003,
    title: "Broken Window Lock",
    description: "Master bedroom window lock is broken and won't secure properly.",
    status: "Completed",
    priority: "High",
    category: "Security",
    property: "456 Pine Avenue",
    dateCreated: "2025-09-15",
    scheduledDate: null
  }
];

export const mockRecentActivity = [
  {
    id: 1,
    type: "request_updated",
    description: "Kitchen Faucet Leak request updated to 'In-Progress'",
    property: "123 Oak Street",
    timestamp: "2025-09-19T14:30:00Z"
  },
  {
    id: 2,
    type: "request_created",
    description: "New service request created for HVAC System Maintenance",
    property: "123 Oak Street",
    timestamp: "2025-09-19T09:15:00Z"
  },
  {
    id: 3,
    type: "request_completed",
    description: "Broken Window Lock repair has been completed",
    property: "456 Pine Avenue",
    timestamp: "2025-09-18T16:45:00Z"
  },
  {
    id: 4,
    type: "appointment_scheduled",
    description: "Plumber appointment scheduled for kitchen faucet repair",
    property: "123 Oak Street",
    timestamp: "2025-09-18T11:20:00Z"
  },
  {
    id: 5,
    type: "payment_made",
    description: "Payment processed for window lock repair",
    property: "456 Pine Avenue",
    timestamp: "2025-09-17T10:30:00Z"
  }
];

export const mockUpcomingAppointments = [
  {
    id: 1,
    serviceType: "Plumbing Repair",
    property: "123 Oak Street",
    provider: "ABC Plumbing Services",
    scheduledDate: "2025-09-22T10:00:00Z"
  },
  {
    id: 2,
    serviceType: "HVAC Inspection",
    property: "123 Oak Street",
    provider: "Cool Comfort HVAC",
    scheduledDate: "2025-09-25T14:00:00Z"
  },
  {
    id: 3,
    serviceType: "Gutter Cleaning",
    property: "456 Pine Avenue",
    provider: "Clean Gutters Pro",
    scheduledDate: "2025-09-28T09:00:00Z"
  }
];