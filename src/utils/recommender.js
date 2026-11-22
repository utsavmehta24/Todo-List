/**
 * "What Should I Do Right Now?" Recommender Engine
 *
 * Designed to eliminate ADHD/Executive Dysfunction analysis paralysis.
 * Matches current mental energy, available time chunk, and urgency.
 */

export function recommendNextTask(tasks, criteria = {}) {
    const {
        energyLevel = "medium", // 'quick_win', 'low', 'medium', 'high'
        availableMinutes = 45,  // 15, 30, 45, 60, 120
        projectFilter = null,
    } = criteria;

    const pendingTasks = tasks.filter(
        (t) => t.status !== "completed" && (!projectFilter || t.project === projectFilter)
    );

    if (pendingTasks.length === 0) {
        return null;
    }

    const now = new Date().getTime();

    // Score each candidate task
    const scored = pendingTasks.map((task) => {
        let score = 0;

        // 1. Due Date Urgency
        if (task.dueDate) {
            const dueTime = new Date(task.dueDate).getTime();
            const diffHours = (dueTime - now) / (1000 * 60 * 60);

            if (diffHours < 0) {
                // Overdue
                score += 50;
            } else if (diffHours <= 24) {
                // Due today
                score += 35;
            } else if (diffHours <= 48) {
                // Due tomorrow
                score += 20;
            }
        }

        // 2. Priority Weight
        if (task.priority === "urgent") score += 40;
        else if (task.priority === "high") score += 25;
        else if (task.priority === "medium") score += 10;
        else if (task.priority === "low") score += 0;

        // 3. Energy Match
        const taskEnergy = task.energy || "medium";
        if (taskEnergy === energyLevel) {
            score += 30; // Perfect energy match
        } else if (
            (energyLevel === "low" && taskEnergy === "quick_win") ||
            (energyLevel === "medium" && taskEnergy === "low") ||
            (energyLevel === "high" && taskEnergy === "medium")
        ) {
            score += 15; // Adjacent manageable energy
        } else if (energyLevel === "low" && taskEnergy === "high") {
            score -= 30; // Penalize high energy tasks when user has low energy
        }

        // 4. Time Slot Fit
        const estTime = task.estimatedMinutes || 30;
        if (estTime <= availableMinutes) {
            score += 20; // Fits within available time window
            if (Math.abs(availableMinutes - estTime) <= 15) {
                score += 10; // Near-perfect fit for block
            }
        } else {
            score -= 25; // Task requires more time than user currently has
        }

        // 5. In Progress Boost
        if (task.status === "in_progress") {
            score += 20; // Momentum matters - finish what was started
        }

        return {
            task,
            score,
            reason: generateReason(task, energyLevel, availableMinutes),
        };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    return scored[0];
}

function generateReason(task, energyLevel, availableMinutes) {
    const est = task.estimatedMinutes || 30;
    const taskEnergy = task.energy || "medium";

    if (task.status === "in_progress") {
        return `You already started this. Keep the momentum going!`;
    }
    if (task.dueDate && new Date(task.dueDate).getTime() < Date.now()) {
        return `Overdue! Knocking this out removes mental drag immediately.`;
    }
    if (taskEnergy === "quick_win" || est <= 15) {
        return `Quick win (${est} mins)! Perfect to build dopamine and flow.`;
    }
    if (taskEnergy === energyLevel) {
        return `Matches your ${energyLevel} energy level and fits your ~${availableMinutes}m window.`;
    }
    return `High impact priority for today (${est} mins).`;
}
