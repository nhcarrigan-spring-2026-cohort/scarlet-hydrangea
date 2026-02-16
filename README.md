# Scarlet Hydrangea

Repository for Team Scarlet Hydrangea - Spring 2026 Cohort

## Project Scope - Community Tool Library: Borrow, Don't Buy

### The Goal

The intent of this project is to build a Community Tool Library to allow a community to pool their resources and avoid buying tools that another community member has already purchased.

The Community Tool Library is a shared platform that allows people to list their tools, browse available tools, request and borrow tools, and track who currently has a given tool.

### In Scope Features (MVP)

These features are required for the tool library to function at all:

**Authentication**

- User registration
- User login

**Tool Database**

- Browse all tools in the database
- Submit new tools
- See tool details
- Request to borrow a tool
- Admin approval of tools requests
- Tool return process/flow

### Out of Scope Features (Post-MVP)

Additional features listed below would augment the usefulness of the Tool Library, but are not critical for base function:

- Track tool damage
- Tool search
- Tool categorization/filtering
- Duplicate tool grouping

## How To Contribute

1. Clone the repository:

    `git clone https://github.com/nhcarrigan-spring-2026-cohort/scarlet-hydrangea.git`

2. Create a new branch based on your task or issue:

    `git checkout -b feature/your-name-task`

3. Make your changes and commit them:

    `git commit -m "Add: login form component"`
    - Each commit should cover a single feature or fix.
    - Use clear, descriptive, commit messages:
        - "feat(frontend): add tool browse page"
        - "fix(backend): correct borrow approval logic"
        - "docs: update wireframes for borrow flow"

4. Push your branch:

    `git push origin feature/your-name-task`

5. Open a pull request to `main` using this template:

```
- Summary
What changed?

- Linked issue (if any)
Closes #x (replace 'x' with issue number)

- Notes
Anything else to know?
```

6. Once the pull request is reviewed and merged, delete your branch:

    `git branch -d feature/your-name-task`

    This can only be done while a different branch is checked out.

## Technical Stack

- Frontend: React + Vite application
- Backend: Python
- Database: PostgreSQL

### Project Structure

- README.md → Overview of project and contribution guide
- /frontend → React + Vite application
- /backend → Python Flask + SQLAlchemy connection to PostgreSQL database
- /docs → Wireframes, architecture notes, and decisions
- /.github → Issue & PR templates for github

## Quick Start

### Frontend

    The frontend will start in development mode using Vite:

`cd frontend`

`npm install`

`npm run dev`

### Backend

    The backend consists of several components:
    - Route endpoints
    - Database connection
    - Database schema

`cd backend`

Check QUICK_START.md for next steps

## Team

### Leadership

<ul>
    <li><a href="https://github.com/ITKeviin">ITKev</a></li>
    <li><a href="https://github.com/Scott0275">Buchi</a></li>
</ul>

### Participants

<ul>
    <li><a href="https://github.com/Sebastian-Wlo">Sebastian*W</a></li>
    <li><a href="https://github.com/SinanFarook">DeathValley</a></li>
    <li><a href="https://github.com/n00b01">Greg</a></li>
    <li><a href="https://github.com/Harshada-87">S7730</a></li>
    <li><a href="https://github.com/virtual256">Virtual256</a></li>
    <li><a href="https://github.com/mohamedomar94">mstar⭐</a></li>
    <li><a href="https://github.com/rosacabrerac">Rozenroo</a></li>
</ul>
