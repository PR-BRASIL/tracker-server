interface PatentRange {
  min: number;
  max: number;
  name: string;
}

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

export function calculatePatent(score: number): string {
  const patent = patentRanges.find(
    (range) => score >= range.min && score <= range.max
  );
  return patent?.name || "Recruta";
}

export function calculateProgressText(score: number): string {
  const currentPatent = patentRanges.find(
    (range) => score >= range.min && score <= range.max
  );

  if (!currentPatent) return "[..........] 0/0";

  // Se for a última patente, mostra 100% de progresso
  if (currentPatent.max === Number.MAX_SAFE_INTEGER) {
    return "[##########] MAX";
  }

  const nextPatentMin = currentPatent.max + 1;
  const totalToNextPatent = nextPatentMin - currentPatent.min;
  const currentProgress = score - currentPatent.min;
  const progressPercent = Math.min(1, currentProgress / totalToNextPatent);

  // Cria a barra de progresso visual
  const filledBlocks = Math.round(progressPercent * 10);
  const emptyBlocks = 10 - filledBlocks;
  const progressBar = `[${"#".repeat(filledBlocks)}${".".repeat(emptyBlocks)}]`;

  return `${progressBar} ${currentProgress}/${totalToNextPatent}`;
}
