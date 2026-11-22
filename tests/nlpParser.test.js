import { describe, it, expect } from "vitest";
import { parseNaturalLanguageTask } from "../src/utils/nlpParser";

describe("parseNaturalLanguageTask", () => {
    it("extracts tags, priority, energy, and estimate correctly", () => {
        const input = "Finish biology lab report tomorrow 5pm #college #biology !high ~45m @high";
        const result = parseNaturalLanguageTask(input);

        expect(result.title).toBe("Finish biology lab report");
        expect(result.tags).toEqual(["college", "biology"]);
        expect(result.priority).toBe("high");
        expect(result.energy).toBe("high");
        expect(result.estimatedMinutes).toBe(45);
        expect(result.dueDate).not.toBeNull();
    });

    it("parses urgent priority and quick win energy", () => {
        const input = "Call landlord about heating !urgent @quick ~15m";
        const result = parseNaturalLanguageTask(input);

        expect(result.title).toBe("Call landlord about heating");
        expect(result.priority).toBe("urgent");
        expect(result.energy).toBe("quick_win");
        expect(result.estimatedMinutes).toBe(15);
    });

    it("handles plain text input with graceful defaults", () => {
        const input = "Buy groceries for dinner";
        const result = parseNaturalLanguageTask(input);

        expect(result.title).toBe("Buy groceries for dinner");
        expect(result.tags).toEqual([]);
        expect(result.priority).toBe("medium");
        expect(result.energy).toBe("medium");
        expect(result.estimatedMinutes).toBe(30);
        expect(result.dueDate).toBeNull();
    });

    it("handles hour estimations (~1.5h)", () => {
        const input = "Code auth refactor #work ~1.5h";
        const result = parseNaturalLanguageTask(input);

        expect(result.title).toBe("Code auth refactor");
        expect(result.estimatedMinutes).toBe(90);
        expect(result.tags).toEqual(["work"]);
    });
});
