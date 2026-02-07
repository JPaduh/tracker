JOB APPLICATION TRACKER
=======================

A simple, local-first web application for tracking job applications, follow-ups, and application status.
Built as a cleaner, more structured alternative to spreadsheets.

OVERVIEW
--------

Job Application Tracker is a personal web app that runs locally on your machine.
It helps organize the job search by turning scattered notes and spreadsheets into a single, manageable workflow.

The app is intentionally lightweight, fast, and private.
No accounts. No cloud services. No external dependencies.

WHAT DOES IT DO
---------------

The app allows you to:

- Add job applications
- Track application status (Applied, Interview, Offer, Rejected, etc.)
- Search and filter by company, role, or location
- Update application status with a single click
- Store notes and job posting links for each role

The goal is to make the job search organized, visible, and easy to manage, especially when applying to many roles at once.

WHY THIS WAS BUILT
------------------

Many job seekers track applications in spreadsheets or notes, which quickly become cluttered and hard to maintain.

This project was built to create something that:

- Feels like a real application, not a spreadsheet
- Is quick to update and easy to review at a glance
- Keeps all job search information in one place
- Runs entirely locally, without accounts or setup friction

It also serves as a practical example of how I design and build small, complete software systems end-to-end.

HOW IT WORKS (HIGH LEVEL)
-------------------------

The app is made up of three simple parts.

1. THE INTERFACE (WHAT YOU SEE)

- A clean web interface in the browser
- A form to add new applications
- A table to view, search, filter, and update existing ones
- A visual theme toggle (default style or tactical “Theia” style)

2. THE LOGIC (BEHIND THE SCENES)

- A lightweight web service that handles saving and updating data
- Automatic reloads during development for fast iteration

3. THE STORAGE (WHERE DATA LIVES)

- Applications are stored in a local database file on disk
- No cloud services, logins, or external systems
- Data persists between restarts

Everything runs locally and can be started with a single command.

WHAT PROBLEM THIS SOLVES
------------------------

- No more losing track of where applications were submitted
- No more forgetting follow-ups
- No duplicate or conflicting records
- Clear visibility into the entire job search pipeline

It turns the job search into a managed workflow instead of a scattered process.

WHO THIS IS FOR
---------------

- Job seekers applying to multiple roles
- Engineers who want a simple, local tracking tool
- Anyone who prefers control over their own data
- Recruiters reviewing this repository as an example of:
  - Full-stack thinking
  - Practical problem solving
  - Clean, maintainable code
  - Thoughtful UI and UX decisions

TECHNICAL OVERVIEW (LIGHTWEIGHT)
--------------------------------

- Frontend: Modern web interface
- Backend: Lightweight Python web service
- Database: Local SQLite file
- Runtime: Local, containerized development environment
- Cloud services: None required

CURRENT FEATURES
----------------

- Add and delete job applications
- Application status tracking (Applied to Interview to Offer, etc.)
- Search and filter by role, company, and location
- Notes and job posting links per application
- Theme toggle (default / tactical style)
- Local data persistence

FUTURE IMPROVEMENTS (IDEAS)
---------------------------

- Follow-up reminders
- Weekly “what needs action” view
- CSV import and export
- Resume version tracking
- Basic analytics (applications per week, response rate)

SUMMARY
-------

This project demonstrates a practical approach to solving a real-world problem:

- Start with a clear user need
- Design something simple and usable
- Build a complete system end-to-end
- Leave room for future growth

It is intentionally focused, lightweight, and practical.



This repository is provided for code review and portfolio purposes.
It is not intended for installation or production use.