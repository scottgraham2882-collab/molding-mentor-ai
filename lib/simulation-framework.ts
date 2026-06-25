export type SimulationChoice = {
  id: string;
  label: string;
  correct: boolean;
  explanation: string;
};

export type SimulationStep = {
  id: string;
  question: string;
  coachNote: string;
  choices: SimulationChoice[];
};

export type SimulationSummary = {
  didWell: string;
  canImprove: string;
  lessonLearned: string;
};

export type SimulationIntroDetail = {
  label: string;
  value: string;
};

export type SimulationScenario = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  introDetails: SimulationIntroDetail[];
  steps: SimulationStep[];
  summary: SimulationSummary;
};

export function getSimulationCorrectCount(scenario: SimulationScenario, selectedChoiceIds: string[]) {
  return selectedChoiceIds.reduce((count, choiceId, index) => {
    const choice = scenario.steps[index]?.choices.find((stepChoice) => stepChoice.id === choiceId);
    return count + (choice?.correct ? 1 : 0);
  }, 0);
}

export function getSimulationStepLabel(currentStepIndex: number, totalSteps: number) {
  return Math.min(currentStepIndex + 1, totalSteps);
}

export function getSimulationProgressPercent(currentStepIndex: number, totalSteps: number) {
  return (getSimulationStepLabel(currentStepIndex, totalSteps) / totalSteps) * 100;
}
