/** UI strings shared across pages — English */
export const pagesEn = {
  states: {
    loading: 'Loading...',
    loadingConsumo: 'Loading usage data...',
    loadingHistorial: 'Loading usage history...',
    loadingRecomendaciones: 'Loading recommendations...',
    empty: 'No data to display.',
    error: 'Could not load the data.',
    retry: 'Retry',
  },
  dashboard: {
    title: 'EnergyAI Dashboard',
    subtitle: 'Hackathon ONE G9 - TEAM 48',
    lastMonthUsage: 'Last month usage',
    lastMonthCost: 'Last month cost',
    monthlyAverage: 'Monthly average',
  },
  consumos: {
    title: 'Energy usage',
    subtitle: 'Monthly breakdown of kWh usage and estimated cost.',
    totalUsage: 'Total usage',
    totalCost: 'Total cost',
    monthlyAverage: 'Monthly average',
    history: 'Monthly history',
    peak: 'Peak usage',
    month: 'Month',
    usageKwh: 'Usage (kWh)',
    estimatedCost: 'Estimated cost',
    status: 'Status',
    aboveAverage: 'Above average',
    normal: 'Normal',
  },
  chart: {
    title: 'Monthly energy usage (kWh)',
    actualVsPredicted: 'Actual vs predicted (kWh)',
    actualVsPredictedHint:
      'Mock for Data Analysis: compare measured usage with the model forecast.',
    peakVsOffPeak: 'Peak vs off-peak (kWh)',
    peakVsOffPeakHint:
      'Mock for Data Analysis: split usage into peak and off-peak hours.',
    seriesActual: 'Actual',
    seriesPredicted: 'Predicted',
    seriesPeak: 'Peak',
    seriesOffPeak: 'Off-peak',
    axisMonth: 'Month',
    axisKwh: 'kWh',
    confidence: 'Model confidence',
    categories: {
      LOW_CONSUMPTION: 'Low consumption',
      MEDIUM_CONSUMPTION: 'Medium consumption',
      HIGH_CONSUMPTION: 'High consumption',
    },
  },
  insights: {
    title: 'In plain words: how is your usage?',
    subtitle: 'A clear summary anyone at home or work can understand.',
    trend: {
      up: 'In {month} you used {pct}% more energy than in {prevMonth} ({kwh} kWh more).',
      down: 'In {month} you used {pct}% less than in {prevMonth} (saved {kwh} kWh).',
      flat: 'In {month} you used about the same as in {prevMonth}.',
    },
    peak:
      '{pct}% of your energy in {month} was used during peak hours (usually more expensive).',
    bill: {
      up: 'Estimated bill for {month} is ${amount} (about ${diff} more than last month).',
      down: 'Estimated bill for {month} is ${amount} (about ${diff} less than last month).',
      flat: 'Estimated bill for {month} stays at ${amount}.',
    },
    level: {
      good: 'Your usage is low: you are doing well.',
      ok: 'Your usage is medium: small changes can still help.',
      high: 'Your usage is high: check habits and power-hungry appliances.',
    },
    tip: {
      good: 'Tip: keep switching off unused devices and set AC around 24–26 °C.',
      ok: 'Tip: run washer or dishwasher outside 18:00–22:00 to pay less.',
      high: 'Tip: review AC and old appliances; that is usually where most cost sits.',
    },
  },
  analysis: {
    title: 'Smart AI analysis',
    subtitle: 'Energy usage assessment',
    monthlyUsage: 'Monthly usage (kWh)',
    people: 'Number of people',
    devices: 'Number of devices',
    submit: 'Analyze usage',
    submitting: 'Analyzing...',
    result: 'AI result',
    level: 'Level',
    estimatedSavings: 'Estimated savings',
    tips: 'Recommendations',
    failed: 'Could not complete the analysis.',
    levels: {
      efficient: 'Efficient',
      moderate: 'Moderate',
      inefficient: 'Inefficient',
    },
    tipsList: {
      led: 'Use LED lighting',
      peak: 'Reduce usage during peak hours',
      appliances: 'Optimize appliance usage',
      ac: 'Reduce air conditioning usage',
      replace: 'Replace old equipment',
      night: 'Monitor nighttime usage',
      keep: 'Keep current habits',
      monitor: 'Keep monitoring usage',
    },
  },
  recommendations: {
    title: 'AI recommendations',
    subtitle: 'Personalized tips to optimize energy usage.',
    total: 'Total recommendations',
    highPriority: 'High priority',
    potentialSavings: 'Accumulated potential savings',
    estimatedSavings: 'Estimated savings',
    priority: {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    },
    category: {
      lighting: 'Lighting',
      habits: 'Habits',
      climate: 'Climate',
      equipment: 'Equipment',
      tech: 'Technology',
    },
    items: {
      1: {
        title: 'Replace traditional lighting with LED',
        description:
          'Replacing incandescent bulbs can cut lighting usage by up to 80%.',
      },
      2: {
        title: 'Reduce usage during peak hours',
        description:
          'Schedule appliances outside 18:00-22:00 to avoid demand peaks.',
      },
      3: {
        title: 'Optimize air conditioning usage',
        description:
          'Keep the unit between 24°C and 26°C and use eco mode at night.',
      },
      4: {
        title: 'Review old high-usage equipment',
        description:
          'Identify refrigerators, microwaves or washers older than 10 years.',
      },
      5: {
        title: 'Unplug chargers on standby',
        description:
          'Avoid phantom load by switching off unused adapters and devices.',
      },
      6: {
        title: 'Install a smart thermostat',
        description:
          'Automate heating and cooling based on occupancy schedules.',
      },
    },
  },
  months: {
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
  },
}
