# SlothPlate 🦥🍽️

> **"Your fridge has the ingredients. SlothPlate has the plan."**  
> *Built for Hacktoberfest 2026 Open-Source AI Challenge, Week 3: Slow and Steady.*

SlothPlate is a consumer web application that eliminates the daily decision fatigue of deciding what to cook and what groceries to buy. Users can take photos of what is inside their fridge or pantry, verify detected ingredients, set practical low-effort cooking constraints (such as 15-minute limits and one-pan cleanup), and receive 3 realistic meals paired with a deterministically consolidated grocery shopping list.

---

## 1. Problem Being Solved

Modern recipe platforms present overwhelming 20-step gourmet projects requiring dozens of exotic ingredients you will only use once, leaving a sink full of dirty dishes and half-used produce rotting in the crisper drawer.

SlothPlate re-engineers meal planning around **low effort and waste reduction**:
1. **Pantry-first**: Prioritizes what you already have on hand.
2. **Minimal active effort & dishes**: Prioritizes one-pot/one-pan meals with minimal prep steps.
3. **Overlapping ingredients**: Suggests meals that share fresh ingredients across recipes.
4. **Deterministic grocery list**: Combines missing items across selected recipes without duplicate clutter or inaccurate math.

## 2. Design System & 6-Color Palette

SlothPlate features a warm, food-inspired visual system with purposeful color roles:
- **Deep Forest Green** (`#285943`): Primary brand anchor, primary action CTAs, and active headers.
- **Fresh Leaf Green** (`#78A878`): Confirmed ingredients, verified badges, and positive check states.
- **Warm Butter Yellow** (`#F4CF77`): Featured recipe accents, tips, and portion adjusters.
- **Soft Coral** (`#E98B70`): Secondary action highlights, excluded allergy tags, and items to buy.
- **Powder Blue** (`#BFDDE8`): Information panels, photo upload drop zones, and time badges.
- **Lavender** (`#D9CFF0`): Supporting surfaces, cookware tags, and recipe card variants.

**Supporting Neutrals**:
- Warm ivory base: `#FAF8F1`
- Clean white surfaces: `#FFFFFF`
- Deep slate text: `#26342D`
- Muted secondary text: `#66746B`
- Crisp borders: `#E8E6DC`

---

## 3. Key Features

- **Fridge & Pantry Scanner (Screen B)**:
  - Upload up to 3 fridge or pantry photos (JPEG, PNG, WebP; up to 5 MB per photo).
  - Manual ingredient input option with quick-add chips for common staples.
  - Open-weight Gemma AI analyzes photos and identifies visible items with estimated quantities, confidence levels (`high`, `medium`, `low`), and visual uncertainty notes.
  - Interactive verification table allowing users to add, rename, adjust quantities, or remove items before cooking.

- **Low-Effort Preference Controls (Screen C)**:
  - Portion servings (1 to 5+ servings).
  - Total time limits (10, 20, 30, or 45 minutes).
  - Effort preference: *Almost no effort*, *Easy*, or *Normal*.
  - Cleanup preference: *One-pot or one-pan*, *Minimal dishes*, or *No preference*.
  - Dietary preferences (Vegetarian, Vegan, custom) and strict allergy exclusions.
  - Cuisine preference (Indian, Asian, Mediterranean, Comfort food, No preference).
  - Pre-selected basic pantry staples (Salt, Olive oil, Pepper, Garlic, Butter).

- **Gemma-Powered Meal Generation (Screen D & E)**:
  - Generates 3 practical meal options respecting time, cookware, and dietary boundaries.
  - Compares cooking time, cookware count, and on-hand vs. missing ingredients.
  - Interactive recipe modal with dynamic serving portion adjuster that automatically recalculates ingredient quantities.
  - Step-by-step instructions, cookware needed, plausible substitutions, and leftover reuse suggestions.

- **Deterministic Smart Grocery List (Screen F)**:
  - Automatically consolidates missing items from all selected meals.
  - Merges quantities with compatible units (e.g. `2 cloves + 3 cloves = 5 cloves`).
  - Formats mixed or incompatible units cleanly without artificial arithmetic (e.g. `1 can + 100g`).
  - Categorizes items into Produce, Dairy & Eggs, Bakery & Grains, Proteins, Pantry & Spices, and Other.
  - Interactive in-store checklist with progress bar.
  - One-click plain text copy and print-optimized formatting (`@media print`).
  - "I have this" toggle allows instant exclusion of items discovered in pantry.

- **Saved Plans & Local History (Screen G)**:
  - Persists meal plans, selected recipes, and grocery lists to browser `localStorage` using versioned schemas (`slothplate_saved_plans_v1`).
  - Defensive parsing guarantees that malformed or older records never break the app.
  - No account, login, or cloud tracking required.

- **Offline Sample Mode & Resilience**:
  - Full-fidelity sample plan showcasing 3 realistic weeknight recipes (Cheesy Spinach & Egg Fold, 10-Minute Blistered Tomato Toast, Skillet Shakshuka Eggs).
  - Plainly labeled when running in sample mode; never disguises mock data as live inference.

- **Open-Weight AI & Privacy Transparency**:
  - Full disclosure of Gemma open-weight architecture, hosted inference workflow, and zero photo retention policies.

- **Automated Quality & Compliance Suite**:
  - Integrated in-app test runner executing 6 programmatic assertions across input validation, file size enforcement, deterministic grocery consolidation, dietary exclusions, and storage lifecycle.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Motion.
- **Backend**: Node.js, Express 4.
- **AI SDK**: Official `@google/genai` TypeScript SDK (`^2.4.0`) with server-side proxying.
- **Open-Weight AI Model**: Google Gemma 4 (`gemma-4-26b-a4b-it`).
- **Persistence**: Browser `localStorage` with versioned defensive parsing.

---

## 4. Gemma Model Identifier & AI Workflow

### Exact Model Identifier:
```text
gemma-4-26b-a4b-it
```
Configured via `process.env.GEMMA_MODEL_NAME` on the backend, falling back to `gemma-4-26b-a4b-it`.

### AI Integration Workflow:
1. **Server-Side Security**: The client never imports `@google/genai` or sees `GEMINI_API_KEY`. All model requests are executed by the Express server.
2. **Pantry Analysis (`POST /api/analyze-pantry`)**:
   - Accepts up to 3 base64 encoded images. Validates MIME type (`image/jpeg`, `image/png`, `image/webp`) and enforces the 5MB size limit.
   - Dispatches image parts and a structured JSON schema instruction to Gemma.
   - Defensively parses and validates items, returning confidence levels and estimated amounts.
3. **Meal Planning (`POST /api/meal-plan`)**:
   - Dispatches confirmed ingredients and user preferences to Gemma.
   - Enforces dietary exclusions, allergen avoidance, and cookware limits in system instructions.
   - Returns 3 structured recipe objects with step-by-step guidance.

---

## 5. Getting Started & Local Development

### Prerequisites:
- Node.js 20+ installed.
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/) for hosted Gemma inference.

### Setup:
1. Clone or sync the repository:
   ```bash
   git clone https://github.com/aryanshaurya1012/slothplate.git
   cd slothplate
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your API key:
   ```env
   GEMINI_API_KEY="your-google-ai-studio-api-key"
   GEMMA_MODEL_NAME="gemma-4-26b-a4b-it"
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 6. Available Scripts

- `npm run dev`: Runs the full-stack server with Vite middleware in development mode on port 3000.
- `npm run build`: Compiles production assets with Vite into `dist/`.
- `npm run start`: Starts the production Express server serving the compiled frontend from `dist/`.
- `npm run lint`: Validates TypeScript types across the entire codebase (`tsc --noEmit`).

---

## 7. Privacy & Storage Limitations

- **Hosted Inference**: The current MVP utilizes hosted inference through the Google GenAI SDK. Photos and ingredient texts are sent over encrypted HTTPS to the inference endpoint.
- **Zero Image Retention**: Uploaded photos are processed in memory and are discarded immediately after inference. They are not stored in any permanent database.
- **Local Persistence**: Confirmed ingredients, preferences, saved recipes, and grocery lists are stored exclusively in your browser's local storage (`localStorage`). Clearing browser cache will reset saved plans.
- **Safety Disclaimer**: Recipe suggestions and ingredient detections are AI estimates. Users must always inspect food packaging, observe allergen warnings, and follow standard food safety practices.

---

## 8. Quality Checks & Verification Suite

SlothPlate includes automated test verification covering:
1. **Input validation**: Sanitization of ingredient inputs and rejection of HTML/script injections.
2. **Image validation**: Rejection of non-image MIME types and enforcement of the 5MB size ceiling.
3. **Grocery consolidation (compatible units)**: Correct addition of matching units (`2 cloves + 3 cloves = 5 cloves`).
4. **Grocery consolidation (incompatible units)**: Clean formatting of mixed measurements without fake precision.
5. **Dietary & allergy checks**: Flagging meat in vegetarian diets and honoring user-specified allergen exclusions.
6. **Defensive storage lifecycle**: Verification of save, load, versioned parsing, and deletion in `localStorage`.

To run these checks, click the **Quality & Tests** checkmark icon in the app header or footer.

---

## 9. Future Roadmap

- **Local Inference Support**: Add optional WebGPU or Ollama backends to run Gemma models directly on the user's laptop or mobile device with zero network transfer.
- **Barcode & Receipt Scanning**: Complement fridge photos with grocery receipt text analysis.
- **Pantry Expiry Tracking**: Optional browser notification reminders when perishables are nearing typical shelf life.

---

## License

Apache-2.0 License. Built with open-source spirit for Hacktoberfest 2026.
