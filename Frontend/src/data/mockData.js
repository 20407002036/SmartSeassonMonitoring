export const AGENT_STAGE_OPTIONS = [
  'Planted',
  'Growing',
  'Ready',
  'Harvested',
]

export const STAGE_PROGRESS = {
  Planted: 20,
  Growing: 55,
  Ready: 82,
  Harvested: 100,
}

export const STATUS_TONES = {
  Active: {
    badge: 'bg-primary-fixed text-on-primary-fixed',
    dot: 'bg-primary-fixed-dim',
  },
  'At Risk': {
    badge: 'bg-secondary-container text-on-secondary-container',
    dot: 'bg-secondary-container',
  },
  Completed: {
    badge: 'bg-tertiary-fixed text-on-tertiary-fixed',
    dot: 'bg-tertiary-fixed-dim',
  },
}

export const users = [
  {
    id: 'admin-1',
    role: 'admin',
    name: 'Lena Morcos',
    email: 'admin@smartseason.io',
    password: 'admin123',
  },
  {
    id: 'agent-1',
    role: 'agent',
    name: 'Ayo Balogun',
    email: 'agent@smartseason.io',
    password: 'agent123',
  },
  {
    id: 'agent-2',
    role: 'agent',
    name: 'Sara Whitman',
    email: 'sara@smartseason.io',
    password: 'agent123',
  },
]

export const initialFields = [
  {
    id: 'field-a12',
    name: 'Field A-12',
    cropType: 'Winter Wheat',
    plantingDate: '2026-01-11',
    currentStage: 'Growing',
    status: 'Active',
    assignedAgentId: 'agent-1',
    notes: [
      {
        id: 'n-001',
        by: 'Ayo Balogun',
        at: '2026-04-19T08:10:00.000Z',
        text: 'Leaf color stabilized after nutrient adjustment.',
      },
    ],
    updates: [
      {
        id: 'u-001',
        by: 'Ayo Balogun',
        at: '2026-04-19T08:10:00.000Z',
        stage: 'Growing',
        status: 'Active',
        note: 'Soil moisture now in expected range.',
      },
    ],
  },
  {
    id: 'delta-4',
    name: 'Sector Delta-4',
    cropType: 'Soybeans',
    plantingDate: '2026-02-04',
    currentStage: 'Growing',
    status: 'At Risk',
    assignedAgentId: 'agent-2',
    notes: [
      {
        id: 'n-002',
        by: 'Sara Whitman',
        at: '2026-04-20T06:24:00.000Z',
        text: 'Patchy canopy observed in west strip, likely irrigation issue.',
      },
    ],
    updates: [
      {
        id: 'u-002',
        by: 'Sara Whitman',
        at: '2026-04-20T06:24:00.000Z',
        stage: 'Growing',
        status: 'At Risk',
        note: 'Water pressure dropped overnight.',
      },
    ],
  },
  {
    id: 'valley-09',
    name: 'Valley 09',
    cropType: 'Maize',
    plantingDate: '2026-01-25',
    currentStage: 'Ready',
    status: 'Active',
    assignedAgentId: 'agent-1',
    notes: [],
    updates: [
      {
        id: 'u-003',
        by: 'Lena Morcos',
        at: '2026-04-18T15:00:00.000Z',
        stage: 'Ready',
        status: 'Active',
        note: 'Harvest scheduling prepared with logistics team.',
      },
    ],
  },
  {
    id: 'plateau-c1',
    name: 'Plateau C-1',
    cropType: 'Barley',
    plantingDate: '2025-12-14',
    currentStage: 'Harvested',
    status: 'Completed',
    assignedAgentId: 'agent-2',
    notes: [
      {
        id: 'n-004',
        by: 'Sara Whitman',
        at: '2026-04-10T13:45:00.000Z',
        text: 'Yield exceeded baseline by 6%.',
      },
    ],
    updates: [
      {
        id: 'u-004',
        by: 'Sara Whitman',
        at: '2026-04-10T13:45:00.000Z',
        stage: 'Harvested',
        status: 'Completed',
        note: 'Completed with no spoilage.',
      },
    ],
  },
]

export const initialRecentUpdates = [
  {
    id: 'r-1',
    actor: 'Ayo Balogun',
    action: 'updated Field A-12 to Growing stage',
    type: 'Active',
    at: '2026-04-20T09:00:00.000Z',
  },
  {
    id: 'r-2',
    actor: 'System Alert',
    action: 'moisture levels dropping in Sector Delta-4',
    type: 'At Risk',
    at: '2026-04-20T08:12:00.000Z',
  },
  {
    id: 'r-3',
    actor: 'Lena Morcos',
    action: 'assigned harvester support to Valley 09',
    type: 'Completed',
    at: '2026-04-20T07:03:00.000Z',
  },
]
