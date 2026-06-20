# IET Absentees - Attendance Tracking System

A modern, offline-first PWA application for managing student attendance records. Teachers can mark attendance, track historical data, generate reports, and export data as PDF or images—all without requiring internet connectivity. Developed using a combination of manual coding and AI agent assistance.

## Features

### Core Attendance Management
- **Quick Attendance Marking**: Streamlined 7-step wizard interface to mark attendance
- **Multi-Class Support**: Handle multiple semesters and departments independently
- **Subject Tracking**: Optional subject field with searchable dropdown and auto-save
- **Smart Student Count**: Save total students per class once—no need to re-enter for subsequent records
- **Auto-Navigation**: Single-selection pages automatically advance without manual clicks
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

### Data Persistence
- **Offline-First**: All data stored locally in browser's localStorage
- **Automatic Sync**: Changes persist immediately without server interaction
- **PWA Ready**: Install as a native app on desktop or mobile
- **Data Backup**: Export all records as JSON for backup or sharing

### Reporting & Analytics
- **Matrix-Based Reports**: View attendance with students as rows and dates/hours as columns
- **Indian Date Format**: Dates display as DD-MMM-YYYY (e.g., 19-Jun-2026)
- **Advanced Filtering**: Filter by date range, subject, or hour
- **Summary Statistics**: Total classes, average attendance percentage, student count
- **Multi-Format Export**: Export reports as PDF, PNG image, or copy to clipboard

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ajayda24/iet-absentees.git
cd iet-absentees
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run start
```

## How to Use

### Marking Attendance

1. **Click "Get Started"** on the welcome page
2. **Select Semester** (S1-S8) - automatically advances to next step
3. **Select Department** (IT, CSE, EC, EEE, ME, EP, PT) - automatically advances
4. **Select Hour** (1st-6th) and optionally enter a Subject
5. **Enter Total Students** (only needed for new classes—saved for future use)
6. **Mark Attendance** - Click student IDs to toggle present/absent
7. **Review & Save** - Check the summary and save the attendance record

### Viewing Reports

1. **Click "View Reports"** from the welcome page or summary page
2. **Select a Class** to view its attendance records
3. **Filter by Subject** (optional) to see records for a specific subject
4. **Choose Date Range** (optional) to limit results to specific dates
5. **View the Matrix Table**:
   - Rows: Student roll numbers with attendance percentages
   - Columns: Dates (with hour sub-headers showing 1st, 2nd, 3rd, etc.)
   - Cells: Green checkmark (present), red X (absent), dash (no record)
   - Summary stats at top showing total classes, average attendance, total students
6. **Export Reports**: Click PDF, Image, or Copy buttons with date-range filename

## Project Structure

```
├── app/
│   ├── page.js                 # Main entry point with step container
│   ├── layout.tsx              # Root layout with metadata
│   └── reports/
│       └── page.js             # Reports dashboard with matrix table
├── components/
│   ├── steps/                  # Step components (Semester, Department, Hour, etc.)
│   ├── StepContainer.jsx       # Wizard container
│   ├── StepNavigation.jsx      # Bottom navigation bar
│   ├── SubjectSearchDropdown.jsx # Subject selection with search
│   └── RadioCardGroup.jsx      # Radio button component
├── context/
│   └── StepContext.jsx         # Global state for form data
├── hooks/
│   ├── useAttendanceStorage.js # LocalStorage management for attendance
│   └── useRecentSubjects.js    # Recent subjects storage and retrieval
├── utils/
│   ├── exportUtils.js          # PDF and image export functions
│   ├── dateUtils.js            # Indian date formatting utilities
│   └── dateUtils.js            # Date range label generation
├── public/
│   ├── manifest.json           # PWA manifest for installation
│   └── sw.js                   # Service worker for offline support
├── styles/
│   ├── globals.css             # Global styles with design tokens
│   └── tailwind.config.js      # Tailwind configuration
└── README.md                   # This file
```

## Technologies Used

### Frontend Framework
- **Next.js 15** - React framework with App Router and Turbopack
- **React 19** - UI library with latest hooks
- **TypeScript** - Type safety (where applicable)

### UI Components & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components for dialogs, selects
- **Lucide React** - Icon library with 470+ icons
- **Framer Motion** - Animation library for smooth transitions

### Data & Export
- **HTML2Canvas** - DOM to image conversion for screenshot export
- **HTML2PDF** - PDF export functionality with formatted tables
- **Sonner** - Toast notifications for user feedback

### PWA & Offline
- **next-pwa** - PWA support and service worker configuration
- **Service Workers** - Offline functionality and caching strategy

## Data Storage

### LocalStorage Keys
- **`attendanceClasses`**: Main object storing all attendance records organized by class (Semester_Department)
- **`recentSubjects`**: Array of recently used subjects (max 10, stored in lowercase)
- **`{classId}_totalStudents`**: Total student count for each class, e.g., `S1_IT_totalStudents`

### Record Structure
```javascript
{
  id: "S1_IT_2026-06-19_1st_mathematics",
  date: "2026-06-19",
  hour: "1st",
  subject: "mathematics",
  totalStudents: 50,
  absentees: [5, 12, 28, 45],
  presentCount: 46,
  absenteePercentage: 8,
  createdAt: 1718769000000
}
```

## Key Features Explained

### Auto-Navigation
Single-selection pages (Semester, Department) automatically advance after selection with a 300ms delay, reducing clicks and improving workflow efficiency. Users can still use the Previous button to go back without re-triggering auto-navigation.

### Subject Management
- Type to search through recently used subjects stored in localStorage
- Subjects auto-save to localStorage on blur (when leaving the field)
- Display in title case (e.g., "Data Structures") while storing lowercase for consistency
- Smart dropdown with visual feedback for no matches

### Responsive Mobile Design
- **Mobile**: Compact stepper without numbers, abbreviated button text (→ instead of "Next")
- **Tablet**: Balanced spacing and font sizes
- **Desktop**: Full-featured layout with all details visible
- Table scrolls horizontally on small screens while maintaining readability

### Indian Date Format
All dates display as DD-MMM-YYYY (e.g., 19-Jun-2026) for better readability in the Indian context. Month names are used instead of numbers for clarity.

### Student Count Caching
Total students per class are automatically cached in localStorage by semester-department combination. Subsequent entries for the same class automatically skip the student count step and go directly to attendance marking (step 6).

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Offline Capability

This app works fully offline thanks to:
- Service Worker caching strategy for static assets and API responses
- LocalStorage for persistent data storage (no database required)
- PWA manifest for installability on iOS and Android
- No external API calls—everything is stored locally
- Works as installable native app on mobile and desktop

## Performance Considerations

- **Data Limit**: LocalStorage typically supports ~10MB (handles thousands of records)
- **Large Datasets**: For 1000+ records, use date range filters to improve performance
- **Backup Strategy**: Regularly export data as JSON for backup
- **Cache Management**: Service worker caches static assets on first visit

## Troubleshooting

### Data Not Saving?
- Check if localStorage is not full (~10MB limit)
- Ensure private/incognito browsing mode is disabled
- Try clearing browser cache and reloading the app
- Check browser console for JavaScript errors

### Subject Dropdown Not Selectable?
- Ensure JavaScript is enabled in browser settings
- Check browser console for errors
- Try a different browser to rule out browser-specific issues
- Clear browser cache and reload

### Export Functionality Not Working?
- Ensure the attendance table has data (select a class first)
- Try a different export format (PDF, Image, or Copy)
- Check browser console for detailed error messages
- Verify sufficient memory and storage space

### Data Lost After Browser Update?
- Browser cache/storage was cleared during update
- Export data as JSON regularly for backup
- Consider using browser sync features or export backups

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- Cloud sync option for data backup and multi-device access
- Attendance analytics and trend visualization
- Multi-teacher support with user authentication
- Mobile app for iOS/Android via React Native
- Bulk import/export functionality for large datasets
- Automated email reports to parents/admins
- Integration with school management systems
- Real-time collaboration features

## License

This project is maintained by IET (Institute of Engineering and Technology).

## Support & Contact

For issues, feature requests, or questions:
- Open an issue on the GitHub repository
- Contact the development team
- Check the troubleshooting section above

---

**Version**: 0.1.0  
**Last Updated**: June 2026  
**Status**: Active Development  
**Author**: Ajay Daniel Trevor  
**Repository**: https://github.com/ajayda24/iet-absentees
