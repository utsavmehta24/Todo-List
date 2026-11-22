import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { action, taskTitle, taskDescription, tasks } = await request.json();

        const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

        // If an API key is available, call Gemini API
        if (apiKey && process.env.GEMINI_API_KEY) {
            try {
                const prompt = buildPrompt(action, taskTitle, taskDescription, tasks);
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
                
                const response = await fetch(geminiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { responseMimeType: "application/json" }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        const parsed = JSON.parse(text);
                        return NextResponse.json({ success: true, result: parsed, source: "gemini" });
                    }
                }
            } catch (err) {
                console.warn("Gemini API call failed, falling back to local heuristic:", err.message);
            }
        }

        // Fallback to intelligent local heuristic engine
        const fallbackResult = generateHeuristicResult(action, taskTitle, taskDescription, tasks);
        return NextResponse.json({ success: true, result: fallbackResult, source: "heuristic" });

    } catch (error) {
        console.error("AI Route Error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to process AI request",
            error: error.message
        }, { status: 500 });
    }
}

function buildPrompt(action, taskTitle, taskDescription, tasks) {
    if (action === "decompose") {
        return `You are an expert productivity coach for neurodiverse professionals. Break down the task "${taskTitle}" (${taskDescription || "no extra description"}) into 3 to 5 clear, low-friction, concrete micro-steps that overcome executive dysfunction.
Return ONLY valid JSON matching this schema:
{
  "subtasks": [
    { "id": "1", "title": "First ultra-low friction step (takes < 5 mins)", "completed": false },
    { "id": "2", "title": "Second core step", "completed": false },
    { "id": "3", "title": "Final wrap up / verification", "completed": false }
  ],
  "suggestedPriority": "medium",
  "suggestedEnergy": "medium",
  "estimatedMinutes": 30
}`;
    }

    if (action === "daily_plan") {
        const taskListStr = (tasks || []).map(t => `- ${t.title} [Priority: ${t.priority}, Est: ${t.estimatedMinutes}m]`).join("\n");
        return `You are a warm, empowering productivity coach. Review this list of tasks and generate a structured 3-part daily focus plan:
${taskListStr}

Return ONLY valid JSON matching this schema:
{
  "focusHeadline": "Punchy 1-sentence motivation for today",
  "morningFocus": "Top 1-2 tasks to knock out first",
  "afternoonFocus": "Follow-up tasks matching moderate energy",
  "quickWins": "Tiny momentum builder tasks"
}`;
    }

    return "Return valid JSON { \"status\": \"ok\" }";
}

function generateHeuristicResult(action, taskTitle = "", taskDescription = "", tasks = []) {
    const titleLower = taskTitle.toLowerCase();

    if (action === "decompose") {
        const subtasks = [];

        if (titleLower.includes("study") || titleLower.includes("exam") || titleLower.includes("read")) {
            subtasks.push({ id: "1", title: "Clear desk & open textbook/lecture notes", completed: false });
            subtasks.push({ id: "2", title: "Review high-level summaries & headings (10 mins)", completed: false });
            subtasks.push({ id: "3", title: "Active recall: write 5 key flashcard questions", completed: false });
            subtasks.push({ id: "4", title: "Solve 2 practice problems or self-quiz", completed: false });
        } else if (titleLower.includes("code") || titleLower.includes("bug") || titleLower.includes("feat") || titleLower.includes("app") || titleLower.includes("build")) {
            subtasks.push({ id: "1", title: "Reproduce issue or define acceptance criteria", completed: false });
            subtasks.push({ id: "2", title: "Write failing test or scaffold component", completed: false });
            subtasks.push({ id: "3", title: "Implement core business logic", completed: false });
            subtasks.push({ id: "4", title: "Run linter, test suite & verify edge cases", completed: false });
        } else if (titleLower.includes("report") || titleLower.includes("write") || titleLower.includes("essay") || titleLower.includes("paper")) {
            subtasks.push({ id: "1", title: "Create blank document & bullet-point 3 main ideas", completed: false });
            subtasks.push({ id: "2", title: "Draft rough introductory paragraph (ignore perfection)", completed: false });
            subtasks.push({ id: "3", title: "Flesh out evidence / body arguments", completed: false });
            subtasks.push({ id: "4", title: "Spellcheck & format citations", completed: false });
        } else {
            subtasks.push({ id: "1", title: `Gather initial tools and references for: ${taskTitle}`, completed: false });
            subtasks.push({ id: "2", title: "Draft first 15-minute quick version", completed: false });
            subtasks.push({ id: "3", title: "Review, refine and polish final details", completed: false });
        }

        return {
            subtasks,
            suggestedPriority: titleLower.includes("urgent") || titleLower.includes("asap") ? "urgent" : "high",
            suggestedEnergy: titleLower.includes("read") || titleLower.includes("call") ? "low" : "high",
            estimatedMinutes: 45
        };
    }

    if (action === "daily_plan") {
        const pending = (tasks || []).filter(t => t.status !== "completed");
        const topTask = pending[0]?.title || "Focus on your primary goal";
        const secondTask = pending[1]?.title || "Review pending notes";

        return {
            focusHeadline: "Protect your energy today: one single win builds the entire day's momentum.",
            morningFocus: `Tackle deep work: "${topTask}"`,
            afternoonFocus: `Follow through on: "${secondTask}"`,
            quickWins: "Clear browser tabs and check off 1 quick administrative task"
        };
    }

    return { status: "ready" };
}
