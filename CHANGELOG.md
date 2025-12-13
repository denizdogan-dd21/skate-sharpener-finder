# Changelog

All notable changes to the Skate Sharpener Connection app will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-01

### Added
- Complete German (DE) language support across entire application
- Internationalization (i18n) using next-intl library
- Language toggle component for switching between English and German
- Comprehensive translations for:
  - Authentication pages (Login, Register)
  - Search page with filters and results
  - Appointments management page
  - Sharpener dashboard (all 4 tabs)
  - Sharpener profile pages
  - Navigation and common UI elements
- Version display in application footer

### Changed
- Updated search availability period from 7 to 14 days
- Improved user experience with bilingual support

### Fixed
- Ensured all user-facing text is properly translated
- Consistent terminology across German translations

## [1.0.0] - 2025-11-22

### Added
- Initial release of Skate Sharpener Connection web application
- User authentication system (customers and sharpeners)
- Search functionality with geocoding and distance calculation
- Appointment booking system with status management
- Sharpener dashboard for business management
- Location management for sharpeners
- Machine and radius options management
- Availability scheduling with time slots
- Rating and review system
- Email notifications for appointments
- Responsive design with Tailwind CSS
- PostgreSQL database with Prisma ORM
- Next.js 14 with App Router
- NextAuth.js authentication
