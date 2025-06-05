# REMWaste Skip Selection Challenge

Hey there! 👋 This is my take on REMWaste's frontend coding challenge. I was asked to redesign their skip selection page. This was really fun.

## What I Built

So the challenge was to redesign the "choose your skip size" page from their website. If you want to see the original, just go to wewantwaste.co.uk, enter postcode "LE10 1SH", pick an address, select "garden waste", and you'll land on the page I redesigned.

**Live Demo:** https://sandbox-remwaste.vercel.app 
**Code:** https://github.com/marvinok26/REMWaste-challenge

## The Challenge Brief

REMWaste wanted me to:
- Completely redesign their skip selection page (make it look totally different)
- Keep all the functionality working
- Make it responsive for mobile and desktop
- Use their API for skip data
- Write clean React code

## My Approach

I went for a complete visual overhaul. The original has this dark theme with basic cards, so I decided to go bright and modern with:

- **3D-style yellow skip containers** that actually look like real skips
- **Category filtering** - I grouped skips into Residential, Commercial, and Industrial because that's how people actually think about their projects
- **Smooth animations** throughout - hover effects, loading states, the works
- **Mobile-first design** - works great on phones and scales up beautifully

## What's Different

### Visually
- Scrapped the dark theme for a clean, gradient-based design
- Added realistic 3D skip visualizations (those yellow containers actually tilt when you hover!)
- Color-coded everything by category
- Made the whole experience feel more premium

### Functionally  
- Added smart filtering so you can find the right skip faster
- Better information hierarchy - prices are more prominent, restrictions are clearer
- Loading states that don't feel jarring
- Mobile experience that actually works well (not just "responsive")

## Tech Stack

Nothing fancy here - just solid choices:
- **React 19** with TypeScript (functional components, hooks)
- **Tailwind CSS** for styling
- **Vite** for development
- **Lucide React** for icons

## Running It Locally

```bash
git clone git@github.com:marvinok26/REMWaste-challenge.git
cd REMWaste-challenge
npm install
npm run dev
```

Then open http://localhost:5173 and you're good to go!

## The Data Integration

I'm pulling real data from their API:
```
https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft
```

The component handles loading states, errors (gracefully), and all the business logic like VAT calculations and restriction rules.

## Design Decisions

### Why Categories?
I noticed the skip sizes naturally fall into three groups based on typical use cases:
- **Residential (4-8 yards):** Home projects, can go on the road
- **Commercial (10-16 yards):** Bigger jobs, private property only
- **Industrial (20+ yards):** Major projects, different pricing model

### Why 3D Skips?
The original just had photos. I wanted something more engaging that would help users visualize what they're getting. The 3D containers are fun but also functional - they show relative sizes clearly.

### Mobile Strategy
Started mobile-first because honestly, a lot of people are probably booking skips on their phones. The filter tabs become icons on small screens, the grid adjusts naturally, and the bottom navigation works better than the original on touch devices.

## Challenges I Solved

1. **Performance:** Had to remove some staggered animations that were causing page flicker when filtering
2. **Responsiveness:** Made sure everything scales properly - not just "doesn't break" on mobile
3. **Data handling:** Their API structure has some quirks (different pricing models for large skips) that needed careful handling

## What I'd Add Next

If this were a real project, I'd probably add:
- Comparison tool (select multiple skips to compare side-by-side)
- Availability calendar integration
- More detailed size guides with real-world examples
- Search/filter by specific requirements

## Reflections

This was a fun challenge! I tried to balance keeping the core functionality intact while making it feel completely fresh. The biggest win, I think, is the categorization - it makes the decision process much clearer for users.

The animations and visual polish were important too, but not at the expense of usability. Everything still loads fast and works smoothly across devices.

---

Thanks for checking it out.

**Built for REMWaste's Frontend Challenge**