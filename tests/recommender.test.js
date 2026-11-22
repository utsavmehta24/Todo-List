import { describe, it, expect } from "vitest";
import { recommendNextTask } from "../src/utils/recommender";

describe("recommendNextTask", () => {
    const mockTasks = [
        {
            _id: "1",
            title: "3-Hour Complex Research Thesis",
            status: "pending",
            priority: "high",
            energy: "high",
            estimatedMinutes: 180,
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            _id: "2",
            title: "Reply to Team Standup Email",
            status: "pending",
            priority: "medium",
            energy: "quick_win",
            estimatedMinutes: 10,
            dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            _id: "3",
            title: "Fix broken build",
            status: "in_progress",
            priority: "urgent",
            energy: "medium",
            estimatedMinutes: 30,
            dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        },
    ];

    it("recommends a quick win when user energy is low and time is 15 minutes", () => {
        const result = recommendNextTask(mockTasks, {
            energyLevel: "low",
            availableMinutes: 15,
        });

        expect(result).not.toBeNull();
        expect(result.task._id).toBe("2");
        expect(result.reason).toContain("Quick win");
    });

    it("prioritizes in-progress urgent tasks when medium energy is available", () => {
        const result = recommendNextTask(mockTasks, {
            energyLevel: "medium",
            availableMinutes: 45,
        });

        expect(result).not.toBeNull();
        expect(result.task._id).toBe("3");
    });

    it("returns null when all tasks are completed", () => {
        const completedOnly = mockTasks.map(t => ({ ...t, status: "completed" }));
        const result = recommendNextTask(completedOnly, { energyLevel: "high", availableMinutes: 60 });
        expect(result).toBeNull();
    });
});
