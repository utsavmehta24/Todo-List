/**
 * Natural Language Task Parser
 * Examples:
 *   "Finish chemistry lab report tomorrow 5pm #college !high ~45m @high"
 *   "Review PR for auth flow in 2 days #work !urgent ~30m @medium"
 *   "Call dentist next monday 10am #personal !low ~15m @quick"
 */

export function parseNaturalLanguageTask(input) {
    if (!input || typeof input !== "string") {
        return {
            title: "",
            tags: [],
            priority: "medium",
            energy: "medium",
            estimatedMinutes: 30,
            dueDate: null,
            project: "General",
        };
    }

    let text = input.trim();
    const tags = [];
    let priority = "medium";
    let energy = "medium";
    let estimatedMinutes = 30;
    let dueDate = null;
    let project = "General";

    // 1. Extract Tags (#tag)
    const tagMatches = text.match(/#([a-zA-Z0-9_\-]+)/g);
    if (tagMatches) {
        tagMatches.forEach((t) => {
            const cleanTag = t.substring(1).toLowerCase();
            if (!tags.includes(cleanTag)) {
                tags.push(cleanTag);
            }
            // Use first tag as project if not set
            if (project === "General") {
                project = cleanTag.charAt(0).toUpperCase() + cleanTag.slice(1);
            }
        });
        text = text.replace(/#([a-zA-Z0-9_\-]+)/g, "");
    }

    // 2. Extract Priority (!high, !urgent, !medium, !low, !p1, !p2, !p3)
    const priorityMatch = text.match(/!(urgent|high|medium|med|low|p1|p2|p3|p4)/i);
    if (priorityMatch) {
        const val = priorityMatch[1].toLowerCase();
        if (val === "urgent" || val === "p1") priority = "urgent";
        else if (val === "high" || val === "p2") priority = "high";
        else if (val === "medium" || val === "med" || val === "p3") priority = "medium";
        else if (val === "low" || val === "p4") priority = "low";

        text = text.replace(/!(urgent|high|medium|med|low|p1|p2|p3|p4)/i, "");
    }

    // 3. Extract Energy Level (@quick, @low, @medium, @high)
    const energyMatch = text.match(/@(quick|quick_win|low|medium|med|high)/i);
    if (energyMatch) {
        const eVal = energyMatch[1].toLowerCase();
        if (eVal === "quick" || eVal === "quick_win") energy = "quick_win";
        else if (eVal === "low") energy = "low";
        else if (eVal === "medium" || eVal === "med") energy = "medium";
        else if (eVal === "high") energy = "high";

        text = text.replace(/@(quick|quick_win|low|medium|med|high)/i, "");
    }

    // 4. Extract Time Estimate (~30m, ~1h, ~45min, ~1.5h)
    const timeMatch = text.match(/~([0-9.]+)\s*(m|min|mins|h|hr|hours)?/i);
    if (timeMatch) {
        const num = parseFloat(timeMatch[1]);
        const unit = (timeMatch[2] || "m").toLowerCase();
        if (unit.startsWith("h")) {
            estimatedMinutes = Math.round(num * 60);
        } else {
            estimatedMinutes = Math.round(num);
        }
        text = text.replace(/~([0-9.]+)\s*(m|min|mins|h|hr|hours)?/i, "");
    }

    // 5. Extract Due Dates (today, tomorrow, in X days, monday..sunday, at HH(:MM)(am/pm))
    const now = new Date();
    let targetDate = new Date();
    let dateFound = false;

    // Time matching (e.g. "at 5pm", "5:30pm", "14:00")
    let targetHours = 18; // default 6 PM if only date given
    let targetMinutes = 0;
    const timeRegex = /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i;
    const timeParsed = text.match(timeRegex);

    if (timeParsed && (timeParsed[3] || text.includes("at "))) {
        let h = parseInt(timeParsed[1], 10);
        const m = timeParsed[2] ? parseInt(timeParsed[2], 10) : 0;
        const meridian = timeParsed[3]?.toLowerCase();

        if (meridian === "pm" && h < 12) h += 12;
        if (meridian === "am" && h === 12) h = 0;

        if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
            targetHours = h;
            targetMinutes = m;
            text = text.replace(timeRegex, "");
        }
    }

    // "today"
    if (/\btoday\b/i.test(text)) {
        targetDate = new Date();
        dateFound = true;
        text = text.replace(/\btoday\b/i, "");
    }
    // "tomorrow"
    else if (/\btomorrow\b/i.test(text)) {
        targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        dateFound = true;
        text = text.replace(/\btomorrow\b/i, "");
    }
    // "in X days"
    else if (/\bin\s+(\d+)\s+days?\b/i.test(text)) {
        const match = text.match(/\bin\s+(\d+)\s+days?\b/i);
        const days = parseInt(match[1], 10);
        targetDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        dateFound = true;
        text = text.replace(/\bin\s+(\d+)\s+days?\b/i, "");
    }
    // Day of week: "monday", "tuesday", etc.
    else {
        const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        for (let i = 0; i < daysOfWeek.length; i++) {
            const regex = new RegExp(`\\b(?:next\\s+)?${daysOfWeek[i]}\\b`, "i");
            if (regex.test(text)) {
                const currentDay = now.getDay();
                let diff = (i - currentDay + 7) % 7;
                if (diff === 0) diff = 7; // next week if today
                targetDate = new Date(now.getTime() + diff * 24 * 60 * 60 * 1000);
                dateFound = true;
                text = text.replace(regex, "");
                break;
            }
        }
    }

    if (dateFound) {
        targetDate.setHours(targetHours, targetMinutes, 0, 0);
        dueDate = targetDate.toISOString();
    }

    // Clean up title: collapse multiple spaces, remove leading/trailing punctuation
    const cleanTitle = text.replace(/\s+/g, " ").trim();

    return {
        title: cleanTitle || input.trim(),
        tags,
        priority,
        energy,
        estimatedMinutes,
        dueDate,
        project,
    };
}
