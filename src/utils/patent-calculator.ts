interface PatentRange {
  min: number;
  max: number;
  name: string;
}

// Fallback patent ranges if MongoDB connection fails
const patentRanges: PatentRange[] = [
  { min: 0, max: 999, name: "Recruta" },
  { min: 1000, max: 2499, name: "Soldado" },
  { min: 2500, max: 4999, name: "Cabo" },
  { min: 5000, max: 9999, name: "Sargento" },
  { min: 10000, max: 19999, name: "Tenente" },
  { min: 20000, max: 34999, name: "Capitão" },
  { min: 35000, max: 49999, name: "Major" },
  { min: 50000, max: 74999, name: "Coronel" },
  { min: 75000, max: 99999, name: "General" },
  { min: 100000, max: Number.MAX_SAFE_INTEGER, name: "Marechal" },
];

import { mongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";

export interface Patent {
  score: number;
  name: string;
}

export class PatentCalculator {
  /**
   * Calculates the current patent based on score
   */
  public async calculatePatent(score: number): Promise<string> {
    try {
      const collection = await mongoHelper.getCollection("patents");
      const patents = await collection.find<Patent>({}).toArray();

      if (!patents || patents.length === 0) {
        // Fallback to hardcoded patents
        const patent = patentRanges.find(
          (range) => score >= range.min && score <= range.max
        );
        return patent?.name || "Recruta";
      }

      // Sort patents by score
      const sortedPatents = patents.sort((a, b) => a.score - b.score);

      // Find the highest patent that the score qualifies for
      for (let i = sortedPatents.length - 1; i >= 0; i--) {
        if (score >= sortedPatents[i].score) {
          return sortedPatents[i].name;
        }
      }

      // Default to the lowest patent if none found
      return sortedPatents[0]?.name || "Recruta";
    } catch (error) {
      // Fallback to hardcoded patents in case of error
      const patent = patentRanges.find(
        (range) => score >= range.min && score <= range.max
      );
      return patent?.name || "Recruta";
    }
  }

  /**
   * Calculates the progress text with visual progress bar
   */
  public async calculateProgressText(score: number): Promise<string> {
    try {
      const collection = await mongoHelper.getCollection("patents");
      const patents = await collection.find<Patent>({}).toArray();

      if (!patents || patents.length === 0) {
        // Fallback to hardcoded patents
        return this.calculateProgressTextFromRanges(score);
      }

      // Sort patents by score
      const sortedPatents = patents.sort((a, b) => a.score - b.score);

      // Find the current patent and the next patent
      const currentPatentIndex =
        sortedPatents.findIndex((p) => score < p.score) - 1;

      // If we're at the highest patent or no patents found
      if (
        currentPatentIndex < 0 ||
        currentPatentIndex === sortedPatents.length - 1
      ) {
        return "[##########] MAX";
      }

      const currentPatent = sortedPatents[currentPatentIndex];
      const nextPatent = sortedPatents[currentPatentIndex + 1];

      // Calculate progress to next patent
      const totalToNextPatent = nextPatent.score - currentPatent.score;
      const currentProgress = score - currentPatent.score;

      return this.getProgressBar(currentProgress, totalToNextPatent);
    } catch (error) {
      // Fallback to hardcoded patents in case of error
      return this.calculateProgressTextFromRanges(score);
    }
  }

  /**
   * Fallback method using hardcoded patent ranges
   */
  private calculateProgressTextFromRanges(score: number): string {
    const currentPatent = patentRanges.find(
      (range) => score >= range.min && score <= range.max
    );

    if (!currentPatent) return "[..........] 0/0";

    // If it's the highest patent, show 100% progress
    if (currentPatent.max === Number.MAX_SAFE_INTEGER) {
      return "[##########] MAX";
    }

    const nextPatentMin = currentPatent.max + 1;
    const totalToNextPatent = nextPatentMin - currentPatent.min;
    const currentProgress = score - currentPatent.min;

    return this.getProgressBar(currentProgress, totalToNextPatent);
  }

  /**
   * Generates a progress bar with # for filled and . for empty spaces
   */
  private getProgressBar(
    currentValue: number,
    desiredValue: number,
    barSize: number = 30
  ): string {
    if (currentValue < 0 || currentValue > desiredValue) {
      // Handle edge cases
      return currentValue >= desiredValue
        ? "[##############################] MAX"
        : "[..............................] 0/0";
    }

    const progressPercent = Math.min(1, currentValue / desiredValue);

    // Create visual progress bar
    const filledBlocks = Math.round(progressPercent * barSize);
    const emptyBlocks = barSize - filledBlocks;
    const progressBar = `[${"#".repeat(filledBlocks)}${".".repeat(
      emptyBlocks
    )}]`;

    return `${progressBar} ${currentValue}/${desiredValue}`;
  }
}
