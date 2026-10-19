import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase JSON payload limit to 25MB for handling up to 3 image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Default model identifier as required by Hacktoberfest Open-Source AI Challenge
const DEFAULT_GEMMA_MODEL = 'gemma-4-26b-a4b-it';
const MODEL_NAME = process.env.GEMMA_MODEL_NAME || DEFAULT_GEMMA_MODEL;

// Server-side initialization of GoogleGenAI SDK with user agent telemetry
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Health check endpoint - reports server state without exposing API secrets
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SlothPlate API',
    model: MODEL_NAME,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/analyze-pantry
 * Accepts up to 3 base64 encoded images of fridge/pantry and optional manual notes.
 * Uses open-weight Gemma model to identify visible ingredients with estimated quantities and confidence.
 */
app.post('/api/analyze-pantry', async (req, res) => {
  try {
    const { images, manualNotes } = req.body;

    // Validate images
    const validatedImages: Array<{ data: string; mimeType: string }> = [];
    if (Array.isArray(images)) {
      if (images.length > 3) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 3 images allowed per scan.',
        });
      }

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (!img || typeof img.data !== 'string' || typeof img.mimeType !== 'string') {
          return res.status(400).json({
            success: false,
            error: `Image ${i + 1} has invalid format. Required: { data: string, mimeType: string }.`,
          });
        }

        const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMime.includes(img.mimeType)) {
          return res.status(400).json({
            success: false,
            error: `Image format "${img.mimeType}" is not supported. Use JPEG, PNG, or WebP.`,
          });
        }

        // Validate approximate base64 size (under 6MB encoded, representing ~4.5MB binary)
        if (img.data.length > 7 * 1024 * 1024) {
          return res.status(400).json({
            success: false,
            error: `Image ${i + 1} exceeds the 5MB size limit.`,
          });
        }

        // Clean base64 string if it contains data URI header
        const cleanData = img.data.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
        validatedImages.push({
          data: cleanData,
          mimeType: img.mimeType,
        });
      }
    }

    if (validatedImages.length === 0 && (!manualNotes || !manualNotes.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one photo or manual ingredient description.',
      });
    }

    // Initialize GenAI client
    let ai: GoogleGenAI;
    try {
      ai = getGenAIClient();
    } catch (e: any) {
      return res.status(503).json({
        success: false,
        error: e.message || 'Gemini API key is not configured in server secrets.',
        canUseSample: true,
      });
    }

    const systemPrompt = `You are SlothPlate's intelligent food ingredient identifier powered by the open-weight Gemma model.
Your task is to analyze user-submitted fridge and pantry photos (and optional text notes) to recognize visible raw ingredients, fresh produce, dairy, proteins, condiments, and pantry staples.

CRITICAL RULES:
1. Estimate quantities only when visually supportable (e.g. "4 eggs", "1 bag spinach", "approx. half block cheese"). If unclear, specify "1 item" or "As visible".
2. Assign confidence levels: "high" for clearly visible distinctive items, "medium" for items partially obscured or packaged, "low" for ambiguous items.
3. In "notes", provide helpful visual context or mention uncertainty (e.g., "Partially obscured behind milk carton", "Unsure if regular or skim").
4. Assign a category: "Produce", "Dairy & Eggs", "Bakery & Grains", "Proteins", "Pantry & Spices", "Beverages & Condiments", or "Other".
5. Never claim you can detect exact expiry dates, internal food freshness, or hidden items.
6. OUTPUT FORMAT: Respond ONLY with a valid JSON array of objects. Do not include markdown code block quotes, explanations, or preamble.

JSON SCHEMA:
[
  {
    "name": "string",
    "estimatedQuantity": "string",
    "confidence": "high" | "medium" | "low",
    "notes": "string",
    "category": "Produce" | "Dairy & Eggs" | "Bakery & Grains" | "Proteins" | "Pantry & Spices" | "Beverages & Condiments" | "Other"
  }
]`;

    // Construct prompt parts
    const parts: any[] = [];
    validatedImages.forEach((img) => {
      parts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data,
        },
      });
    });

    const userTextPrompt = manualNotes?.trim()
      ? `User notes on pantry/fridge: ${manualNotes.trim()}\n\nPlease identify all visible and noted ingredients according to the required JSON schema.`
      : `Please analyze the uploaded fridge/pantry photo(s) and identify all visible food ingredients according to the required JSON schema.`;

    parts.push({ text: userTextPrompt });

    console.log(`[SlothPlate] Calling model ${MODEL_NAME} for pantry analysis...`);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
      },
    });

    const rawText = response.text || '';
    console.log(`[SlothPlate] Received model response (${rawText.length} chars)`);

    // Clean JSON response (strip markdown wrappers if present)
    const cleanedJson = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let parsedIngredients: any[];
    try {
      parsedIngredients = JSON.parse(cleanedJson);
      if (!Array.isArray(parsedIngredients)) {
        throw new Error('Model did not return a JSON array');
      }
    } catch (parseErr) {
      console.warn('[SlothPlate] JSON parse failed, attempting regex extraction...', parseErr);
      const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        parsedIngredients = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse structured ingredient data from model response.');
      }
    }

    // Format & validate each ingredient item
    const formatted = parsedIngredients.map((item: any, idx: number) => ({
      id: `ing-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      name: String(item.name || 'Unnamed item').trim(),
      estimatedQuantity: String(item.estimatedQuantity || '1 portion').trim(),
      confidence: ['high', 'medium', 'low'].includes(item.confidence) ? item.confidence : 'medium',
      notes: item.notes ? String(item.notes).trim() : undefined,
      category: item.category || 'Other',
    }));

    res.json({
      success: true,
      data: formatted,
      modelUsed: MODEL_NAME,
    });
  } catch (error: any) {
    console.error('[SlothPlate] Pantry analysis failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze pantry images with Gemma model.',
      modelUsed: MODEL_NAME,
      canUseSample: true,
    });
  }
});

/**
 * POST /api/meal-plan
 * Accepts confirmed ingredients and user low-effort preferences.
 * Generates 3 practical, low-prep meal options with verified ingredients and steps.
 */
app.post('/api/meal-plan', async (req, res) => {
  try {
    const { ingredients, preferences } = req.body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one confirmed ingredient.',
      });
    }

    // Initialize GenAI client
    let ai: GoogleGenAI;
    try {
      ai = getGenAIClient();
    } catch (e: any) {
      return res.status(503).json({
        success: false,
        error: e.message || 'Gemini API key is not configured in server secrets.',
        canUseSample: true,
      });
    }

    const availableList = ingredients
      .map((i) => `- ${i.name} (available qty: ${i.estimatedQuantity || 'some'})`)
      .join('\n');

    const staplesList = (preferences?.pantryStaples || [])
      .map((s: string) => `- ${s}`)
      .join('\n');

    const allergiesList = (preferences?.allergiesToAvoid || []).join(', ') || 'None';
    const cuisine = preferences?.cuisine || 'No preference';
    const effort = preferences?.effortLevel || 'Almost no effort';
    const cleanup = preferences?.cleanup || 'One-pot or one-pan';
    const cookingTime = preferences?.cookingTimeMinutes || 20;
    const servings = preferences?.servings || 2;
    const dietary = preferences?.dietary || 'No preference';
    const dietaryNotes = preferences?.dietaryNotes || 'None';

    const systemPrompt = `You are SlothPlate's low-effort culinary planner powered by open-weight Gemma AI.
Your mission: Help busy people cook satisfying food with minimum decision fatigue, minimal prep, and fewest dirty dishes.

USER CONSTRAINTS:
- Confirmed Fridge/Pantry Ingredients:
${availableList}
- Available Basic Pantry Staples:
${staplesList || 'None specified'}
- Servings: ${servings}
- Max Cooking Time: ${cookingTime} minutes total
- Effort Level: ${effort}
- Cleanup Preference: ${cleanup} (PRIORITIZE 1 pan/pot if requested!)
- Dietary Preference: ${dietary} (Notes: ${dietaryNotes})
- ALLERGIES / INGREDIENTS TO AVOID (CRITICAL): ${allergiesList}
- Cuisine Preference: ${cuisine}

STRICT GENERATION GUIDELINES:
1. Generate EXACTLY 3 distinct, realistic, practical meal suggestions.
2. Maximize the use of the user's CONFIRMED ingredients. Avoid inventing random ingredients the user doesn't have.
3. If an extra ingredient is required, mark "isAvailable: false" and "needToBuy: true".
4. STRICT SAFETY & DIETARY RESTRICTIONS:
   - NEVER include any item in the Allergies/Avoid list (${allergiesList}), even as an optional garnish.
   - If Vegetarian, NO animal flesh/meat/poultry/fish/gelatin.
   - If Vegan, NO animal products, dairy, eggs, honey.
   - Never advise eating spoiled food. Label times and quantities as practical estimates.
5. LOW-EFFORT ETHOS:
   - Keep instructions concise, direct, and numbered.
   - Minimal equipment (skillet, one pot, sheet pan).
   - Estimate the exact dish count (approximate cookware/plates used).
6. Provide sensible substitutions and a leftover-use idea for each recipe.

OUTPUT FORMAT:
Respond ONLY with a valid JSON array of exactly 3 recipe objects conforming to this schema. No markdown formatting, no commentary.

[
  {
    "id": "rec-1",
    "title": "Recipe Title",
    "description": "Short appetizing 1-2 sentence description highlighting its ease.",
    "servings": ${servings},
    "prepTimeMinutes": 5,
    "cookTimeMinutes": 15,
    "totalTimeMinutes": 20,
    "effortLevel": "${effort}",
    "dishCount": 1,
    "ingredients": [
      {
        "name": "Ingredient name",
        "quantity": "e.g. 2 cloves, 1 cup, 200g",
        "isAvailable": true,
        "needToBuy": false,
        "category": "Produce"
      }
    ],
    "steps": [
      "Step 1 instruction",
      "Step 2 instruction"
    ],
    "equipment": ["1 medium skillet", "spatula"],
    "substitutions": ["Can swap X for Y"],
    "leftoverSuggestion": "How to store or repurpose leftovers"
  }
]`;

    console.log(`[SlothPlate] Generating 3 meal options with model ${MODEL_NAME}...`);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          role: 'user',
          parts: [{ text: `Generate 3 low-effort recipes based on my confirmed ingredients and preferences.` }],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      },
    });

    const rawText = response.text || '';
    const cleanedJson = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let recipes: any[];
    try {
      recipes = JSON.parse(cleanedJson);
      if (!Array.isArray(recipes) || recipes.length === 0) {
        throw new Error('Model did not return a valid recipes array');
      }
    } catch (parseErr) {
      console.warn('[SlothPlate] Recipes parse failed, checking regex...', parseErr);
      const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        recipes = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse recipe suggestions from model output.');
      }
    }

    // Defensive normalization of recipe objects
    const formattedRecipes = recipes.slice(0, 3).map((r: any, idx: number) => ({
      id: `recipe-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      title: String(r.title || `Low-Effort Meal Option ${idx + 1}`).trim(),
      description: String(r.description || 'A delicious, easy home-cooked meal.').trim(),
      servings: Number(r.servings) || servings,
      prepTimeMinutes: Number(r.prepTimeMinutes) || 5,
      cookTimeMinutes: Number(r.cookTimeMinutes) || 15,
      totalTimeMinutes: Number(r.totalTimeMinutes) || 20,
      effortLevel: r.effortLevel || effort,
      dishCount: Number(r.dishCount) || 1,
      ingredients: Array.isArray(r.ingredients)
        ? r.ingredients.map((ing: any) => ({
            name: String(ing.name || '').trim(),
            quantity: String(ing.quantity || 'As needed').trim(),
            isAvailable: Boolean(ing.isAvailable),
            needToBuy: Boolean(ing.needToBuy),
            category: ing.category || 'Other',
          }))
        : [],
      steps: Array.isArray(r.steps) ? r.steps.map((s: any) => String(s).trim()) : ['Cook ingredients and serve.'],
      equipment: Array.isArray(r.equipment) ? r.equipment.map((e: any) => String(e).trim()) : ['1 pan'],
      substitutions: Array.isArray(r.substitutions) ? r.substitutions.map((s: any) => String(s).trim()) : [],
      leftoverSuggestion: r.leftoverSuggestion ? String(r.leftoverSuggestion).trim() : undefined,
    }));

    res.json({
      success: true,
      data: formattedRecipes,
      modelUsed: MODEL_NAME,
    });
  } catch (error: any) {
    console.error('[SlothPlate] Meal plan generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate recipes with Gemma model.',
      modelUsed: MODEL_NAME,
      canUseSample: true,
    });
  }
});

// Configure Vite middleware or production static serving
async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    console.log('[SlothPlate] Initializing Vite dev middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[SlothPlate] Serving production build from dist...');
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SlothPlate] Server listening on http://0.0.0.0:${PORT} (model: ${MODEL_NAME})`);
  });
}

setupServer().catch((err) => {
  console.error('[SlothPlate] Server startup error:', err);
  process.exit(1);
});
