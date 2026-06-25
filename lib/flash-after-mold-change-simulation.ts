import type { SimulationScenario } from "./simulation-framework";

export const flashAfterMoldChangeSimulation: SimulationScenario = {
  id: "flash-after-mold-change",
  eyebrow: "Interactive Troubleshooting Simulator",
  title: "Flash after mold change",
  description:
    "Practice a simple, people-first troubleshooting flow for a 250 Ton Press running ABS. One decision at a time, with the why explained after every answer.",
  introDetails: [
    { label: "Machine", value: "250 Ton Press" },
    { label: "Material", value: "ABS" },
    { label: "Defect", value: "Flash after mold change" },
  ],
  steps: [
    {
      id: "contain",
      question: "Flash appears right after a mold change on a 250 Ton Press running ABS. What is your first decision?",
      coachNote: "Start by protecting the customer and gathering evidence before changing the process.",
      choices: [
        {
          id: "contain-and-compare",
          label: "Hold suspect parts, save samples, and compare the setup to the approved process sheet.",
          correct: true,
          explanation:
            "Correct. Flash after a mold change may come from setup, clamp, mold shutoff, or process differences. Containment protects the customer, and comparing against the approved process gives you facts before adjustments.",
        },
        {
          id: "lower-pack-now",
          label: "Immediately lower pack pressure until the flash disappears.",
          correct: false,
          explanation:
            "Incorrect. Lowering pack may hide the symptom, but it can also create shorts, sinks, or dimensional problems. First verify whether the mold is closing correctly and whether the setup matches the standard.",
        },
        {
          id: "raise-clamp-all",
          label: "Raise clamp tonnage to maximum and restart production.",
          correct: false,
          explanation:
            "Incorrect. More clamp force is not always safer. Excess force can damage the mold or machine. Verify clamp setup, parting line condition, and the process before making a large change.",
        },
        {
          id: "keep-running",
          label: "Keep running because flash can be trimmed later.",
          correct: false,
          explanation:
            "Incorrect. Running known flash creates scrap, rework, and customer risk. Stop, contain, and understand the cause before continuing production.",
        },
      ],
    },
    {
      id: "mold-change-check",
      question: "The setup sheet looks close, but the flash is mainly on the parting line. What should you check next?",
      coachNote: "Because the defect started after a mold change, check mold fit and setup details before chasing melt settings.",
      choices: [
        {
          id: "parting-line-check",
          label: "Inspect parting line, leader pins, mold mounting, mold protection, and any debris on shutoffs.",
          correct: true,
          explanation:
            "Correct. Parting-line flash after a mold change often points to the mold not closing cleanly, debris, damaged shutoffs, or setup alignment. These checks address why plastic can escape.",
        },
        {
          id: "increase-melt-temp",
          label: "Increase melt temperature to help ABS flow better.",
          correct: false,
          explanation:
            "Incorrect. Hotter ABS usually flows easier and may make flash worse. The location and timing suggest a closing, shutoff, clamp, or setup issue should be checked first.",
        },
        {
          id: "speed-fill",
          label: "Increase injection speed so the cavity fills before pressure builds.",
          correct: false,
          explanation:
            "Incorrect. Faster fill can increase peak pressure and worsen flash. It does not explain why the issue began right after the mold change.",
        },
        {
          id: "change-material",
          label: "Switch to a different ABS lot before checking the mold.",
          correct: false,
          explanation:
            "Incorrect. Material can matter, but the problem started after a mold change and is on the parting line. Check the changed condition first.",
        },
      ],
    },
    {
      id: "clamp-process",
      question: "The mold faces are clean and mounted correctly. Flash remains. What evidence should guide the next action?",
      coachNote: "Use process evidence to decide whether the clamp is being overcome or whether pressure is higher than normal.",
      choices: [
        {
          id: "compare-pressure-cushion",
          label: "Compare cushion, transfer position, fill time, peak pressure, pack pressure, and clamp tonnage to the last good run.",
          correct: true,
          explanation:
            "Correct. These values show whether the process changed, whether the machine is overpacking, or whether clamp force is not enough for the current pressure. Evidence prevents guessing.",
        },
        {
          id: "random-low-temp",
          label: "Drop all barrel temperatures by 50°F and see what happens.",
          correct: false,
          explanation:
            "Incorrect. Large random temperature changes can create poor melt quality, short shots, or new defects. Make small, evidence-based changes only after checking actual process data.",
        },
        {
          id: "adjust-many",
          label: "Change fill speed, pack pressure, hold time, and cooling together to save time.",
          correct: false,
          explanation:
            "Incorrect. Multiple changes hide cause and effect. Troubleshooting builds knowledge by changing one controlled item at a time after verifying the basics.",
        },
        {
          id: "ignore-last-good",
          label: "Ignore the last good run because every startup is different.",
          correct: false,
          explanation:
            "Incorrect. Last-good-run data is one of the best references for preserving knowledge. It helps the team separate normal variation from a real change.",
        },
      ],
    },
    {
      id: "safe-correction",
      question: "Data shows pack pressure is higher than the approved sheet and cushion is larger than normal. What is the best correction plan?",
      coachNote: "Now that there is evidence, choose a controlled correction that protects quality and teaches the next person what changed.",
      choices: [
        {
          id: "restore-verify-document",
          label: "Return pack and shot size toward the approved values, verify parts, and document the lesson for the team.",
          correct: true,
          explanation:
            "Correct. The evidence points to overpacking or too much shot volume increasing cavity pressure. Restoring the approved process, verifying quality, and documenting the finding builds confidence and preserves knowledge.",
        },
        {
          id: "trim-approve",
          label: "Approve the run if the operator can trim the flash cleanly.",
          correct: false,
          explanation:
            "Incorrect. Trimming does not fix the cause and can hide a process or mold issue. The goal is stable production, not dependence on rework.",
        },
        {
          id: "max-clamp-anyway",
          label: "Keep the high pack pressure and compensate with maximum clamp tonnage.",
          correct: false,
          explanation:
            "Incorrect. Compensating with clamp force can stress equipment and does not address the confirmed process drift. Correct the process back toward the standard first.",
        },
        {
          id: "tell-next-shift",
          label: "Tell the next shift verbally and skip documentation because the issue is fixed.",
          correct: false,
          explanation:
            "Incorrect. Verbal handoff is easy to lose. A short written note preserves the lesson and supports collaboration across shifts.",
        },
      ],
    },
  ],
  summary: {
    didWell:
      "You completed the troubleshooting flow and made {correctCount} of {totalSteps} preferred decisions. You practiced containment, evidence gathering, mold-change checks, and controlled correction.",
    canImprove:
      "Keep avoiding guesswork. Do not change several settings together, do not use rework as the solution, and do not skip documentation after the issue is fixed.",
    lessonLearned:
      "Flash after a mold change is solved by asking what changed, checking the mold and setup first, then using process data to make one safe correction at a time.",
  },
};
